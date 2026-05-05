import './App.css';
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Editor from "@monaco-editor/react";
import { SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";

function App() {

  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState("");
  const [code, setCode] = useState("");
  const [users, setUsers] = useState([]);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const s = io('https://colabcode-backend-23fr.onrender.com');
    // const s = io('http://localhost:5123');
    setSocket(s);

    s.on("connect", () => {
      console.log("Connected:", s.id);
    });

    // receive code updates
    s.on("receive_code", (newCode) => {
      setCode(newCode);
    });
    

    // receive users list
    s.on("room_users", (userList) => {
      setUsers(userList);
    });

    return () => s.disconnect();
  }, []);

const getSafeUser = () => {
  if (!user) return null;   // 🛡️ guard

  const name =
    user.fullName?.trim() ||
    user.firstName?.trim() ||
    user.primaryEmailAddress?.emailAddress ||
    "User";

  return {
    id: user.id,
    name,
    avatar:
      user.profileImageUrl ||
      user.imageUrl ||
      `https://ui-avatars.com/api/?name=${name}`
  };
};

  // join room
const joinRoom = () => {
  if (!room || !socket || !user || !isLoaded) return;

  socket.emit("join_room", {
    room,
    user: getSafeUser()
  });
};

  // create room
const createRoom = () => {
  if (!socket || !user || !isLoaded) return;

  const id = Math.random().toString(36).substring(2, 7);
  setRoom(id);

  socket.emit("join_room", {
    room: id, // ✅ FIX
    user: getSafeUser()
  });
};

  

  return (
    <>
    <SignedOut>
      <div className="h-screen flex items-center justify-center bg-black">
        <SignIn />
      </div>
    </SignedOut>

    <SignedIn>
  <div className="h-screen bg-[#1e1e1e] text-gray-200 flex flex-col">

    {/* Top Bar */}
    <div className="h-10 bg-[#2c2c2c] flex items-center px-4 justify-between border-b border-gray-700">

      {/* Mac Buttons */}
      <div className="flex gap-2">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
      </div>

      {/* Room Controls */}
      <div className="flex gap-2 items-center">
        <input
          className="bg-[#1e1e1e] border border-gray-600 px-3 py-1 rounded text-sm outline-none"
          placeholder="Room ID"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />

        <button
          onClick={joinRoom}
          className="bg-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-700"
        >
          Join
        </button>

        <button
          onClick={createRoom}
          className="bg-green-600 px-3 py-1 rounded text-sm hover:bg-green-700"
        >
          New
        </button>
      </div>

      {/* Placeholder (right side spacing) */}
      <div className="flex items-center gap-2">
  {isLoaded && user && (
    <>
      <span className="text-sm text-gray-300 hidden sm:block">
        {user.fullName || user.firstName || "User"}
      </span>

      <img
        src={user.profileImageUrl || user.imageUrl || `https://ui-avatars.com/api/?name=${user.firstName || "U"}`}
        alt="profile"
        className="w-8 h-8 rounded-full border border-gray-600 hover:scale-105 transition"
      />
    </>
  )}
</div>
    </div>

    {/* Main Layout */}
    <div className="flex flex-1 overflow-hidden">

      {/* Activity Bar (left thin bar) */}
      <div className="w-12 bg-[#2c2c2c] flex flex-col items-center py-4 gap-4 border-r border-gray-700">
        <div className="w-6 h-6 bg-gray-500 rounded"></div>
        <div className="w-6 h-6 bg-gray-500 rounded"></div>
        <div className="w-6 h-6 bg-gray-500 rounded"></div>
      </div>

      {/* Sidebar (Users) */}
      <div className="w-64 bg-[#252526] border-r border-gray-700 flex flex-col">
        <div className="p-3 text-sm text-gray-400 border-b border-gray-700">
          CONNECTED USERS
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {users.length === 0 && (
            <p className="text-gray-500 text-xs px-2">No users</p>
          )}

          {users.map((u, i) => {
  const currentUser = u.user || {};
  const isMe = currentUser.id === user?.id;

  return (
    <div
      key={u.socketId || i}
      className={`flex items-center gap-2 p-2 rounded transition ${
        isMe ? "bg-[#37373d]" : "hover:bg-[#2c2c2c]"
      }`}
    >
      <img
        src={
          currentUser.avatar ||
          `https://ui-avatars.com/api/?name=${currentUser.name || "U"}`
        }
        alt="avatar"
        className="w-7 h-7 rounded-full border border-gray-600"
      />

      <span className="text-sm flex-1">
        {currentUser.name || "Anonymous"}
      </span>

      {isMe && (
        <span className="text-[10px] text-green-400">(You)</span>
      )}
    </div>
  );
})}
        </div>
      </div>

      {/* Editor Section */}
      <div className="flex-1 flex flex-col">

        {/* File Tab */}
        <div className="h-9 bg-[#2d2d2d] flex items-center text-sm border-b px-4">
          fileName
        </div>

        {/* Editor */}
        <Editor
          height="100%"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={code}
          onChange={(value) => {
  if (value === undefined) return;
  setCode(value);
  if (socket) {
    socket.emit("send_code", { room, code: value });
  }
}}
        />
        
      </div>
    </div>
</div>
</SignedIn>
</>
);
}

export default App;