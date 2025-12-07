import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import PrivateNotes from './pages/PrivateNotes';
import PublicNotes from './pages/PublicNotes';
import NoteForm from './pages/NoteForm';
import NoteHistory from './pages/NoteHistory';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = useSelector((state: RootState) => state.auth.token);
  return token ? <>{children}</> : <Navigate to="/login" />;
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes - Private Notes (My Workspace) */}
        <Route path="/" element={<PrivateRoute><Layout><PrivateNotes /></Layout></PrivateRoute>} />
        <Route path="/my-notes" element={<PrivateRoute><Layout><PrivateNotes /></Layout></PrivateRoute>} />
        
        {/* Protected Routes - Public Directory */}
        <Route path="/public" element={<PrivateRoute><Layout><PublicNotes /></Layout></PrivateRoute>} />
        
        {/* Protected Routes - Note Management */}
        <Route path="/notes/new" element={<PrivateRoute><Layout><NoteForm /></Layout></PrivateRoute>} />
        <Route path="/notes/edit/:id" element={<PrivateRoute><Layout><NoteForm /></Layout></PrivateRoute>} />
        <Route path="/notes/history/:id" element={<PrivateRoute><Layout><NoteHistory /></Layout></PrivateRoute>} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
