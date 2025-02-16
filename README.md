# 🚀 Custom URL Shortener API
A scalable and efficient URL shortener API with built-in analytics, Google authentication using Firebase, rate limiting, and Redis caching.

## 📌 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features
- 🔗 Shorten long URLs
- 📊 Track click analytics (visits, referrer, etc.)
- 🔑 Google Sign-In authentication
- 🚀 High-performance caching using Redis
- ⏳ Rate limiting to prevent abuse
- 📦 Dockerized for easy deployment

## 🛠 Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (or PostgreSQL)
- **Cache:** Redis
- **Auth:** Firebase
- **Deployment:** Docker, Vercel

## ⚙️ Installation & Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/pankajkumarphe21/url-shorten-api
   cd url-shortener-api
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory and add:
     ```env
     PORT=8800
     MONGO_URI=mongodb+srv://...
     REDIS_HOST=redis-...
     JWT_SECRET=your-secret-key
     FIREBASE_PROJECT_ID=your-project-id
     FIREBASE_PRIVATE_KEY=your-private-key
     FIREBASE_CLIENT_EMAIL=firebase-adminsdk...
     BASE_URL=http://localhost:8800/api
     REDIS_PORT=12345
     REDIS_PASSWORD=redis-password
     ```
4. Run the API:
   ```sh
   node index.js
   ```

## 📡 API Endpoints

### 🔑 Google Sign-In
**POST** `/api/user/google-signin`
- **Body:**
  ```json
  {
    "idToken": "eYjhaghdhkakdakdjkjkdjkaj..."  // gets from firebase in frontend
  }
  ```
- **Response:**
  ```json
  {
    "message": "User authenticated successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "uid": "67b1700cf02112ce8d4f31a2",
        "email": "hadajhdk@gmail.com",
        "name": "Harish Kumar"
    }   
  }
  ```

### 🔗 Shorten a URL
**POST** `/api/shorten`
- **Body:**
  ```json
  {
    "longUrl": "https://example.com",
    "customAlias": "hifi", // optional
    "topic":"activation"  // optional
  }
  ```
- **Response:**
  ```json
  {
    "shortUrl": "https://yourdomain.com/abc123",
    "createdAt": "2025-02-16T10:24:25.102Z"
  }
  ```

### 🔗 Redirect to LongURL
**GET** `/api/shorten/:alias`
- **Response:**
  Redirects to original URL

### 📊 Get URL Analytics
**GET** `/api/analytics/:alias`
- **Response:**
  ```json
  {
    "totalClicks": 1,
    "uniqueUsers": 1,
    "clicksByDate": [
        {
            "date": "2025-02-16",
            "noOfClicks": 1
        }
    ],
    "osType": [
        {
            "osName": "Unknown",
            "uniqueClicks": 1,
            "uniqueUsers": 1
        }
    ],
    "deviceType": [
        {
            "deviceName": "desktop",
            "uniqueClicks": 1,
            "uniqueUsers": 1
        }
    ]
  }
  ```

### 📊 Get Topic-Based Analytics 
**GET** `/api/analytics/topic/:topic`
- **Response:**
  ```json
  {
    "totalClicks": 1,
    "uniqueUsers": 1,
    "clicksByDate": [
        {
            "date": "2025-02-16",
            "noOfClicks": 1
        }
    ],
    "urls": [
        {
            "shortUrl": "http://localhost:8800/api/shorten/:alias",
            "totalClicks": 1,
            "uniqueUsers": 1
        }
    ]
  }
  ```

### 📊 Get Overall Analytics 
**GET** `/api/analytics/overall`
- **Response:**
  ```json
  {
    "totalUrls": 2,
    "totalClicks": 1,
    "uniqueUsers": 1,
    "clicksByDate": [
        {
            "date": "2025-02-16",
            "noOfClicks": 1
        }
    ],
    "osType": [
        {
            "osName": "Unknown",
            "uniqueClicks": 1,
            "uniqueUsers": 1
        }
    ],
    "deviceType": [
        {
            "deviceName": "desktop",
            "uniqueClicks": 1,
            "uniqueUsers": 1
        }
    ]
  }
  ```

## 🌍 Deployment
To deploy using Docker:
```sh
docker-compose up --build
```
Deploying on Vercel:
```sh
vercel --prod
```

## 🤝 Contributing
Pull requests are welcome! Please open an issue for feature requests or bug reports.

## 📜 License
This project is licensed under the MIT License.