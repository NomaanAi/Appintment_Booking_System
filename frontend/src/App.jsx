import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminSettings from './pages/AdminSettings';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public Routes - Wrapped in Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<Register />} />
        
        {/* Private Routes - Wrapped in Layout & PrivateRoute */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
        
        {/* Catch all - Redirect to Dashboard */}
        <Route path="*" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
