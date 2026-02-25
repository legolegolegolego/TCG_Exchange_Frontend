import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import Explorar from "./pages/Explorar/Explorar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";

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
              <ProtectedRoute>
                <Explorar />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
    </BrowserRouter>
  );
}

export default App;