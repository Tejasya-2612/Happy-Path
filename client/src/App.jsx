import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { AddTool } from './pages/AddTool.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { EditTool } from './pages/EditTool.jsx';
import { Login } from './pages/Login.jsx';
import { NotFound } from './pages/NotFound.jsx';
import { Register } from './pages/Register.jsx';
import { ToolList } from './pages/ToolList.jsx';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="tools" element={<ToolList />} />
        <Route path="tools/new" element={<AddTool />} />
        <Route path="tools/:id/edit" element={<EditTool />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
