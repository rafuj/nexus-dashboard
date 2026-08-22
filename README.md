# Nexus Dashboard

Nexus Dashboard is a Vite + React frontend application.

This README explains how to set up the project for local development and how to create the production `dist/` folder that can be embedded and served by the backend HTTP handler.

## Requirements

Make sure the following are installed:

- Node.js - v22.x +
- Yarn 1.x - 1.x +

The project uses Yarn `1.22.22`.

Check the installed versions:

```bash
node --version
yarn --version
Installation

Clone the repository and install the dependencies:

yarn install
Environment Variables

Create an environment (.env) file in the project root same as (.env.example).

Example:

VITE_API_URL=https://your-api-url.com

VITE_API_URL is used as the backend API URL.

Important: Vite environment variables are exposed to the frontend and are replaced at build time. Do not store secrets or private credentials in VITE_* variables.

##Development Setup

Start the Vite development server:

yarn dev

The application will normally be available at:

http://localhost:5173
Development API Proxy

The Vite configuration includes an /api development proxy.

For example:

Frontend
http://localhost:5173/api/login
        |
        v
Vite development proxy
        |
        v
https://your-api-url.com/login

The /api prefix is removed before forwarding the request to the backend.

For example:

/api/login

is forwarded as:

/login

The proxy is configured in vite.config.ts and is intended for local development.

##Production Build

To create the production frontend, run:

yarn build

The build command runs:

tsc -b && vite build

This will:

Run TypeScript checking.
Create the optimized production bundle using Vite.
Generate the dist/ directory.

After a successful build:

dist/
├── assets/
├── index.html
└── ...

The complete dist/ directory contains the production frontend and can be embedded or served by the backend HTTP handler.

Test the Production Build Locally

After creating the production build:

yarn build

Run:

yarn preview

This serves the generated dist/ directory locally and allows you to verify the production build before integrating it with the backend.

Development vs Production
Development

Start the development server:

yarn dev

The Vite /api proxy is available during development.

Example:

Browser
  |
  v
http://localhost:5173/api/cabinets
  |
  v
Vite proxy
  |
  v
VITE_API_URL/cabinets
Production

Create the production build:

yarn build

The result is a static dist/ directory.

The Vite development server and its proxy are not included in the production build.

The backend HTTP handler is responsible for serving the contents of dist/ and, if required, handling or reverse-proxying API requests.

Important Production API Note

The Vite proxy configuration:

server: {
  proxy: {
    "/api": {
      target: env.VITE_API_URL,
      changeOrigin: true,
      secure: true,
      rewrite: (p) => p.replace(/^\/api/, ""),
    },
  },
},

only applies to the Vite development server.

It does not run after yarn build and is not included in the generated dist/ folder.

Therefore, production API requests must be configured so they can reach the backend.

Option 1: Use the Production API URL Directly

Configure the production environment:

VITE_API_URL=https://your-api-url.com

Configure Axios to use:

baseURL: import.meta.env.VITE_API_URL

Requests will then go directly to the backend.

Example:

Frontend
    |
    v
https://your-api-url.com/login
Option 2: Use a Backend/Reverse Proxy

If the frontend uses /api/... paths in production, the backend or another reverse proxy must forward those requests to the API.

Example:

Browser
    |
    v
https://your-domain.com/api/login
    |
    v
Backend / Reverse Proxy
    |
    v
https://your-api-url.com/login

The Vite server.proxy configuration alone is not sufficient for production.

Build Output for Backend Integration

The expected deployment flow is:

Frontend source code
        |
        | yarn build
        v
     dist/
        |
        | copy/embed into backend
        v
Backend HTTP Handler
        |
        v
     Browser

The backend should serve:

dist/index.html
dist/assets/*

If the React application uses client-side routing, the backend should also be configured to serve index.html for application routes that are not actual static files.

For example:

/dashboard
/cabinets/list
/cabinets/list/add

should fall back to:

dist/index.html

when necessary.

Available Scripts
Command	Description
yarn dev	Start the Vite development server
yarn build	Type-check and create the production dist/ folder
yarn preview	Preview the generated production build
yarn lint	Run ESLint
Recommended Workflow
Local Development
yarn install
yarn dev
Before Deployment

Create the production build:

yarn build

Verify that the dist/ directory was generated successfully.

Optionally test the production build:

yarn preview
Backend Integration

After confirming the production build:

Use the generated dist/ directory.
Embed or copy dist/ into the backend as required.
Configure the backend HTTP handler to serve the static files.
Configure SPA fallback to dist/index.html if client-side routes require it.
Ensure production API requests are routed to the backend/API correctly.
Project Structure

A simplified project structure looks like:

nexus-dashboard/
├── src/
├── public/
├── dist/                 # Generated by yarn build
├── .env
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md

The dist/ directory is generated during the build and normally should not be edited manually.
```
