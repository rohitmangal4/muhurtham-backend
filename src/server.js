// server.js
const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const Message = require('./models/Message');

dotenv.config();

// App & server
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  },
});


connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/interest', require('./routes/interestRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// 💬 Real-time Chat via Socket.IO
io.on('connection', (socket) => {
  console.log('🔌 Socket connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
  });

  socket.on('sendMessage', async (data) => {
    const { senderId, receiverId, content } = data;

    try {
      // Save message in DB
      const message = new Message({ senderId, receiverId, content });
      await message.save();

      // Emit to receiver
      io.to(receiverId).emit('receiveMessage', {
        senderId,
        receiverId,
        content,
        createdAt: message.createdAt,
      });
    } catch (err) {
      console.error("Socket message save error:", err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected:', socket.id);
  });
});

// 🌍 Expose io if needed
app.set('io', io);

// 🚀 Start server
const PORT = process.env.PORT || 7000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
