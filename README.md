# Chat App

A real-time chat application built with Node.js, Express, and Socket.IO.

## Features

- Real-time messaging with WebSocket
- Public broadcast messages
- Private/direct messages to specific users
- Typing indicators
- Simple and clean UI

## Tech Stack

- **Backend**: Express.js, Socket.IO
- **Language**: TypeScript
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js
- pnpm

### Installation

```bash
pnpm install
```

### Running the App

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

## Usage

1. Enter your username in the username field
2. To send a public message, leave the "To" field empty
3. To send a private message, enter the recipient's username in the "To" field
4. Type your message and press Enter or click Send

## Project Structure

```
chat-app/
├── src/
│   └── index.ts        # Server entry point
├── public/
│   ├── index.html      # Frontend HTML
│   ├── client.js       # Client-side JavaScript
│   └── style.css       # Styles
├── package.json
├── tsconfig.json
└── .env
```