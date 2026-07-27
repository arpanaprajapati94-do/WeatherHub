# WeatherHub

WeatherHub is a modern mini MERN stack weather application with authentication, city search, favourites, and search history.

## Features
- User registration and login with JWT
- Search weather by city
- Save and remove favourite cities
- View recent search history
- Responsive glassmorphism UI with Tailwind CSS

## Tech Stack
- React + Vite
- Node.js + Express
- MongoDB + Mongoose
- Tailwind CSS
- JWT Authentication

## Setup
1. Install dependencies:
   - `npm install`
   - `cd client && npm install`
2. Create a `.env` file using the provided `.env.example` template.
3. Start MongoDB locally.
4. Run the backend:
   - `npm start`
5. Run the frontend:
   - `cd client && npm run dev`

## Environment
- Backend uses `PORT`, `MONGO_URI`, `JWT_SECRET`, `WEATHER_API_KEY`, and `CLIENT_URL`.
- The app includes mock weather data if no API key is provided.
