const pool = require("../config/db");

exports.likePost = async (req, res) => {
    const { post_id, user_id } = req.body;

    if (!post_id || !user_id) {
        return res.status(400).json({ error: "post_id and user_id are required" });
    }

    try {
        await pool.query(
            "INSERT INTO accounts_like (post_id, user_id) VALUES ($1, $2) ON CONFLICT (post_id, user_id) DO NOTHING",
            [post_id, user_id]
        );
        res.status(200).json({ message: "Post liked successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.unlikePost = async (req, res) => {
    const { post_id, user_id } = req.body;
    try {
        await pool.query("DELETE FROM accounts_like WHERE post_id = $1 AND user_id = $2", [post_id, user_id]);
        res.status(200).json({ message: "Post unliked successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
