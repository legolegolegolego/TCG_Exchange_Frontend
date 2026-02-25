import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import Explorar from "./pages/Explorar/Explorar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import EditarPerfil from "./pages/EditarPerfil/EditarPerfil.jsx";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import CardDetail from "./pages/CardDetail/CardDetail.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";

function App() {
  return (
    <BrowserRouter>
        <Header />

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
              <ProtectedRoute>
                <CardDetail />
              </ProtectedRoute>
            }
          />
          <Route path="/no-disponible" element={<NotFound />} />
        </Routes>
        <Footer />
    </BrowserRouter>
  );
}

export default App;