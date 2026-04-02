import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import Explorar from "./pages/Explorar/Explorar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import EditarPerfil from "./pages/EditarPerfil/EditarPerfil.jsx";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import CardDetail from "./pages/CardDetail/CardDetail.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";
import UsuarioCartas from "./pages/UsuarioCartas/UsuarioCartas.jsx";
import BackTab from "./components/BackTab/BackTab.jsx";
import MisIntercambios from "./pages/MisIntercambios/MisIntercambios.jsx";
import DetalleIntercambio from "./pages/DetalleIntercambio/DetalleIntercambio.jsx";
import ProponerIntercambio from "./pages/ProponerIntercambio/ProponerIntercambio.jsx";
import MisCartas from "./pages/MisCartas/MisCartas.jsx";
import Usuarios from "./pages/Usuarios/Usuarios.jsx";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import ResendVerification from "./pages/ResendVerification/ResendVerification.jsx";
import Soporte from "./pages/Soporte/Soporte.jsx";
import Home from "./pages/Home/Home.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

const AppContent = () => {
  const location = useLocation();

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      {location.pathname !== "/" && <BackTab />}

      <main className="flex-grow-1">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/resend-verification" element={<ResendVerification />} />
          <Route path="/soporte" element={<Soporte />} />
          <Route path="/usuario/:username" element={<UsuarioCartas />} />
          <Route
            path="/cartas-modelo/:id"
            element={
              <CardDetail />
            }
          />
          <Route path="/no-disponible" element={<NotFound />} />
          {/* Ruta para URLs no existentes */}
          <Route path="*" element={<Navigate to="/no-disponible" replace />} />
          <Route
            path="/"
            element={
              <Home />
            }
          />
          <Route
            path="/explorar"
            element={
              <Explorar />
            }
          />
          {/* Rutas protegidas */}
          <Route
            path="/intercambios/:username"
            element={
              <ProtectedRoute matchUsernameOrAdmin={true}>
                <MisIntercambios />
              </ProtectedRoute>
            }
          />
          <Route
            path="/intercambio/:id"
            element={
              <ProtectedRoute>
                <DetalleIntercambio />
              </ProtectedRoute>
            }
          />
          <Route
            path="/proponer-intercambio/:idCartaDestino"
            element={
              <ProtectedRoute>
                <ProponerIntercambio />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cartas/:username"
            element={
              <ProtectedRoute matchUsernameOrAdmin={true}>
                <MisCartas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editar-perfil"
            element={
              <ProtectedRoute>
                <EditarPerfil />
              </ProtectedRoute>
            }
          />
          {/* solo ADMIN: */}
          <Route
            path="/usuarios"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Usuarios />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;