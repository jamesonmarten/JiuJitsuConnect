# Grapplr - Jiu-Jitsu Community Platform

## Overview

MMA Connect is a full-stack web application built to connect the martial arts community across Central Florida and Southeastern Wisconsin, rapidly expanding nationwide due to popular demand. The platform allows users to find training partners, instructors, and rate their training experiences. It's built with modern web technologies and follows a client-server architecture with PostgreSQL for data persistence.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query (@tanstack/react-query) for server state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and production builds
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Neon serverless
- **ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions stored in PostgreSQL

## Key Components

### Database Schema (shared/schema.ts)
- **Sessions Table**: Required for Replit Auth session storage
- **Users Table**: Core user information (id, email, names, profile image)
- **Profiles Table**: Extended user information (role, skill level, gym affiliation, location, belt rank)
- **Ratings Table**: User-to-user ratings and reviews system
- **Instructor Notes Table**: Notes from instructors about members' progress
- **Journal Entries Table**: Self-journal notes for members to track their training
- **Training Media Table**: Photos and videos from sparring sessions with metadata

### Authentication System
- **Provider**: Replit Auth with passport.js integration
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **Authorization**: Route-level middleware protection
- **User Management**: Automatic user creation/updates from OIDC claims

### API Layer
- **Profile Management**: CRUD operations for user profiles
- **Rating System**: Create and retrieve user ratings
- **User Discovery**: Search and filter users by various criteria
- **Statistics**: Rating analytics and community metrics

### Frontend Pages
- **Landing Page**: Unauthenticated welcome page
- **Home**: Dashboard with profile setup prompts and community stats
- **Explore**: User discovery with advanced filtering
- **Profile Detail**: Individual user profiles with rating/contact options
- **Profile Edit**: Form for updating user information
- **My Profile**: Enhanced personal profile area with training journal, media gallery, and instructor notes
- **Ratings**: Community rating statistics and leaderboards

## Data Flow

1. **Authentication**: Users authenticate through Replit Auth, creating/updating user records
2. **Profile Setup**: New users complete their martial arts profile information
3. **Discovery**: Users search and filter community members by location, skill level, role
4. **Interaction**: Users can view profiles, contact members, and submit ratings
5. **Enhanced Profile Features**: 
   - Members maintain private training journals with mood tracking and session notes
   - Upload photos/videos from sparring sessions with technique tagging
   - Instructors can add private notes about member progress
6. **Analytics**: System aggregates ratings for community statistics and rankings

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless database connection
- **drizzle-orm**: Type-safe database ORM with PostgreSQL dialect
- **express**: Web server framework
- **passport**: Authentication middleware
- **openid-client**: OpenID Connect client for Replit Auth

### Frontend Dependencies
- **@radix-ui/***: Accessible UI component primitives
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form validation and handling
- **wouter**: Lightweight React router
- **tailwindcss**: Utility-first CSS framework

### Development Dependencies
- **vite**: Fast build tool and dev server
- **typescript**: Type checking and compilation
- **drizzle-kit**: Database schema management and migrations

## Deployment Strategy

### Development Environment
- **Dev Server**: Vite dev server with HMR for frontend
- **Backend**: tsx for TypeScript execution with auto-restart
- **Database**: Neon serverless PostgreSQL instance
- **Environment**: Replit environment with automatic provisioning

### Production Build
- **Frontend**: Vite production build to `dist/public`
- **Backend**: esbuild bundling to `dist/index.js`
- **Database**: Drizzle migrations for schema deployment
- **Deployment**: Single Node.js process serving static files and API

### Configuration Management
- **Environment Variables**: DATABASE_URL, SESSION_SECRET, REPLIT_DOMAINS
- **Build Scripts**: Unified build process for both frontend and backend
- **Static Assets**: Served from build output directory

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- July 04, 2025. Initial setup
- July 06, 2025. Fixed form submission issues and added red asterisks to required fields throughout site
- July 06, 2025. Fixed 404 page navigation for logged-out users
- July 07, 2025. Implemented complete upload functionality and deployment-ready testing tools
- July 07, 2025. Created comprehensive Elite Athlete's Guide with step-by-step documentation
- July 07, 2025. Implemented Dev Cabin Technologies branding throughout application as "MMA Connect by DCT"
- July 07, 2025. Updated target markets to Central Florida and Southeastern Wisconsin with expansion messaging
- July 07, 2025. Fixed all instructor references to be generic experts instead of famous names for honest marketing
- July 07, 2025. Resolved critical platform functionality issues:
  * Fixed training sessions management - status updates (Confirm/Cancel) now work properly
  * Fixed gym locator with fallback geocoding service for location searches without API keys
  * Fixed media upload to properly handle YouTube URLs with automatic embed conversion
  * Fixed profile edit form submission error caused by incorrect API request parameter order
  * Added comprehensive YouTube URL validation with user-friendly error messages
- July 08, 2025. Fixed gym finder geolocation functionality:
  * Resolved "Use My Location" button not returning gym results
  * Implemented geographic region detection for coordinate-based searches
  * Optimized API response times by prioritizing curated gym database
  * Added proper coordinate-to-region mapping for Florida and Wisconsin target markets
  * Enhanced gym search to work seamlessly with both address strings and GPS coordinates
- July 12, 2025. Enhanced location search functionality:
  * Confirmed user location search is working correctly with case-insensitive matching
  * Added Wisconsin/Milwaukee area members to seed data for better location search results
  * Improved database with 5 additional Wisconsin users across Milwaukee, Green Bay, and Kenosha
  * Location search now properly filters users by location strings using SQL ILIKE matching