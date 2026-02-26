import { useState, useEffect } from "react";
import { loginUser } from "../../services/auth.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import Notification from "../../components/Notification/Notification.jsx";
import styles from "./Login.module.css";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [notification, setNotification] = useState(null);

    // Mostrar notificación de logout / cuenta eliminada
    useEffect(() => {
        const stored = sessionStorage.getItem("notification");
        if (stored) {
            setNotification(JSON.parse(stored));
            sessionStorage.removeItem("notification");
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = await loginUser(username, password);
            login(token);
            setSuccess("Inicio de sesión correcto. Redirigiendo a la página principal...");

            setTimeout(() => navigate("/"), 500);
        } catch (err) {
            setError(err.response?.data?.mensaje || "Error inesperado");
        }
    };

    return (
        <>
            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}

            <form onSubmit={handleSubmit} className={styles.formContainer}>
                <h2 className={styles.title}>Iniciar sesión</h2>

                <input
                    type="text"
                    placeholder="Nombre de usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.input}
                />

                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                />

                <button type="submit" className={styles.button}>Iniciar sesión</button>

                <hr />
                <p>¿No tienes una cuenta? <a href="/register">Regístrate</a></p>

                {success && <p className={styles.success}>{success}</p>}
                {error && <p className={styles.error}>{error}</p>}
            </form>
        </>
    );
};

export default Login;