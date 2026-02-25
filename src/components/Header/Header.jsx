import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import logo from "../../assets/logo.png";
import { useAuth } from "../../context/AuthContext.jsx";

const Header = () => {
  const navigate = useNavigate(); // Hook para navegar
  const { token, logout } = useAuth();
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
    <header className={styles.header}>
      <div className={styles.left}>
        <a href="/">
          <img src={logo} alt="Logo App" className={styles.logo} />
          <h1 className={styles.appName}>TCG Exchange</h1>
        </a>
      </div>

      <nav className={styles.nav}>
        <a href="/" className={styles.navLink}>Explorar Cartas</a>
        <input
          type="text"
          placeholder="Buscar cartas..."
          className={styles.searchInput}
        />
      </nav>

      <div className={styles.right} ref={wrapperRef}>
        {!token ? (
          <>
            <button className={styles.button} onClick={handleLoginClick}>Iniciar Sesión</button>
            <button className={styles.buttonOutline} onClick={handleRegisterClick}>Registrarse</button>
          </>
        ) : (
          <div className={styles.profileWrapper}>
            <button className={styles.profileButton} onClick={() => setOpen((s) => !s)}>
              Mi Perfil ▾
            </button>
            {open && (
              <div className={styles.dropdown}>
                <button className={styles.dropdownItem} onClick={handleEditProfile}>Editar Perfil</button>
                <button className={styles.dropdownItem} onClick={handleLogout}>Cerrar sesión</button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;