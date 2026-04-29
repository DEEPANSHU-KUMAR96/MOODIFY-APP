# 🎵 Moodify – AI Powered Mood Based Music App

Moodify is a **MERN stack application** that detects your **facial expressions in real-time** and plays music according to your mood.
It uses **MediaPipe Face Landmarker** to analyze facial expressions and automatically suggests songs based on detected emotions.

🌐 **Live Demo:**
https://moodify-app-n3r2.onrender.com

---

# 🚀 Features

* 🎭 **Real-time Face Expression Detection**
* 🎵 **Automatic Mood-Based Music Recommendation**
* 🔐 **User Authentication (Register / Login)**
* ☁️ **Cloud Image Storage using ImageKit**
* ⚡ **Fast Backend with Redis Caching**
* 📦 **REST API built with Express.js**
* 🎨 **Modern React Frontend**

---

# 🧠 How It Works

1. The camera captures your face in real-time.
2. **MediaPipe Face Landmarker** analyzes facial expressions.
3. Expressions are mapped to moods like:

   * Happy
   * Sad
   * Neutral
4. The app fetches songs from the backend API based on the detected mood.
5. Music automatically plays according to your emotion.

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Vite
* MediaPipe Face Landmarker
* Axios
* SCSS

## Backend

* Node.js
* Express.js
* MongoDB
* Redis
* JWT Authentication

## Cloud & Services

* ImageKit (Media Storage)
* MongoDB Atlas (Database)
* Render (Deployment)

---

# 📂 Project Structure

```
MOODIFY-APP
│
├── Backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── services
│   └── server.js
│
├── Frontend
│   ├── src
│   ├── components
│   ├── features
│   └── app.routes.jsx
```

---

# ⚙️ Installation

Install dependencies:

Backend:

```bash
cd Backend
npm install
```

Frontend:

```bash
cd Frontend
npm install
```

---

# ▶️ Run Locally

Start Backend:

```bash
npm run dev
```

Start Frontend:

```bash
npm run dev
```

---

# 🔑 Environment Variables

Create a `.env` file in the backend folder and add:

```
MONGODB_URI=
JWT_SECRET=
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=

IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=
```

---

# 🌍 Deployment

* **Frontend:** Render Static Site
* **Backend:** Render Web Service
* **Database:** MongoDB Atlas
* **Redis:** Cloud Redis
* **Media Storage:** ImageKit

---

# 👨‍💻 Author

**Deepanshu Kumar**

GitHub:
https://github.com/DEEPANSHU-KUMAR96

If
