import express from 'express'
import { createServer } from "http";
import dotenv from 'dotenv'
dotenv.config()
import { Server } from 'socket.io'
const app = express()
const server = createServer(app)
const io = new Server(server)

const users: Record<string, string> = {};

app.use(express.static('public'))
app.get("/", (req, res) => {
    res.send("API is running");
});
io.on('connection', (socket) => {
    socket.on('register', (username) => {
        users[username] = socket.id;
    })

    socket.on('message', function (data) {
        // Ensure sender is registered
        if (data.username) {
            users[data.username] = socket.id;
        }

        if (data.recipient) {
            const targetSocket = users[data.recipient];
            if (targetSocket) {
                // Private message to recipient and back to sender
                io.to(targetSocket).emit('new_message', { ...data, isPrivate: true });
                // Don't send back if they messaged themselves
                if (targetSocket !== socket.id) {
                    socket.emit('new_message', { ...data, isPrivate: true });
                }
            } else {
                // Inform sender that recipient is offline
                socket.emit('new_message', {
                    username: 'System',
                    message: `User ${data.recipient} is not online.`,
                    isPrivate: true
                });
            }
        } else {
            // Public broadcast
            io.emit('new_message', data)
        }
    })

    socket.on('typing', function (data) {
        // Ensure sender is registered
        if (data.username) {
            users[data.username] = socket.id;
        }

        if (data.recipient) {
            const targetSocket = users[data.recipient];
            if (targetSocket) {
                io.to(targetSocket).emit('broad', data);
            }
        } else {
            socket.broadcast.emit('broad', data)
        }
    })

    socket.on('disconnect', () => {
        for (const [username, id] of Object.entries(users)) {
            if (id === socket.id) {
                delete users[username];
                break;
            }
        }
    });
})

const port: number = Number(process.env.PORT) || 3000;
server.listen(port, () => {
    console.log(`app running on port ${port}`)
})