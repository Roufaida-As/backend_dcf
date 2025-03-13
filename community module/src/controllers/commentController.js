const pool = require("../config/db");

exports.addComment = async (req, res) => {
    const { post_id, user_id, content } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO accounts_comment (post_id, user_id, content, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *",
            [post_id, user_id, content]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getComments = async (req, res) => {
    const { post_id } = req.params;
    try {
        const result = await pool.query(
            "SELECT accounts_comment.*, accounts_user.email FROM accounts_comment JOIN accounts_user ON accounts_comment.user_id = accounts_user.id WHERE post_id = $1",
            [post_id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
