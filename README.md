Outsider 🌍

Outsider is a location-based activity discovery platform that helps people step out of their homes, meet real humans, and participate in nearby indoor and outdoor activities.

No feeds. No followers. Just real experiences.

✨ Features:

  📍 Nearby Activities
  
  Discover activities around your current or chosen location
  
  Map-based view with activity markers
  
  🧭 Location Control
  
  Use current location or search and explore other cities
  
  Address reverse-geocoding support
  
  🏕️ Create & Join Activities
  
  Host activities (hikes, games, meetups, etc.)
  
  Join or leave activities in real time
  
  💬 Group Chat (per activity)
  
  Real-time chat using WebSockets
  
  ⭐ Host Rating (Frontend)
  
  Visual rating system for activity hosts (frontend-only for now)
  
  🔐 Authentication
  
  Login / Register with protected routes
  
  JWT-based auth
  
  
🛠️ Tech Stack

Frontend:

  React
  
  Tailwind CSS
  
  React Router
  
  Leaflet (Maps)

Backend:

  Node.js
  
  Express
  
  MongoDB
  
  Socket.io
  
  JWT Authentication



🚀 Getting Started (Local)
1. Clone the repo
git clone https://github.com/your-username/hiketrails.git
cd hiketrails

2. Setup Backend
cd backend
npm install
npm run dev


Create a .env file:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:5173

3. Setup Frontend
cd frontend
npm install
npm run dev

⚠️ Status

This is an MVP under active development.
Some features (like ratings persistence) are currently frontend-only and planned for backend integration.
