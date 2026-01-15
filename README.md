# TaskFlow

TaskFlow is a modern, full-stack task management application that helps teams and individuals organize, track, and complete their work efficiently. It features a clean, intuitive interface with powerful collaboration tools, role-based access control, and comprehensive reporting capabilities.

## 🚀 Features

### Core Functionality
- **Task Management**: Create, update, and organize tasks with multiple statuses
- **Kanban Board**: Visual task management with drag-and-drop functionality
- **Categories**: Organize tasks by custom categories
- **Comments**: Collaborative discussion on tasks
- **Activity Logs**: Track all changes and activities in the system

### User & Access Management
- **User Management**: Complete user administration with profile management
- **Role-Based Access Control (RBAC)**: Define roles and assign granular permissions
- **Authentication & Authorization**: Secure JWT-based authentication system
- **Session Management**: Track and manage user sessions

### Reporting & Analytics
- **Dashboard**: Real-time statistics and insights
- **Activity Summary**: Comprehensive activity tracking
- **Trend Analysis**: Visual charts and graphs for task completion trends
- **Category Distribution**: Analyze task distribution across categories
- **Priority & Status Distribution**: Visual representation of task priorities and statuses
- **Completion Rate Metrics**: Track completion rates over time

### Additional Features
- **Multi-language Support**: Internationalization (i18n) support for English and Turkish
- **Email Notifications**: Automated email notifications
- **Audit Logs**: Complete audit trail of system changes
- **Snapshot Logs**: System state snapshots for monitoring
- **Hangfire Integration**: Background job processing
- **Rate Limiting**: API rate limiting for security
- **CORS Support**: Configurable CORS policies

## 🏗️ Architecture

### Backend (.NET 9.0)
The backend follows a **layered architecture** pattern with clear separation of concerns:

1. **TaskFlow.Domain.Shared**: Shared domain abstractions, base entities, interfaces, exceptions, and extensions
2. **TaskFlow.Domain**: Domain entities and domain-specific repository interfaces
3. **TaskFlow.Application.Contracts**: DTOs, request/response models, and service interfaces
4. **TaskFlow.Application**: Application services, business logic, and AutoMapper profiles
5. **TaskFlow.EntityFrameworkCore**: EF Core implementations, DbContext, entity configurations, and repository implementations
6. **TaskFlow.HttpApi**: Controllers and API attributes
7. **TaskFlow.HttpApi.Host**: Host configuration, Program.cs, middlewares, and logging
8. **TaskFlow.HttpApi.Client**: API client extensions

### Frontend (React 19 + TypeScript)
- **Framework**: React 19 with TypeScript
- **State Management**: TanStack Query (React Query)
- **Styling**: Tailwind CSS 4
- **Forms**: React Hook Form with Zod validation
- **Routing**: React Router DOM v7
- **UI Components**: Custom component library with Radix UI
- **Charts**: Recharts for data visualization
- **Build Tool**: Vite
- **Drag & Drop**: @dnd-kit for Kanban board

## 📋 Prerequisites

### Backend Requirements
- .NET 9.0 SDK
- PostgreSQL Server (or compatible database)
- Docker (optional, for containerized deployment)

### Frontend Requirements
- Node.js 18+ (or Yarn)
- npm or yarn package manager

## 🛠️ Installation & Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd taskflow-dotnet-api
```

2. Restore NuGet packages:
```bash
dotnet restore
```

3. Update database connection string in `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "Default": "Your connection string here"
  }
}
```

4. Run database migrations:
```bash
dotnet ef database update --project src/TaskFlow.EntityFrameworkCore --startup-project src/TaskFlow.HttpApi.Host
```

5. Run the API:
```bash
dotnet run --project src/TaskFlow.HttpApi.Host
```

The API will be available at `http://localhost:5000` (or configured port).

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd taskflow-react-client
```

2. Install dependencies:
```bash
yarn install
# or
npm install
```

3. Create a `.env` file with your API endpoint:
```env
VITE_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
yarn dev
# or
npm run dev
```

The frontend will be available at `http://localhost:5173` (or configured port).

### Docker Setup

Use Docker Compose to run the entire stack:

```bash
docker-compose up -d
```

This will start:
- Backend API container
- Frontend container
- Database (if configured)

## 📁 Project Structure

```
TaskFlow/
├── taskflow-dotnet-api/          # Backend API
│   ├── src/
│   │   ├── TaskFlow.Domain.Shared/
│   │   ├── TaskFlow.Domain/
│   │   ├── TaskFlow.Application.Contracts/
│   │   ├── TaskFlow.Application/
│   │   ├── TaskFlow.EntityFrameworkCore/
│   │   ├── TaskFlow.HttpApi/
│   │   ├── TaskFlow.HttpApi.Host/
│   │   └── TaskFlow.HttpApi.Client/
│   └── test/                      # Integration tests
├── taskflow-react-client/         # Frontend application
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── features/             # Feature modules
│   │   ├── pages/                # Page components
│   │   ├── contexts/             # React contexts
│   │   └── assets/               # Static assets
│   └── public/                   # Public assets
└── docker-compose.yml            # Docker Compose configuration
```

## 🔧 Configuration

### Backend Configuration
- API settings: `taskflow-dotnet-api/src/TaskFlow.HttpApi.Host/appsettings.json`
- CORS configuration: Configure in `Program.cs`
- Hangfire settings: Configure in `appsettings.json`
- Email settings: Configure SMTP settings in `appsettings.json`

### Frontend Configuration
- API URL: Set in `.env` file as `VITE_API_URL`
- i18n: Translation files in `src/assets/locales/`

## 🧪 Testing

### Backend Tests
```bash
cd taskflow-dotnet-api
dotnet test
```

### Frontend Tests
```bash
cd taskflow-react-client
yarn test
# or
npm test
```

## 📚 API Documentation

Once the backend is running, API documentation is available at:
- **OpenAPI/Swagger**: `http://localhost:5000/openapi/v1.json`
- **Scalar UI**: `http://localhost:5000/scalar/v1`

## 🔐 Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Permission-based authorization
- API rate limiting
- CORS protection
- Input validation
- SQL injection protection (via EF Core)
- HTTPS support

## 🌍 Internationalization

The application supports multiple languages:
- English (en)
- Turkish (tr)

Translation files are located in `taskflow-react-client/src/assets/locales/`.

## 📊 Monitoring & Logging

- **Serilog**: Structured logging for backend
- **Activity Logs**: User activity tracking
- **Audit Logs**: System change tracking
- **Snapshot Logs**: System state monitoring
- **Hangfire Dashboard**: Background job monitoring

## 🚀 Deployment

### Production Build

**Backend:**
```bash
cd taskflow-dotnet-api
dotnet publish -c Release -o ./publish
```

**Frontend:**
```bash
cd taskflow-react-client
yarn build
# Output will be in dist/ directory
```