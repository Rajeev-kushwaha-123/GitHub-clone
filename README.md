# GitHub Clone - Full Stack Application

A comprehensive GitHub clone application that integrates all backend concepts (User, Repository, and Issue management) with a modern, responsive frontend built using React and Bootstrap.

## 🚀 Features

### User Management
- **Authentication**: Sign up, login, and profile management
- **Profile Management**: Edit profile information, bio, location, website
- **User Statistics**: View contribution statistics and activity
- **Profile Deletion**: Secure account deletion with confirmation

### Repository Management
- **Create Repositories**: Build new repositories with descriptions and visibility settings
- **Repository Operations**: View, edit, toggle visibility, and delete repositories
- **Search & Filter**: Advanced search with visibility and sorting options
- **Repository Statistics**: Track issues, files, and collaboration metrics

### Issue Management
- **Issue Creation**: Create detailed issues with priority levels and assignments
- **Issue Tracking**: Monitor issue status (Open, In Progress, Closed)
- **Advanced Filtering**: Filter by status, priority, repository, and search terms
- **Issue Operations**: Update status, assign users, and manage lifecycle

### Modern UI/UX
- **Bootstrap 5**: Responsive design with modern components
- **Bootstrap Icons**: Professional iconography throughout the interface
- **Responsive Layout**: Mobile-first design that works on all devices
- **Interactive Components**: Modals, dropdowns, and dynamic content loading

## 🛠️ Technology Stack

### Frontend
- **React 19**: Modern React with hooks and functional components
- **Bootstrap 5**: CSS framework for responsive design
- **Bootstrap Icons**: Professional icon library
- **React Router**: Client-side routing
- **Axios**: HTTP client for API communication

### Backend
- **Node.js**: Server runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **Socket.io**: Real-time communication

## 📁 Project Structure

```
github/
├── backend/                 # Backend API server
│   ├── controllers/        # Business logic controllers
│   ├── models/            # Database models
│   ├── routes/            # API route definitions
│   ├── middleware/        # Authentication middleware
│   └── index.js           # Server entry point
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── auth/      # Authentication components
│   │   │   ├── dashboard/ # Dashboard components
│   │   │   ├── repo/      # Repository components
│   │   │   ├── issue/     # Issue management components
│   │   │   └── user/      # User profile components
│   │   ├── services/      # API service layer
│   │   ├── routes.jsx     # Application routing
│   │   └── App.jsx        # Main application component
│   └── package.json       # Frontend dependencies
└── README.md              # Project documentation
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- pnpm (recommended) or npm

### Backend Setup
```bash
cd backend
pnpm install
# Set up environment variables
cp .env.example .env
# Update MongoDB connection string in .env
pnpm start
```

### Frontend Setup
```bash
cd frontend
pnpm install
pnpm start
```

## 🌐 API Endpoints

### User Management
- `POST /signup` - User registration
- `POST /login` - User authentication
- `GET /userProfile/:id` - Get user profile
- `PUT /updateProfile/:id` - Update user profile
- `DELETE /deleteProfile/:id` - Delete user profile

### Repository Management
- `POST /repo/create` - Create new repository
- `GET /repo/all` - Get all repositories
- `GET /repo/:id` - Get repository by ID
- `GET /repo/user/:userID` - Get user repositories
- `PUT /repo/update/:id` - Update repository
- `PATCH /repo/toggle/:id` - Toggle repository visibility
- `DELETE /repo/delete/:id` - Delete repository

### Issue Management
- `POST /issue/create` - Create new issue
- `GET /issue/all` - Get all issues
- `GET /issue/:id` - Get issue by ID
- `PUT /issue/update/:id` - Update issue
- `DELETE /issue/delete/:id` - Delete issue

## 🎨 UI Components

### Dashboard
- **Welcome Section**: Personalized greeting and overview
- **Repository Grid**: Card-based repository display with actions
- **Search & Filters**: Advanced search with tabbed navigation
- **Sidebar**: Suggested repositories and recent activity

### Repository Management
- **Repository Cards**: Visual repository representation
- **Create Modal**: Comprehensive repository creation form
- **Action Buttons**: Quick actions for each repository
- **Statistics**: Repository metrics and insights

### Issue Management
- **Issue List**: Detailed issue display with status indicators
- **Create Issue Modal**: Full-featured issue creation
- **Status Management**: Quick status updates and workflow
- **Priority System**: Visual priority indicators

### User Profile
- **Profile Header**: Avatar, bio, and contact information
- **Statistics Cards**: Contribution metrics and achievements
- **Recent Activity**: Latest repositories and issues
- **Edit Mode**: Inline profile editing capabilities

## 🔐 Authentication & Security

- **JWT-based Authentication**: Secure token-based authentication
- **Protected Routes**: Route-level access control
- **User Authorization**: Role-based access to resources
- **Secure API Calls**: Authenticated API requests

## 📱 Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Bootstrap Grid**: Responsive layout system
- **Adaptive Components**: Components that work on all screen sizes
- **Touch-Friendly**: Mobile-optimized interactions

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd github
   ```

2. **Set up the backend**
   ```bash
   cd backend
   pnpm install
   # Configure environment variables
   pnpm start
   ```

3. **Set up the frontend**
   ```bash
   cd frontend
   pnpm install
   pnpm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3002

## 🎯 Key Features Implementation

### Real-time Updates
- Socket.io integration for live updates
- Real-time issue status changes
- Live repository activity feed

### Advanced Search & Filtering
- Full-text search across repositories and issues
- Multi-criteria filtering
- Sortable results with multiple options

### Data Visualization
- Contribution heatmap
- Statistics dashboards
- Progress indicators and metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Rajeev Kushwaha** - Full Stack Developer

---

## 🎉 What's New

This version includes:
- ✅ Complete Bootstrap 5 integration
- ✅ Professional UI/UX design
- ✅ Full CRUD operations for all entities
- ✅ Responsive mobile-first design
- ✅ Advanced search and filtering
- ✅ Real-time updates with Socket.io
- ✅ Comprehensive error handling
- ✅ Professional iconography
- ✅ Modern React patterns and hooks
- ✅ Secure authentication system

The application now provides a complete GitHub-like experience with modern design principles and comprehensive functionality for managing users, repositories, and issues.
