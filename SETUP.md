# APT - Habit Tracker Setup Guide

## Prerequisites

1. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
2. **Google OAuth App**: Set up Google OAuth credentials

## 1. Supabase Project Setup

### Create a New Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `apt-habit-tracker`
   - Database Password: (generate a secure password)
   - Region: (choose closest to your users)
5. Click "Create new project"

### Get Project Credentials
1. Go to Project Settings → API
2. Copy the following values:
   - Project URL
   - Anon/Public key
   - Service Role key (keep this secret!)

## 2. Environment Configuration

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## 3. Database Schema Setup

Go to your Supabase project dashboard → SQL Editor and run these scripts:

### Create Tables

```sql
-- Create habits table
CREATE TABLE habits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  has_quantity BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create entries table
CREATE TABLE entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  value INTEGER DEFAULT 1 CHECK (value >= 1),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(habit_id, date)
);
```

### Enable Row Level Security (RLS)

```sql
-- Enable RLS on tables
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

-- Create policies for habits table
CREATE POLICY "Users can only see their own habits" 
  ON habits FOR ALL USING (auth.uid() = user_id);

-- Create policies for entries table  
CREATE POLICY "Users can only see their own entries"
  ON entries FOR ALL USING (auth.uid() = user_id);
```

### Create Database Functions and Triggers

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for habits table
CREATE TRIGGER update_habits_updated_at 
  BEFORE UPDATE ON habits 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
```

## 4. Google OAuth Setup

### Create Google OAuth Application
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Choose "Web application"
6. Add authorized redirect URIs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`

### Configure Supabase OAuth
1. In Supabase Dashboard → Authentication → Providers
2. Enable Google provider
3. Enter your Google OAuth credentials:
   - Client ID
   - Client Secret
4. Save configuration

## 5. Development

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```

### Open Application
Navigate to [http://localhost:3000](http://localhost:3000)

## 6. Testing the Setup

1. **Authentication**: Click "Continue with Google" on login page
2. **Habit Creation**: Add a new habit (try both simple and quantity types)
3. **Daily Tracking**: Toggle today's habits
4. **Heatmap**: View the activity heatmap (will show more data over time)
5. **Habit Management**: Edit/delete habits

## 7. Production Deployment

### Vercel Deployment (Recommended)
1. Push your code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Update Google OAuth redirect URI with production domain
5. Update Supabase redirect URL in auth settings

### Environment Variables for Production
Make sure to set these in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Features Overview

### ✅ Completed Features
- **Google OAuth Authentication** - Secure, one-click sign-in
- **Habit Management** - Create, edit, delete habits with optional quantity tracking
- **Daily Tracking** - Quick toggles for today's habits
- **Beautiful HeatMap** - 52-week visualization with green intensity levels
- **Responsive Design** - Works beautifully on mobile and desktop
- **Dark/Light Mode** - Automatic theme detection with pure black dark mode
- **Accessibility** - Full keyboard navigation and screen reader support

### 🎯 Key Design Decisions
- **Minimal UI** - Clean, GitHub-inspired design
- **No Overwhelming Options** - Simple name + optional quantity tracking
- **Unified Color Scheme** - Consistent green theme throughout
- **Focus on Core Experience** - Just habit tracking, no bells and whistles

## Troubleshooting

### Common Issues

1. **Authentication not working**
   - Check Google OAuth configuration
   - Verify redirect URLs match exactly
   - Ensure Supabase auth is properly configured

2. **Database errors**
   - Verify RLS policies are created
   - Check that all tables exist
   - Ensure environment variables are correct

3. **Build errors**
   - Run `npm run lint` to check for issues
   - Verify all dependencies are installed
   - Check TypeScript configuration

### Getting Help
- Check Supabase documentation
- Review Next.js documentation
- Ensure all environment variables are properly set

## Success! 🎉

You now have a fully functional habit tracker with:
- Secure authentication
- Beautiful heatmap visualization  
- Simple habit management
- Mobile-responsive design
- Production-ready architecture

Start building better habits today!
