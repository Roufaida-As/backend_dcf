const pool = require("../config/db");

// Create or get a chat group for an event
exports.getOrCreateChatGroup = async (req, res) => {
    const { event_id, user_id } = req.body;

    try {
        // Check if the chat group already exists
        let chatGroup = await pool.query(
            "SELECT * FROM accounts_chatgroup WHERE event_id = $1",
            [event_id]
        );

        if (chatGroup.rowCount === 0) {
            // If it doesn't exist, create a new chat group for the event
            const newChatGroup = await pool.query(
                "INSERT INTO accounts_chatgroup (event_id) VALUES ($1) RETURNING *",
                [event_id]
            );
            chatGroup = newChatGroup;
        }

        const chat_group_id = chatGroup.rows[0].id;

        // Add the user to the chat group if not already a member
        const checkMembership = await pool.query(
            "SELECT * FROM accounts_chatgroupmembership WHERE chat_group_id = $1 AND members_id = $2",
            [chat_group_id, user_id]
        );

        if (checkMembership.rowCount === 0) {
            await pool.query(
                "INSERT INTO accounts_chatgroupmembership (chat_group_id, members_id, joined_at) VALUES ($1, $2, NOW())",
                [chat_group_id, user_id]
            );
        }

        res.json({ chat_group_id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Send a message in a chat group
exports.sendMessage = async (req, res) => {
    const { chat_group_id, sender_id, content } = req.body;

    try {
        const message = await pool.query(
            "INSERT INTO accounts_message (content, timestamp, chat_group_id, sender_id) VALUES ($1, NOW(), $2, $3) RETURNING *",
            [content, chat_group_id, sender_id]
        );

        // Emit the new message to all users in the group via WebSocket
        if (req.io) {
            req.io.to(`chat-${chat_group_id}`).emit("newMessage", message.rows[0]);
            console.log("Message sent via WebSocket.");
         
        } else {
            console.warn(" WebSocket instance (req.io) is undefined.");
        }

        res.json({ message: "Message sent successfully!", data: message.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.error });
    }
};

// Fetch all messages for a chat group
exports.getChatMessages = async (req, res) => {
    const { chat_group_id } = req.params;

    try {
        const messages = await pool.query(
            "SELECT * FROM accounts_message WHERE chat_group_id = $1 ORDER BY timestamp ASC",
            [chat_group_id]
        );

        res.json(messages.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};
