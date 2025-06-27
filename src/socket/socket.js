// backend/socket/socket.js
const socketSetup = (io) => {
  io.on('connection', (socket) => {
  console.log('🔌 Socket connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId); // ✅ joining private room
  });

  socket.on('sendMessage', async (data) => {
    const { senderId, receiverId, content } = data;

    try {
      // ✅ save to DB
      const message = new Message({ senderId, receiverId, content });
      await message.save();

      // ✅ emit to receiver’s room
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
};

module.exports = socketSetup;
