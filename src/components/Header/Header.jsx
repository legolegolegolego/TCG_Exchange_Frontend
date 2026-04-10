import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuth } from "../../context/AuthContext.jsx";
import WishlistButton from "../WishlistButton/WishlistButton.jsx";
import styles from "./Header.module.css";
import Button from "../Button/Button.jsx";

const Header = () => {
  const navigate = useNavigate();
  const { token, logout, user } = useAuth();
  const username = user?.username;
  const isAdmin = user?.roles?.includes("ROLE_ADMIN")
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
          <Link to="/" className="d-flex align-items-center text-decoration-none">
            <img src={logo} alt="Logo App" className={styles.logo} />
            <span className={`fw-bold ${styles.appName}`}>TCG Exchange</span>
          </Link>
        </div>

        {/* Navegación */}
        <nav className="d-flex flex-wrap align-items-center justify-content-center gap-3 flex-grow-1 my-2 my-md-0">
          <Link to={"/explorar"}
            className={`fw-semibold ${styles.navTitle}`}
          >
            {isAdmin ? "Cartas Modelo" : "Explorar Cartas"}
          </Link>

          {username && (
            <>
              {/* Si USER */}

              {!isAdmin && (
                <Link to={"/intercambios/" + username}
                  className={`fw-semibold ${styles.navTitle}`}
                >
                  Mis Intercambios
                </Link>
              )}
              {!isAdmin && (
                <Link to={"/cartas/" + username}
                  className={`fw-semibold ${styles.navTitle}`}
                >
                  Mis Cartas
                </Link>
              )}
              {/* Si ADMIN */}
              {isAdmin && (
                <Link to={"/usuarios"}
                  className={`fw-semibold ${styles.navTitle}`}
                >
                  Usuarios
                </Link>
              )}
            </>
          )}
          <Link to={"/soporte"}
            className={`fw-semibold ${styles.navTitle} ${styles.navHelp}`}
          >
            Ayuda
          </Link>
        </nav>

        {/* Botones de usuario */}
        <div
          className="d-flex align-items-center gap-2 flex-shrink-0 flex-wrap position-relative"
          ref={wrapperRef}
        >
          {!token ? (
            <>
              <Button variant="primary" size="md" onClick={handleLoginClick}>
                Iniciar Sesión
              </Button>
              <Button variant="outline-primary" onClick={handleRegisterClick}>
                Registrarse
              </Button>
            </>
          ) : (
            <div className="d-flex align-items-center gap-2 flex-wrap position-relative">
              {!isAdmin &&
                <WishlistButton
                  onClick={() => navigate("/no-disponible")}
                  title="Lista de Deseos"
                  ariaLabel="Lista de Deseos"
                />}

              {/* Dropdown “Mi Perfil” */}
              <div className="dropdown" style={{ position: "relative" }}>
                <Button
                  variant="black"
                  size="md"
                  onClick={() => setOpen((s) => !s)}
                >
                  Mi Perfil <span className={styles.dropdownArrow}>▾</span>
                </Button>
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