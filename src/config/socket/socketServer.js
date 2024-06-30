const socketIo = require("socket.io");
require("dotenv").config();
const VARIABLES = require("..");
const { updateLastActive } = require("../../modules/user/user.service");

let usersById = new Map();
let usersBySocketId = new Map();

const addUser = (userInfo, socketId) => {
  if (!usersById.has(userInfo.id)) {
    const user = {
      userId: userInfo.id,
      socketId: socketId,
    };
    usersById.set(userInfo.id, user);
    usersBySocketId.set(socketId, user);
  }
};

const getSocketUser = async (userId) => {
  return usersById.get(userId);
};

const getUserBySocketId = async (socketId) => {
  return usersBySocketId.get(socketId);
};

const removeUser = async (socketId) => {
  const user = usersBySocketId.get(socketId);
  if (user) {
    usersById.delete(user.userId);
    usersBySocketId.delete(socketId);
  }
  return user;
};

const getUsers = async (userId) => {
  const user = usersById.get(userId);
  return user ? [user] : [];
};

let io;
const initializeSocket = (Server) => {
  io = socketIo(Server, {
    cors: {
      origin: VARIABLES.CLIENT_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    //take userId and socketId from user
    socket.on("addUser", (user) => {
      addUser(user, socket.id);
      console.log("🟢 Connected total: ", usersById.size, "  ", "user: ", user);
      io.emit("getUsers", Array.from(usersById.values()));
    });

    //when disconnect
    socket.on("disconnect", async () => {
      const user = await removeUser(socket.id);
      io.emit("getUsers", Array.from(usersById.values()));

      if (user?.userId) {
        const timestamp = Date.now();
        const time = new Date(timestamp);
        updateLastActive({ lastActive: time.toISOString() }, user?.userId);
        io.emit("lastActive", {
          id: user?.userId,
          time: time.toISOString(),
        });
      }

      console.log("disconnected! 🔴");
    });
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

module.exports = { initializeSocket, getIo, getSocketUser };
