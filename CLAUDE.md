# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a MERN stack social media application called "fakeSocials" that allows users to create posts, follow other users, and interact through likes and comments. The application uses JWT for authentication and stores images as base64 in the database.

## Architecture
- **Frontend**: React 19.1.1 with React Router DOM for routing
- **Backend**: Node.js with Express, using Babel for ES6+ support
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens stored in cookies using js-cookie library

## Development Commands

### Frontend (in `frontend/` directory)
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests using React's test runner
- `npm run eject` - Eject from Create React App (irreversible)

### Backend (in `backend/` directory)
- `npm start` - Start development server with nodemon and Babel
- `npm test` - Currently returns error (no tests configured)

## Key Architecture Patterns

### Frontend Structure
- **Routing**: Uses React Router with nested routes, loaders for data fetching
- **API Layer**: Centralized API calls in `src/network/` with separate files for user and post operations
- **Components**: Modular components in `src/components/` including Header, Post, User, and modal components
- **Authentication**: JWT tokens and user ID stored in browser cookies
- **State Management**: Uses React Router's loader pattern for data fetching rather than global state

### Backend Structure
- **Entry Point**: `src/index.js` sets up Express server with middleware and routes
- **Models**: Mongoose schemas for User and Post in `src/models/`
- **Routes**: Modular routing system in `src/routes/` with separate files for users and posts
- **Authentication**: JWT verification utility in `src/utils/tokenJwt.js`

### API Design
- Base URL: `https://fakesocialsapi.onrender.com/` (hardcoded in frontend)
- Authentication: Bearer tokens in Authorization headers
- Routes structured as `/users/*` and `/posts/*`

### Data Handling
- Images stored as base64 strings in database (mentioned in README as performance concern)
- All API calls include proper error handling with try-catch blocks
- Response status codes: 200 for updates, 201 for creation/retrieval

## Important Notes
- The application was initially designed for desktop, mobile responsiveness added later
- Images converted to base64 for storage due to hosting limitations, causing performance issues
- No test framework is currently set up (tests return error message)
- CORS is currently open for development (`app.use(cors())`)
- The application supports user profiles, following/followers, post creation, commenting, and liking functionality