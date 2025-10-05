# Marketplace Website

## Project Description

This project is a fully functional marketplace website built using [Next.js](https://nextjs.org/), a powerful React framework for server-side rendering and static site generation. The platform enables users to browse, list, and purchase products or services in a seamless and responsive interface. Key features include user authentication, product listings, search functionality, and a shopping cart system, all designed with scalability and performance in mind. The project leverages modern web technologies and uses [Supabase](https://supabase.com/) as the backend database to manage data such as user profiles, product listings, and transactions securely and efficiently.

## Prerequisites

To run this project, you need to have [Node.js](https://nodejs.org/) installed on your system. Additionally, you will need a [Supabase](https://supabase.com/) account to set up the database.

### Installing Node.js

- **Windows/Mac**: Download and install Node.js from the [official Node.js website](https://nodejs.org/en/download/). Choose the LTS version for stability.
- **Linux**: Use a package manager or follow instructions from the [Node.js download page](https://nodejs.org/en/download/package-manager/) for your distribution.
- Verify installation by running the following commands in your terminal:
  ```bash
  node -v
  npm -v
  ```
  These should display the installed versions of Node.js and npm.

### Setting Up Supabase

1. Sign up for a free account at [Supabase](https://supabase.com/).
2. Create a new project in the Supabase dashboard.
3. Obtain your Supabase project URL and API key from the project settings.
4. Configure the environment variables (e.g., in a `.env.local` file) with your Supabase credentials:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

## Getting Started

Follow these steps to set up and run the project locally:

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Install Dependencies**  
   Run the following command to install all required packages using npm, including the Supabase client library:

   ```bash
   npm install
   ```

   This will read the `package.json` file and install all dependencies listed under `dependencies` and `devDependencies`, including `@supabase/supabase-js` for Supabase integration.

3. **Run the Development Server**  
   Start the Next.js development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000/) in your browser to view the application.

## Scripts

The following scripts are available in `package.json`:

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Runs the built application in production mode.
- `npm run lint`: Runs the linter to check for code quality issues.

## Project Structure

- `pages/`: Contains Next.js pages and API routes.
- `components/`: Reusable React components.
- `styles/`: CSS or Tailwind CSS configuration for styling.
- `public/`: Static assets like images and fonts.
- `lib/`: Contains Supabase client initialization and utility functions for database operations.

## Troubleshooting

- If `npm install` fails, ensure you have the correct Node.js version (LTS recommended). You can use [nvm](https://github.com/nvm-sh/nvm) to manage Node.js versions.
- Clear the npm cache if you encounter issues:
  ```bash
  npm cache clean --force
  ```
- Delete the `node_modules` folder and `package-lock.json` file, then run `npm install` again.
- If you encounter Supabase-related errors, verify that your Supabase URL and API key are correctly set in the environment variables.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and APIs.
- [Node.js Documentation](https://nodejs.org/en/docs/) - Reference for Node.js.
- [npm Documentation](https://docs.npmjs.com/) - Guide for managing packages with npm.
- [Supabase Documentation](https://supabase.com/docs) - Learn about Supabase features and database management.
