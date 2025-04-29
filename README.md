# Content Management System

A modern content management system built with Next.js and a centralized JSON database.

## Project Structure

- `db.json`: Central database file that stores all content and settings
- `lib/data-service.ts`: Service for interacting with the database
- `app/actions/content-actions.ts`: Server actions for content management
- `app/api/content`: API routes for content management
- `types/content.ts`: TypeScript types for content structure

## Features

- Centralized content management with a single source of truth
- Dynamic content loading from db.json
- Real-time content updates
- Type-safe content structure
- Server actions for secure content management

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Content Management

All content is stored in the `db.json` file. This file is automatically updated when content is changed through the dashboard.

### Structure

The `db.json` file has the following structure:

\`\`\`json
{
  "pages": {
    "home": {
      // Home page content
    }
  },
  "settings": {
    // Global settings
  }
}
\`\`\`

### Adding New Pages

To add a new page:

1. Add a new entry to the `pages` object in `db.json`
2. Create a new page component that loads the content from the database

## API

The API provides endpoints for managing content:

- `GET /api/content?pageId=home`: Get content for a specific page
- `POST /api/content`: Update content for a specific page

## Development

### Adding New Content Sections

1. Update the `PageContent` type in `types/content.ts`
2. Add the new section to the `db.json` file
3. Create a new editor component for the section
4. Add the section to the content page
