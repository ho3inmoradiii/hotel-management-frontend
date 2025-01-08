# Hotel Management System - Frontend

A Nuxt 3 application for managing hotel operations with TypeScript and Vuetify.

## Features

- Guest Management Interface
- Room Management with Status Filtering
- Reservation Management System
- Responsive Design with Vuetify
- TypeScript Support
- API Integration

## Prerequisites

- Node.js 16+
- npm or yarn
- Backend API running

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hotel-management-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure API endpoint in `.env`:
```
API_BASE_URL=http://localhost:8000
```

## Development

Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## Build for Production

```bash
npm run build
# or
yarn build
```

## Project Structure

```
├── components/           # Vue components
├── composables/         # Composable functions
├── layouts/             # Page layouts
├── pages/              # Application pages
├── plugins/            # Nuxt plugins
├── public/             # Static files
└── types/              # TypeScript types
```

## Features Overview

### Guest Management
- List all guests
- Add new guests
- Edit guest information
- Delete guests

### Room Management
- List all rooms with status
- Filter rooms by status
- Add new rooms
- Edit room information
- Update room status
- Delete rooms

### Reservation Management
- Create new reservations
- Assign rooms to guests
- Manage check-in/check-out dates
- View and edit reservations
- Delete reservations

## Technologies Used

- Nuxt 3
- TypeScript
- Vuetify 3
- VueUse
- Pinia