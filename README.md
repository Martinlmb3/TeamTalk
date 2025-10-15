

![TeamTalk Logo](frontend/public/TeamTalk%20-%20Readme%20-%20Logo.svg)

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![.NET](https://img.shields.io/badge/.NET-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![AWS](https://img.shields.io/badge/AWS-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)
[![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![Google](https://img.shields.io/badge/Google_OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://developers.google.com/identity)
[![Facebook](https://img.shields.io/badge/Facebook_OAuth-0866FF?style=for-the-badge&logo=facebook&logoColor=white)](https://developers.facebook.com/)
[![Maileroo](https://img.shields.io/badge/Maileroo-F47A3D?style=for-the-badge&logo=maildotru&logoColor=white)](https://maileroo.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

---

<h1 align="center">TeamTalk</h1>

<p align="center">A comprehensive sports team communication and management platform that connects athletes, coaches, and team administrators in one unified space.</p>

## ✨ Features

- **🏠 Landing Page**: Modern, responsive homepage with hero section and feature highlights
- **💬 Real-time Messaging**: Team chat rooms and direct messaging capabilities
- **📅 Schedule Management**: Team events, practices, and game scheduling
- **📁 File Sharing**: Document and media sharing for team resources
- **👥 Team Management**: Role-based access for players, coaches, and admins
- **🎨 Theme Support**: Dark/light mode toggle for better user experience
- **📱 Responsive Design**: Mobile-first approach with modern UI components

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 14.2.16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Theme**: next-themes for dark/light mode

### Backend
- **Framework**: ASP.NET Core 9.0
- **Language**: C#
- **Database**: PostgreSQL with Entity Framework Core
- **Authentication**: JWT Bearer tokens
- **API Documentation**: Swagger/OpenAPI

## 📁 Project Structure

```
TeamTalk/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App router pages
│   │   ├── dashboard/       # User dashboard
│   │   ├── messages/        # Messaging functionality
│   │   ├── schedule/        # Team scheduling
│   │   ├── files/          # File management
│   │   ├── admin/          # Admin panel
│   │   └── ...
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── header.tsx     # Navigation header
│   │   └── ...
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   └── styles/            # Global styles
├── backend/               # ASP.NET Core API
│   └── TeamTalkApi/
│       ├── Controllers/   # API controllers
│       ├── DTOs/         # Data transfer objects
│       ├── TeamTalk.Core/
│       │   ├── Entities/ # Database models
│       │   ├── Services/ # Business logic
│       │   └── Interfaces/
│       └── ...
└── teamtalk-v0/          # v0.dev generated components
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- .NET 9.0 SDK
- PostgreSQL database

### Frontend Setup
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

### Backend Setup
```bash
cd backend/TeamTalkApi
dotnet restore
dotnet ef database update
dotnet run
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh JWT token

### Teams
- `GET /api/teams` - Get user teams
- `POST /api/teams` - Create new team
- `GET /api/teams/{id}` - Get team details

### Messages
- `GET /api/messages/team/{teamId}` - Get team messages
- `POST /api/messages` - Send message
- `GET /api/messages/direct/{userId}` - Direct messages

## 🗄️ Database Schema

Key entities include:
- **Users**: Player/coach profiles and authentication
- **Teams**: Team information and metadata
- **Messages**: Chat messages and conversations
- **Schedules**: Events, practices, and games
- **Files**: Shared documents and media

## 🎨 UI Components

Built with modern, accessible components:
- Navigation with responsive design
- Theme toggle (dark/light mode)
- Cards, buttons, forms with consistent styling
- Modal dialogs and dropdowns
- Data tables and calendars

## 📝 Pages

- `/` - Landing page with hero section
- `/dashboard` - User dashboard
- `/messages` - Team and direct messaging
- `/schedule` - Calendar and events
- `/files` - File sharing and management
- `/admin` - Administrative functions
- `/pricing` - Subscription plans
- `/support` - Help and contact

## 🔧 Development

### Frontend Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
```

### Backend Development
```bash
dotnet watch run     # Start with hot reload
dotnet test          # Run tests
dotnet ef migrations add <name>  # Create migration
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/.next`
4. Deploy automatically on push to main

### Backend
1. Configure PostgreSQL connection string
2. Set JWT secret and other environment variables
3. Deploy to cloud provider (Azure, AWS, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Martin Lumumba**
- GitHub: [@Martinlmb3](https://github.com/Martinlmb3)
- Project: [TeamTalk](https://github.com/Martinlmb3/TeamTalk)

## 🙏 Acknowledgments

- [v0.dev](https://v0.dev) for AI-generated UI components
- [shadcn/ui](https://ui.shadcn.com) for the component library
- [Lucide](https://lucide.dev) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com) for styling

---

**TeamTalk** - Connecting teams, one conversation at a time. 💬🏆