# Brew & Beans - Dynamic Website

A modern, database-driven website built with MongoDB, Express, and Node.js.

## Features
- Responsive design with Tailwind CSS
- MongoDB database integration
- Dynamic forms with real-time validation
- Category-specific features (Coffee Shop: online ordering)

## Installation
1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Create a `.env` file with your MongoDB URI:
```
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```
4. Start the server:
```bash
npm start
```
5. Open your browser to `http://localhost:3000`

## API Endpoints

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contacts` - Get all contacts

### Orders (Coffee Shop)
- `POST /api/orders` - Create a new order
- `GET /api/orders` - Get recent orders

## Deployment

### Vercel Deployment
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Add environment variables in Vercel dashboard

## Project Structure
```
├── public/          # Client-side files
├── server/          # Express server
├── .env            # Environment variables
├── package.json    # Dependencies
└── vercel.json     # Deployment config
```

## Technologies
- Express.js
- MongoDB & Mongoose
- Tailwind CSS
- Vanilla JavaScript
