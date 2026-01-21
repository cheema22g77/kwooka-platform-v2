# Kwooka Platform

A unified business platform for Australian SMEs, consolidating **Grants Discovery**, **Compliance Management**, and **Council Services** into one integrated solution.

## 🎯 Overview

Kwooka Platform enables seamless data sharing between modules - particularly allowing organizations to auto-fill grant requirements using their existing compliance documentation.

## 🛠 Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript
- **Backend:** Supabase (Auth, PostgreSQL, Storage, Edge Functions)
- **Styling:** Tailwind CSS v4 with custom Kwooka branding
- **State:** Zustand
- **AI/RAG:** Vector embeddings for semantic search

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/kwooka-platform.git
cd kwooka-platform

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run database migrations
# (Apply supabase/schema.sql to your Supabase project)

# Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📦 Features

### 💰 Grants Module
- **Grant Discovery** - Search Australian federal, state, and local grants
- **AI-Powered Matching** - Eligibility scoring based on business profile
- **Category Filtering** - Export, Innovation, Sustainability, Healthcare, Regional
- **Application Tracking** - Monitor application status and deadlines
- **Auto-Fill Integration** - Pull compliance docs into grant applications

### 📋 Compliance Module
- **Document Management** - Upload and organize compliance documents
- **NDIS Compliance** - Specific tools for NDIS providers
- **Policy Generation** - AI-assisted policy document creation
- **Compliance Tracking** - Monitor compliance status across frameworks

### 🏛️ Council Module
- **Permit Management** - Track council permits and applications
- **Local Government Tools** - Manage council relationships
- **Document Repository** - Store council-related documentation

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main application pages
│   │   ├── grants/        # Grants module
│   │   ├── compliance/    # Compliance module
│   │   └── council/       # Council module
│   └── onboarding/        # User onboarding flow
├── components/            # Reusable UI components
│   ├── chat/             # AI chat components
│   ├── documents/        # Document handling
│   ├── layout/           # Layout components (sidebar, header)
│   └── ui/               # Base UI components
├── lib/                   # Utility libraries
│   ├── ai/               # AI/LLM integration
│   ├── rag/              # RAG search system
│   ├── supabase/         # Supabase clients
│   └── pdf/              # PDF processing
├── types/                 # TypeScript type definitions
└── hooks/                 # Custom React hooks

supabase/
├── schema.sql            # Database schema
└── migrations/           # Database migrations

n8n/
└── workflows/            # n8n automation workflows
```

## 🎨 Branding

Kwooka uses a distinctive Australian-inspired color palette:
- **Ochre** - Primary accent color
- **Earth tones** - Supporting colors
- **Kwooka mascot** - The friendly kookaburra brand character

## 🔐 Authentication

- Email/password authentication via Supabase Auth
- Protected routes with middleware
- Onboarding flow for new users

## 📊 Database

The platform uses PostgreSQL via Supabase with:
- Vector embeddings for semantic search (pgvector)
- Row-level security policies
- JSONB for flexible data structures
- Full-text search with trigram matching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.
