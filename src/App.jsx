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
    <>
      <Header />
      {location.pathname !== "/" && <BackTab />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <Explorar />
          }
        />
        <Route
          path="/mis-intercambios"
          element={
            <ProtectedRoute>
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
          path="/mis-cartas"
          element={
            <ProtectedRoute>
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
        <Route
          path="/cartas/:id"
          element={
            <CardDetail />
          }
        />
        <Route path="/usuario/:username" element={<UsuarioCartas />} />
        <Route path="/no-disponible" element={<NotFound />} />
        {/* Ruta para URLs no existentes */}
        <Route path="*" element={<Navigate to="/no-disponible" replace />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;