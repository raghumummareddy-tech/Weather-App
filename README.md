# Weather Intelligence App

## Project Overview
The Weather Intelligence App is an AI-generated web application built using Google AI Studio App Build. It allows users to search for a city and view the current weather, a 7-day weather forecast, and weather-based recommendations using the Open-Meteo public APIs.

---

## Features

- Search weather by city
- Display current weather
- Display 7-day weather forecast
- Weather recommendations
- Error handling for invalid city names
- Responsive user interface

---

## Technologies Used

- Google AI Studio App Build
- React
- Vite
- Open-Meteo Geocoding API
- Open-Meteo Forecast API
- GitHub
- Cloudflare Pages

---

## Project Structure

```
src/
components/
package.json
README.md
vite.config.ts
```

---

## Installation

Install the project dependencies:

```bash
npm install
```

---

## Run the Application

Start the development server:

```bash
npm run dev
```

Open the application in your browser:

```
http://localhost:5173
```

---

## Build the Application

Generate the production build:

```bash
npm run build
```

The production files will be generated inside the **dist** folder.

---

## Deployment

The application is deployed using **Cloudflare Pages**.

Deployment Process:

1. Build the application in Google AI Studio.
2. Connect the application directly to GitHub.
3. Connect the GitHub repository to Cloudflare Pages.
4. Configure build settings.
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Deploy the application.
8. Verify the live `pages.dev` URL.

---

## APIs Used

### Open-Meteo Geocoding API

Used to convert city names into latitude and longitude.

### Open-Meteo Forecast API

Used to retrieve current weather and the 7-day weather forecast.
The application has been tested with:

- Chennai
- London
- Invalid city search
- Browser refresh
- Responsive layout


Employee Name: Raghu Mummareddy


