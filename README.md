

```markdown
# 🗨️ QuickChat

**QuickChat** is a real-time messaging application built with the MERN stack, Socket.io, and JWT. It supports one-on-one and group chats with secure authentication and persistent message storage.

---

## 🚀 Features

- 🔐 **Authentication** – Secure login/signup using **JWT** tokens.
- 💬 **Real-Time Messaging** – Instant messaging with **Socket.io**.
- 👥 **One-on-One & Group Chats** – Create or join conversations easily.
- 🧠 **Chat Persistence** – Chat history saved in **MongoDB** for continuous access.
- ⚡ **Optimized APIs** – Fast and structured APIs using **Node.js + Express**.
- 🎨 **Modern UI** – Clean interface built with **React** and **Chakra UI**.

---

## 🛠️ Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React.js, Chakra UI                 |
| Backend   | Node.js, Express.js                 |
| Database  | MongoDB                             |
| Real-Time | Socket.io                           |
| Auth      | JSON Web Tokens (JWT)               |
| Others    | Axios, REST API, Postman (for testing)

---

## 📁 Folder Structure

```

QuickChat/
├── client/              # React frontend
│   ├── components/
│   ├── context/
│   └── pages/
├── server/              # Express backend
│   ├── config/
│   ├── controllers/
│   ├── models/
│   └── routes/
├── .env
└── README.md

````

---

## 📦 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/rohan11110/QuickChat.git
cd QuickChat
````

### 2️⃣ Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3️⃣ Set Up Environment Variables

Create a `.env` file in `/server` with:

```
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
PORT=5000
```

### 4️⃣ Run the App

```bash
# Run backend
cd server
npm run dev

# Run frontend
cd ../client
npm start
```

Visit the app at: `http://localhost:3000`

---

## ✨ Screenshots

*(Add screenshots here if available)*

---

## 🔗 Links

* GitHub Repo: [QuickChat](https://github.com/rohan11110/QuickChat)
* Live Demo: *Coming Soon*

---

## 📌 Future Enhancements

* ✅ Typing indicators
* ✅ Message read receipts
* ✅ Image & media sharing
* ✅ Push notifications

---

## 🤝 Contributing

Contributions are welcome! Please open issues or pull requests.

---

## 📄 License

This project is licensed under the MIT License.

---

```

---

