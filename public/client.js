let socket = io.connect("http://localhost:5001");

let btn = document.getElementById("btn");
let chat = document.getElementById("chat");
let username = document.getElementById("username");
let recipient = document.getElementById("recipient");
let message = document.getElementById("message");
let broadcast = document.getElementById("broadcast");

// Register user when username changes
username.addEventListener("input", function () {
  if (username.value) {
    socket.emit("register", username.value);
  }
});

// Core Logic: Send message on click
btn.addEventListener("click", function () {
  if (!username.value || !message.value) return;
  socket.emit("message", {
    username: username.value,
    message: message.value,
    recipient: recipient.value || null,
  });
  message.value = ""; // Clear input after sending
});

// Added Feature: Send message on Enter key press
message.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault(); // Prevent newline
    btn.click();
  }
});

// Core Logic: Typing indicator
message.addEventListener("keypress", function (e) {
  socket.emit("typing", {
    username: username.value,
    recipient: recipient.value || null,
  });
});

socket.on("new_message", function (data) {
  broadcast.innerHTML = "";
  // Added Feature: Timestamps
  const timestamp = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Determine if it's our message
  const isMine = data.username === username.value;
  const alignClass = isMine ? "message-mine" : "message-other";

  // Display recipient info if private
  const privateLabel = data.isPrivate
    ? `<span style="color: purple; font-size: 0.75rem; margin-left: 5px;">(Private)</span>`
    : "";

  chat.innerHTML += `
    <div class="message-container ${alignClass}">
      <div class="message-header">
        <span class="username">${data.username} ${privateLabel}</span>
        <span class="time">${timestamp}</span>
      </div>
      <div class="message-text">${data.message}</div>
    </div>
  `;

  // Added Feature: Auto-scroll
  chat.scrollTop = chat.scrollHeight;
});
let typingTimeout;
socket.on("broad", function (data) {
  console.log(data);
  broadcast.innerHTML = `
      <span><i>${data.username} is typing...</i> <img src="./write.gif" style="width: 15px; height: 15px; vertical-align: middle;" alt="" /></span>
  `;

  // Clear typing indicator after 2 seconds of no typing
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    broadcast.innerHTML = "";
  }, 2000);
});
