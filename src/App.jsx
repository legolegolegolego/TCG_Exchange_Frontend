import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
      </Routes>
      <Footer />
    </>
  );
};

export default App;