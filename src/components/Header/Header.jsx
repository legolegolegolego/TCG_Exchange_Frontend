import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuth } from "../../context/AuthContext.jsx";
import { getCurrentUser } from "../../utils/token.js";
import WishlistButton from "../WishlistButton/WishlistButton.jsx";
import styles from "./Header.module.css";

const Header = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const currentUser = getCurrentUser();
  const username = currentUser?.username;
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLoginClick = () => navigate("/login");
  const handleRegisterClick = () => navigate("/register");
  const handleEditProfile = () => {
    setOpen(false);
    navigate("/editar-perfil");
  };
  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <header className={`container-fluid py-2 ${styles.header}`}>
      <div className="d-flex flex-wrap align-items-center justify-content-between">
        {/* Logo */}
        <div className="d-flex align-items-center gap-2 flex-shrink-0">
          <a href="/" className="d-flex align-items-center text-decoration-none">
            <img src={logo} alt="Logo App" className={styles.logo} />
            <span className={`h5 mb-0 fw-bold ${styles.appName}`}>TCG Exchange</span>
          </a>
        </div>

        {/* Navegación */}
        <nav className="d-flex flex-wrap align-items-center justify-content-center gap-3 flex-grow-1 my-2 my-md-0">
          <span
            className={`fw-semibold ${styles.navTitle}`}
            onClick={() => navigate("/")}
            role="button"
          >
            Explorar Cartas
          </span>

          {username && (
            <>
              <span
                className={`fw-semibold ${styles.navTitle}`}
                onClick={() => navigate("/mis-intercambios")}
                role="button"
              >
                Mis intercambios
              </span>
              <span
                className={`fw-semibold ${styles.navTitle}`}
                onClick={() => navigate("/mis-cartas")}
                role="button"
              >
                Mis cartas
              </span>
            </>
          )}
        </nav>

        {/* Botones de usuario */}
        <div
          className="d-flex align-items-center gap-2 flex-shrink-0 flex-wrap position-relative"
          ref={wrapperRef}
        >
          {!token ? (
            <>
              <button className="btn btn-dark btn-sm" onClick={handleLoginClick}>
                Iniciar Sesión
              </button>
              <button className="btn btn-outline-dark btn-sm" onClick={handleRegisterClick}>
                Registrarse
              </button>
            </>
          ) : (
            <div className="d-flex align-items-center gap-2 flex-wrap position-relative">
              <WishlistButton
                onClick={() => navigate("/no-disponible")}
                title="Favoritos"
                ariaLabel="Favoritos"
              />

              {/* Dropdown “Mi Perfil” */}
              <div className="dropdown" style={{ position: "relative" }}>
                <button
                  className={`btn btn-dark btn-sm ${styles.profileButton}`}
                  type="button"
                  onClick={() => setOpen((s) => !s)}
                  aria-expanded={open}
                >
                  Mi Perfil <span className={styles.dropdownArrow}>▾</span>
                </button>
                <ul
                  className={`dropdown-menu ${open ? "show" : ""} ${styles.dropdownMenu}`}
                  style={{ right: 0, left: "auto" }}
                >
                  <li>
                    <button className="dropdown-item" onClick={handleEditProfile}>
                      Editar Perfil
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item btn-danger" onClick={handleLogout}>
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;