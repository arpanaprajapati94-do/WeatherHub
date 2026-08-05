# Changelog

All notable changes to the WeatherHub project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-08-05

### Added
- Full authentication system (register, login, JWT, protected routes)
- Interactive weather dashboard with real-time metrics
- Hourly + 7-day forecast
- Air Quality Index (AQI) widget
- Smart weather alerts (thunderstorm, heatwave, high wind, etc.)
- Multi-city comparison page
- Weather calendar with monthly view
- Favourite cities management
- Search history tracking
- Geolocation-based current location detection
- Temperature unit toggle (°C / °F)
- Dark / Light theme toggle
- PWA support (manifest + service worker)
- Dynamic weather-themed backgrounds
- Live clock and splash screen
- Popular cities carousel
- Fully responsive design (mobile / tablet / desktop)

### Fixed
- Weather calendar temperature units now respect the °C/°F toggle
- Authenticated users can now access the Home page via the navbar
- JSX formatting and indentation cleanup
- `.gitignore` cleanup (removed stray pattern that could ignore files)

### Security
- Passwords hashed with bcrypt
- JWT token authentication with expiry
- Input validation on all forms
- Environment variables kept out of version control

## [Unreleased]

### Planned
- Browser push notifications for weather alerts
- Offline weather cache improvements
- Email verification
- Password reset flow
- Weather widget share/embed
