const pool = require("../config/db");

exports.createPost = async (req, res) => {
    const { user_id, content } = req.body;
    const images = req.files; // Multiple uploaded images

    try {
        // 1️⃣ Insert post into `accounts_post`
        const postResult = await pool.query(
            "INSERT INTO accounts_post (user_id, content, created_at) VALUES ($1, $2, NOW()) RETURNING id",
            [user_id, content]
        );

        const postId = postResult.rows[0].id;

        // 2️⃣ Insert images into `accounts_postimage` (if any)
        if (images && images.length > 0) {
            const imageQueries = images.map((file) =>
                pool.query(
                    "INSERT INTO accounts_postimage (post_id, image, created_at) VALUES ($1, $2, NOW())",
                    [postId, file.filename]
                )
            );
            await Promise.all(imageQueries);
        }

        res.status(201).json({ message: "Post created successfully!", postId, images, content });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.updatePost = async (req, res) => {
    const { post_id } = req.params;
    const { content } = req.body;
    const images = req.files;

    try {
        // Update post content
        await pool.query(
            "UPDATE accounts_post SET content = $1 WHERE id = $2",
            [content, post_id]
        );

        // Delete old images & add new ones
        await pool.query("DELETE FROM accounts_postimage WHERE post_id = $1", [post_id]);

        for (const file of images) {
            await pool.query(
                "INSERT INTO accounts_postimage (post_id, image, created_at) VALUES ($1, $2, NOW())",
                [post_id, file.filename]
            );
        }

        res.status(200).json({ message: "Post updated successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error while updating post" });
    }
};


exports.deletePost = async (req, res) => {
    const { post_id } = req.params;

    try {
        // Delete images first (to maintain foreign key constraints)
        await pool.query("DELETE FROM accounts_postimage WHERE post_id = $1", [post_id]);

        // Then delete the post
        await pool.query("DELETE FROM accounts_post WHERE id = $1", [post_id]);

        res.status(200).json({ message: "Post deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error while deleting post" });
    }
};