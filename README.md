# 🌦️ WeatherHub

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8-47a248.svg)](https://www.mongodb.com/)

> **WeatherHub** is a modern full-stack weather application built with the MERN stack. It delivers real-time weather, forecasts, air quality, and personalized weather insights through a clean, responsive, and user-friendly interface.

---

## 🚀 Live Demo

- **Frontend:** https://weather-hub-nine.vercel.app
- **Backend API:** https://weatherhub-mdip.onrender.com
- **Repository:** https://github.com/arpanaprajapati94-do/WeatherHub

---

## 📸 Screenshots

> Add a `screenshots/` folder with preview images of the Home, Dashboard, Compare, and Calendar pages.

```
screenshots/
├── home.png
├── dashboard.png
├── compare.png
└── calendar.png
```

---

## ✨ Features

### 🌤️ Weather
- Real-Time Weather
- Hourly Forecast
- 7-Day Forecast
- Air Quality Index (AQI)
- UV Index
- Humidity
- Wind Speed & Direction
- Air Pressure
- Visibility
- Feels Like Temperature
- Sunrise & Sunset

### 👤 User
- Registration & Login
- JWT Authentication
- User Profile
- Favorite Cities
- Search History
- Settings

### 🌍 Smart Features
- Current Location Detection (Geolocation)
- Weather Charts
- Dynamic Weather Background
- Weather-Based Animations
- Dark / Light Mode
- Temperature Toggle (°C / °F)
- PWA Support
- Responsive Design

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + Vite
- **Tailwind CSS**
- **Framer Motion** (animations)
- **React Router** (routing)
- **Axios** (HTTP client)
- **React Icons**

### Backend
- **Node.js** + **Express.js**
- **MongoDB** (Mongoose)
- **JWT** + **bcrypt** (authentication)

### APIs
- **OpenWeather API** (current weather, forecast, air pollution)
- **BigDataCloud** (reverse geocoding)

---

## 📁 Folder Structure

```text
WeatherHub/
│
├── client/               # React frontend
│   ├── public/           # Static assets, PWA files
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── context/      # React context providers
│       ├── hooks/        # Custom hooks
│       ├── pages/        # Route pages
│       ├── services/     # API service layer
│       └── data/         # Static data (cities)
│
├── server/               # Express backend
│   ├── config/           # Database config
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Auth + error handling
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   └── utils/            # Helper functions
│
├── CHANGELOG.md          # Version history
├── LICENSE               # MIT license
└── README.md
```

---

## ⚙️ Installation

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas (or local MongoDB)
- OpenWeather API key (optional — demo data works without it)

### 1. Clone the repository
```bash
git clone <repository-url>
cd WeatherHub
```

### 2. Install dependencies
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Configure environment variables
Create a `.env` file in the `server/` directory (see below).

### 4. Run the app
```bash
# Backend (from server/)
npm run dev

# Frontend (from client/)
npm run dev
```

Open http://localhost:5173 in your browser.

---

## 🔐 Environment Variables

Create a `.env` file inside the `server/` folder:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/weatherhub
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
WEATHER_API_KEY=your_openweather_api_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

> ⚠️ **Never commit your actual `.env` file.** Use `.env.example` as a template.

---

## 📡 API Reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint                    | Description                  | Auth |
| ------ | --------------------------- | ---------------------------- | ---- |
| GET    | `/health`                   | Health check                 | No   |
| POST   | `/auth/register`            | Register a new user          | No   |
| POST   | `/auth/login`               | Login user                   | No   |
| GET    | `/auth/me`                  | Get current user             | Yes  |
| PUT    | `/auth/me`                  | Update profile               | Yes  |
| PUT    | `/auth/password`            | Change password              | Yes  |
| DELETE | `/auth/me`                  | Delete account               | Yes  |
| GET    | `/weather?city=London`      | Current weather              | No   |
| GET    | `/weather/forecast?city=`   | Hourly + daily forecast      | No   |
| GET    | `/weather/air-quality?city=`| Air quality index (AQI)      | No   |
| GET    | `/weather/alerts?city=`     | Smart weather alerts         | No   |
| GET    | `/favourites`               | Get favourite cities         | Yes  |
| POST   | `/favourites`               | Add a favourite city         | Yes  |
| DELETE | `/favourites/:id`           | Remove a favourite city      | Yes  |
| GET    | `/history`                  | Get search history           | Yes  |
| POST   | `/history`                  | Save a search                | Yes  |
| DELETE | `/history`                  | Clear search history         | Yes  |

---

## 📱 Responsive Design

Fully responsive and tested on:
- **Desktop**
- **Tablet**
- **Mobile**

---

## 🔮 Future Enhancements

- Browser push notifications for weather alerts
- Offline weather cache
- Email verification
- Password reset flow
- Weather widget share/embed
- Multi-language support (Gujarati / Hindi / English)

---

## 👨‍💻 Author

**Arpana B. Prajapati**
- GitHub: [arpanaprajapati94-do](https://github.com/arpanaprajapati94-do)
- LinkedIn: [Arpana B. Prajapati](https://linkedin.com/in/arpana-b-prajapati-4239a235b)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## ⭐ Support

If you found this project helpful, please give it a ⭐ on GitHub!
