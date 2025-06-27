// server.js
const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const Message = require('./models/Message');
const socketSetup = require('./socket/socket')

dotenv.config();

// App & server
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'https://muhurtham-front-end.vercel.app', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
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

socketSetup(io);

// 🚀 Start server
const PORT = process.env.PORT || 7000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
