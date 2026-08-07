# ✨ FS · Francis Salazar

> A premium personal brand website and custom Content Management System (CMS) designed for a professional coaching practice.

> **Project Status:** ✅ Completed · Production Ready

---

# Overview

**FS · Francis Salazar** is a full-stack professional website developed for a coaching and personal development brand.

The platform combines a polished public-facing experience with a custom administration system that allows the site owner to manage the website's content without modifying source code.

The project was designed around three main goals:

- Deliver a refined, responsive and accessible user experience.
- Provide full content autonomy through a custom CMS.
- Maintain a secure, performant and maintainable technical architecture.

The public website follows a clean editorial design with subtle animations, optimized media, responsive layouts and content-driven sections.

The administration interface provides centralized management of the website's pages, services, resources, frequently asked questions, media, contact information and other dynamic content.

---

# Features

## 🌐 Public Website

The website includes:

- Homepage
- About page
- Services
- Resources
- Frequently Asked Questions
- Contact page
- Responsive navigation
- Calls to action
- Social media integration
- Image galleries
- Downloadable resources
- Contact and resource forms

The interface is fully responsive and optimized for desktop, tablet and mobile devices.

---

## ⚙️ Custom Content Management System

A custom CMS was developed specifically for the project.

It allows the site owner to manage the website without accessing or modifying the source code.

Administrable content includes:

- Titles
- Subtitles
- Paragraphs
- Calls to action
- Homepage sections
- About content
- Services
- Resources
- Frequently Asked Questions
- Images
- Galleries
- Statistics
- Social links
- Contact information
- Footer content

The CMS is intentionally designed for a single administrator, avoiding unnecessary complexity while providing complete control over the website's content.

---

## ✍️ Rich Text Editing

Selected editorial content can be managed through a rich text editor.

Supported formatting includes:

- Bold
- Italic
- Bullet lists
- Numbered lists
- Safe hyperlinks
- Multiple paragraphs
- Text alignment
- Undo / redo
- Content preview

Formatting capabilities are intentionally controlled to preserve visual consistency across the website.

---

## 🧩 Homepage Management

The homepage is fully content-driven.

The administrator can manage content across sections such as:

- Hero
- Benefits
- About preview
- Process / methodology
- Services preview
- Featured resources
- Frequently Asked Questions
- Final call to action

Content updates are reflected on the public website without requiring changes to the source code.

---

## 💼 Services Management

Services can be managed directly from the administration panel.

The administrator can:

- Create services
- Edit services
- Reorder services
- Enable or disable services
- Manage descriptions
- Configure included items
- Add optional pricing
- Assign icons or images
- Highlight selected services

---

## 🎁 Resources Management

The website includes a flexible resource management system.

Resources can represent:

- Ebooks
- Guides
- Courses
- Audio resources
- Videos
- External content

Each resource can contain:

- Title
- Description
- Cover image
- Resource type
- Access method
- Visibility status
- Display order

This provides a centralized way to publish and maintain free or featured content.

---

## ❓ Frequently Asked Questions

Frequently Asked Questions are fully manageable through the CMS.

The administrator can:

- Create questions
- Edit questions
- Reorder questions
- Enable or disable questions
- Format answers using rich text

---

## 📨 Contact & Submissions

The website includes public forms for:

- General contact
- Initial consultation requests
- Resource access

Submissions are stored and made available through the administration interface.

The system supports an organized workflow for reviewing incoming messages while preserving submission history.

---

## 🖼️ Media Management

The platform includes media management for:

- Profile photography
- Website sections
- Galleries
- Service imagery
- Resource covers
- Downloadable files

Media assets are stored externally and delivered efficiently to the public website.

---

# Architecture

```text
                        Browser
                           │
                           ▼
                 Next.js + React
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
        Public Website            Administration CMS
              │                         │
              └────────────┬────────────┘
                           ▼
                    Server Layer
                           │
                           ▼
                       Supabase
                   ┌───────┴───────┐
                   ▼               ▼
              PostgreSQL         Storage
                Content           Media
                 Data             Files
```

The application follows a server-first architecture.

Public content is rendered using Next.js server capabilities, while administrative operations are processed through protected server-side application logic.

Content updates trigger page revalidation, allowing changes to become available without rebuilding or manually redeploying the application.

---

# Content Architecture

The project uses a hybrid content model.

## Page Content

Page-level and section-level content is stored as structured data.

This includes:

- Hero content
- Homepage sections
- Page introductions
- About content
- Calls to action
- Contact information
- Footer content
- Global website settings

## Structured Collections

Repeatable entities are managed independently.

These include:

- Services
- Resources
- Frequently Asked Questions
- Form submissions

This approach provides flexibility without introducing the complexity of a generic page builder.

---

# Technology Stack

## Frontend

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React
- Next.js Image
- Next.js Font

## Content Management

- Custom CMS
- TipTap Rich Text Editor
- Structured content management
- Server-side content validation

## Backend & Database

- Supabase
- PostgreSQL
- Supabase Storage
- Next.js Server Actions

## Infrastructure

- Vercel
- GitHub
- Supabase Cloud

---

# Performance

Performance was considered throughout the project architecture.

The application uses:

- Server Components
- Incremental Static Regeneration
- Content caching
- Automatic page revalidation
- Optimized images
- AVIF / WebP support
- Lazy loading
- Optimized web fonts
- Dynamic loading of administration-only components

Administration dependencies such as the rich text editor are isolated from the public-facing application whenever possible.

This keeps the public website lightweight while preserving a feature-rich CMS.

