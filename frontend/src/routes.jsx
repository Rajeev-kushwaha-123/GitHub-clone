import React, { useEffect } from 'react';
import { useNavigate, useRoutes } from 'react-router-dom';

// pages List
import Dashboard from './components/dashboard/Dashboard';
import Profile from './components/user/Profile';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import RepositoryPage from './components/repo/RepositoryPage';
import RepositoryDetail from './components/repo/RepositoryDetail';
import IssueList from './components/issue/IssueList';
import Settings from './components/Settings';
import Explore from './components/explore';
import Marketplace from './components/marketplace';
import Notifications from './components/notifications';

// Auth context
import { useAuth } from './authContext';

const ProjectRoutes = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");

    if (userIdFromStorage && !currentUser) {
      setCurrentUser(userIdFromStorage);
    }

    if (!userIdFromStorage && !['/auth', '/signup'].includes(window.location.pathname)) {
      navigate("/auth");
    }

    if (userIdFromStorage && window.location.pathname === '/auth') {
      navigate('/');
    }
  }, [currentUser, navigate, setCurrentUser]);

  let element = useRoutes([
    { path: '/', element: <Dashboard /> },
    { path: '/auth', element: <Login /> },
    { path: '/signup', element: <Signup /> },
    { path: '/profile', element: <Profile /> },
    { path: '/repositories', element: <RepositoryPage /> },
    { path: '/repository/:id', element: <RepositoryDetail /> },
    { path: '/issues', element: <IssueList /> },
    { path: '/settings', element: <Settings /> },
    { path: '/explore', element: <Explore /> },
    { path: '/marketplace', element: <Marketplace /> },
    { path: '/notifications', element: <Notifications /> }
  ]);

  return element;
};

export default ProjectRoutes;
