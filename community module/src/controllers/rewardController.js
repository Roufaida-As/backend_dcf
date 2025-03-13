const pool = require("../config/db");

exports.redeemReward = async (req, res) => {
    const { user_id, description, points } = req.body;

    if (!user_id || !description || !points) {
        return res.status(400).json({ error: "user_id, description, and points are required" });
    }

    try {
        // Check if user exists in leaderboard
        const userPoints = await pool.query(
            "SELECT points FROM accounts_leaderboard WHERE user_id = $1",
            [user_id]
        );

        if (userPoints.rowCount === 0) {
            // User is NOT in leaderboard → Add them with initial points
            await pool.query(
                "INSERT INTO accounts_leaderboard (user_id, points) VALUES ($1, $2)",
                [user_id, points]
            );
        } else {
            
            await pool.query(
                "UPDATE accounts_leaderboard SET points = points + $1 WHERE user_id = $2",
                [points, user_id]
            );
        }

        // Insert the reward into the rewards table
        await pool.query(
            "INSERT INTO accounts_reward (user_id, description, points, created_at) VALUES ($1, $2, $3, NOW())",
            [user_id, description, points]
        );

        res.json({ message: "Reward given successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};