---

# Accessibility

Accessibility was incorporated throughout the interface.

The project includes:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Accessible form labels
- ARIA attributes where appropriate
- Color contrast considerations
- Reduced-motion support
- Responsive layouts
- Accessible interactive components

The interface was designed to provide a consistent experience across different devices and input methods.

---

# Security

The application follows a defense-in-depth security approach.

Security measures include:

- Protected administration access
- Server-side authorization
- Server-side input validation
- Input sanitization
- Rich text sanitization
- Safe URL validation
- Database access policies
- File validation
- Rate limiting
- Security headers
- Environment-based secret management
- Protected server-side database operations

Sensitive credentials, operational procedures and internal security documentation are intentionally excluded from the public repository.

---

# Data & Storage

The application uses Supabase as its managed backend infrastructure.

## PostgreSQL

Stores structured application data such as:

- Website content
- Services
- Resources
- Frequently Asked Questions
- Form submissions
- Configuration data

## Storage

Used for media and downloadable resources such as:

- Images
- Resource covers
- Documents
- Audio
- Video
- Other supported media

The application separates structured data from file storage to keep the architecture clean and maintainable.

---

# Running the Project

## Requirements

- Node.js 18.17+
- npm

## Install dependencies

```bash
npm install
```

## Start the development server

```bash
npm run dev
```

The development environment will be available at:

```text
http://localhost:3000
```

## Create a production build

```bash
npm run build
```

## Run the production build

```bash
npm start
```

---

# Environment Configuration

The project uses environment variables for external services and runtime configuration.

Create your local configuration based on:

```text
.env.example
```

Public environment configuration includes:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_supabase_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Additional server-side configuration is required for administrative functionality and is intentionally omitted from the public documentation.

> Never commit `.env`, `.env.local`, private keys, passwords, service credentials or production secrets to version control.

---

# Project Structure

```text
src/
├── app/
│   ├── (site)/           # Public website
│   └── ...               # Application routes
│
├── components/
│   ├── sections/         # Public website sections
│   ├── admin/            # CMS components
│   ├── layout/           # Navigation and layout
│   ├── motion/           # Animation components
│   └── ui/               # Shared UI components
│
├── lib/
│   ├── content/          # Content layer
│   ├── supabase/         # Data integration
│   └── ...               # Shared application logic
│
└── middleware.ts

public/
supabase/
scripts/
```

Internal operational and security documentation is intentionally excluded from the public repository.

---

# Development Principles

The project was developed following modern software engineering principles:

- Separation of Concerns
- Component Reusability
- Modular Design
- Strong TypeScript typing
- Server-first architecture
- Responsive Design
- Accessibility
- Defense-in-depth security
- Input validation
- Content sanitization
- Performance optimization
- Maintainable code
- Minimal unnecessary complexity

The architecture is intentionally proportional to the scope of the application: a professional website with a dedicated administration system rather than a generic enterprise CMS.

---

# Development Roadmap

## Phase 1 — Foundation

- ✅ Project architecture
- ✅ Next.js application
- ✅ TypeScript configuration
- ✅ Visual design system
- ✅ Responsive layout

## Phase 2 — Public Website

- ✅ Homepage
- ✅ About
- ✅ Services
- ✅ Resources
- ✅ Frequently Asked Questions
- ✅ Contact
- ✅ Responsive navigation
- ✅ Animations and interactions

## Phase 3 — Data Layer

- ✅ Supabase integration
- ✅ PostgreSQL content storage
- ✅ Media storage
- ✅ Dynamic content retrieval
- ✅ Content fallback system

## Phase 4 — Administration

- ✅ Custom CMS
- ✅ Content management
- ✅ Service management
- ✅ Resource management
- ✅ Frequently Asked Questions management
- ✅ Media management
- ✅ Form submission management
- ✅ Website settings

## Phase 5 — Editorial Tools

- ✅ Rich text editing
- ✅ Text alignment
- ✅ Lists and links
- ✅ Content ordering
- ✅ Visibility controls
- ✅ Content preview
- ✅ Automatic page revalidation

## Phase 6 — Production Readiness

- ✅ Responsive validation
- ✅ Input validation
- ✅ Content sanitization
- ✅ Security hardening
- ✅ Accessibility improvements
- ✅ Performance optimization
- ✅ Production build validation

---

# Engineering Objectives

The project demonstrates practical experience in:

- Full Stack Development
- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- PostgreSQL
- Supabase
- Content Management Systems
- Server-side rendering
- Incremental Static Regeneration
- Web security
- Rich text sanitization
- Database-backed applications
- Responsive UI/UX
- Accessibility
- Performance optimization
- Production-oriented development

---

# Project Outcome

The final result is a complete digital platform that combines a professional public website with a dedicated content management system.

The site owner can independently maintain the website's content, resources, services and communications while the underlying application preserves:

- Visual consistency
- Security
- Performance
- Accessibility
- Maintainability

The project demonstrates how a purpose-built CMS can provide significant editorial flexibility without the overhead of a large generic content management platform.

---

# Deployment

The application is designed for deployment using:

- **Vercel** for the Next.js application
- **Supabase** for PostgreSQL and media storage
- **GitHub** for source control

Environment-specific credentials are configured directly in the deployment platform and are never stored in the repository.

---

# License

This project is intended as a professional and portfolio project.

All brand-specific content, copy, visual identity and media remain the property of their respective owner.

---

> **Note:** Administrative routes, credentials, internal security procedures, database migration instructions and operational documentation are intentionally excluded from this public documentation.