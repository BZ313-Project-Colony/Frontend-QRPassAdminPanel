import { BrowserRouter, Navigate, Route, Router, Routes, useNavigate } from 'react-router-dom';
import EventsPage from './pages/events/EventsPage';
import LoginPage from './pages/login/LoginPage';
import AuthProvider from "./context/AuthContext"
import PrivateRoutes from "./util/PrivateRoutes"

function App() {
  
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<EventsPage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
