
# Super Admin Dashboard

A comprehensive user management system built with React, TypeScript, and Supabase.

## Features

- 🔐 **Authentication System**: Sign up, sign in, and role-based access
- 👥 **User Management**: Create, view, and manage user accounts
- 🛡️ **Permission System**: Granular page-level permissions (view, edit, create, delete)
- 👑 **Super Admin**: Special admin role with full system access
- 💬 **Comment System**: Page-specific comments with modification history
- 🎨 **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Supabase account and project

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd super-admin-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Supabase**:
   - Your project is already connected to Supabase
   - The database tables have been created
   - Authentication is configured

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to `http://localhost:5173`

## Usage

### Creating Your First Super Admin

1. Go to the login page and create a new account
2. Go to your Supabase dashboard: [https://supabase.com/dashboard/project/ygbxbnnbykcxzcesjeob](https://supabase.com/dashboard/project/ygbxbnnbykcxzcesjeob)
3. Navigate to Table Editor > profiles
4. Find your user record and set `is_super_admin` to `true`
5. Log out and log back in to see admin features

### User Management

- **Super Admins** can:
  - View all users
  - Create new users
  - Manage user permissions
  - Promote users to super admin
  - Access all pages and features

- **Regular Users** can:
  - Access pages based on their permissions
  - View and create comments (based on permissions)

### Permission System

The system supports 4 permission levels for each page:
- **View**: Can see the page content
- **Edit**: Can modify existing content
- **Create**: Can add new content
- **Delete**: Can remove content

### Available Pages

- Products List
- Marketing List
- Order List
- Media Plans
- Offer Pricing SKUs
- Clients
- Suppliers
- Customer Support
- Sales Reports
- Finance & Accounting

## Development

### Project Structure

```
src/
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── integrations/       # Supabase integration
└── lib/               # Utility functions
```

### Key Technologies

- **React 18** with TypeScript
- **Supabase** for backend and authentication
- **Tanstack Query** for data fetching
- **shadcn/ui** for UI components
- **Tailwind CSS** for styling
- **React Router** for navigation

## Deployment

This app can be deployed to any static hosting platform:

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting platform of choice

## Environment Variables

No environment variables are needed as the Supabase configuration is already set up.

## Support

For questions or issues, please check:
- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
