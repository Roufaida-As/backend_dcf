const app = require("./src/app");
const PORT = process.env.PORT || 5000;
require('dotenv').config();
const { Pool } = require('pg');
const http = require("http");
const { Server } = require("socket.io");
const chatRouter=require('./src/routes/chatRouter');


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// WebSocket connection

app.use((req, res, next) => {
  req.io = io;
  next();  
});

app.use("/chat",chatRouter);



io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join a chat room
  socket.on("joinChat", (chat_group_id) => {
      socket.join(`chat-${chat_group_id}`);
      console.log(`User joined chat group ${chat_group_id}`);
  });

  // Send and broadcast messages
  socket.on("sendMessage", async ({ chat_group_id, sender_id, content }) => {
      const message = await pool.query(
          "INSERT INTO accounts_message (content, timestamp, chat_group_id, sender_id) VALUES ($1, NOW(), $2, $3) RETURNING *",
          [content, chat_group_id, sender_id]
      );


      io.to(`chat-${chat_group_id}`).emit("newMessage", message.rows[0]);
  });

  socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
  });
});

pool.connect()
  .then(client => {
    console.log("Connected to PostgreSQL");
    client.release();
  })
  .catch(err => console.error(" Connection error", err.stack));



server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


module.exports = { io };