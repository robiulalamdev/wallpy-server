const socketIo = require("socket.io");
require("dotenv").config();
const VARIABLES = require("..");
const { updateLastActive } = require("../../modules/user/user.service");
const { ROLE_DATA } = require("../../modules/user/user.constants");

let usersById = new Map();
let usersBySocketId = new Map();

const addUser = (userInfo, socketId) => {
  if (!usersById.has(userInfo.id)) {
    const user = {
      userId: userInfo.id,
      socketId: socketId,
      role: userInfo?.role,
    };
    usersById.set(userInfo.id, user);
    usersBySocketId.set(socketId, user);
  }
};

const addPublicUser = (socketId) => {
  const user = {
    socketId: socketId,
  };
  usersBySocketId.set(socketId, user);
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

    socket.on("publicUser", () => {
      addPublicUser(socket.id);
      io.emit("getUsers", {
        visitors: Array.from(usersBySocketId.values()),
        total: usersBySocketId.size,
        users: Array.from(usersById.values()),
      });
    });

    socket.on("addUser", (user) => {
      addUser(user, socket.id);
      console.log(
        "🟢 Connected total: ",
        usersBySocketId.size,
        "  ",
        "Role: ",
        user?.role
      );
      io.emit("getUsers", {
        visitors: Array.from(usersBySocketId.values()),
        total: usersBySocketId.size,
        users: Array.from(usersById.values()),
      });
    });

    socket.on("requestExistUser", async (userId) => {
      io.emit("getCurrentUser", await getSocketUser(userId));
    });

    //when disconnect
    socket.on("disconnect", async () => {
      const user = await removeUser(socket.id);
      io.emit("getUsers", {
        visitors: Array.from(usersBySocketId.values()),
        total: usersBySocketId.size,
        users: Array.from(usersById.values()),
      });

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
