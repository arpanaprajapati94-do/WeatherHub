# WeatherHub 🌤️

MERN Stack Weather Application with real-time weather data, authentication, favourites and search history.

## Live Demo
Frontend: https://weather-hub-nine.vercel.app

Backend: https://weatherhub-mdip.onrender.com

## Features
- User Authentication (JWT)
- Search Weather by City
- Favourite Cities
- Search History
- Responsive UI
- Dark / Light mode

## Tech Stack
- React + Vite
- Tailwind CSS
- Node.js + Express
- MongoDB Atlas
- OpenWeatherMap API

---

## Getting Started

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm
- A MongoDB database (MongoDB Atlas free tier works great)
- (Optional) An OpenWeatherMap API key — without one the app runs in demo mode with mock data

### 1. Clone & install dependencies

```bash
git clone <your-repo-url>
cd WeatherHub
# Install server dependencies
cd server && npm install
# Install client dependencies
cd ../client && npm install
```

### 2. Configure the server

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/weatherhub
JWT_SECRET=change-me-to-a-long-random-string
JWT_EXPIRE=7d
WEATHER_API_KEY=your_openweather_api_key   # optional
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Configure the client

```bash
cd client
cp .env.example .env
```

`client/.env` (optional — if left empty, Vite's dev proxy forwards `/api` to `localhost:5000`):

```env
VITE_API_URL=
```

### 4. Run in development

```bash
# Terminal 1 — start the API server
cd server && npm run dev

# Terminal 2 — start the Vite dev server
cd client && npm run dev
```

Open http://localhost:5173 in your browser.

### 5. Production build

```bash
cd client && npm run build   # outputs to client/dist
cd server && npm start       # runs the API
```

## Project Structure

```
WeatherHub/
├── client/            # React + Vite frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route pages (Home, Dashboard, Login, ...)
│   │   ├── context/     # React contexts (Auth, Theme, Toast)
│   │   ├── hooks/       # Custom hooks (useWeather)
│   │   ├── services/    # Axios API layer
│   │   └── data/        # Static data (cities list)
│   └── public/          # Static assets
├── server/            # Node.js + Express backend
│   ├── config/         # DB connection
│   ├── controllers/    # Route handlers
│   ├── middleware/     # Auth + error handling
│   ├── models/         # Mongoose models
│   ├── routes/         # Express routes
│   └── utils/          # Weather API helpers
└── package.json
```

## API Endpoints

| Method | Endpoint               | Description                    | Auth |
|--------|------------------------|--------------------------------|------|
| POST   | `/api/auth/register`   | Register a new user            | No   |
| POST   | `/api/auth/login`      | Login and receive a JWT        | No   |
| GET    | `/api/auth/me`         | Get current user profile       | Yes  |
| PUT    | `/api/auth/me`         | Update profile                 | Yes  |
| PUT    | `/api/auth/password`   | Change password                | Yes  |
| DELETE | `/api/auth/me`         | Delete account                 | Yes  |
| GET    | `/api/weather?city=..` | Get weather for a city         | No   |
| GET    | `/api/favourites`      | List favourite cities          | Yes  |
| POST   | `/api/favourites`      | Add a favourite city           | Yes  |
| DELETE | `/api/favourites/:id`  | Remove a favourite city        | Yes  |
| GET    | `/api/history`         | List search history            | Yes  |
| POST   | `/api/history`         | Save a search                  | Yes  |
| DELETE | `/api/history`         | Clear search history           | Yes  |
| DELETE | `/api/history/:id`     | Delete one history entry       | Yes  |

## Author
Arpana B. Prajapati

