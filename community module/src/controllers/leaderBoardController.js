const pool = require("../config/db");

exports.getLeaderboard = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT accounts_user.id, accounts_user.email, accounts_leaderboard.points FROM accounts_leaderboard JOIN accounts_user ON accounts_leaderboard.user_id = accounts_user.id ORDER BY points DESC"
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
