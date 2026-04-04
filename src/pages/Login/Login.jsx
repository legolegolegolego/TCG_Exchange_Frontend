import { useState, useEffect } from "react";
import { loginUser } from "../../services/auth.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import Notification from "../../components/Notification/Notification.jsx";
import styles from "./Login.module.css";
import Button from "../../components/Button/Button.jsx";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [errorLink, setErrorLink] = useState(null);
    const [notification, setNotification] = useState(null);
    const location = useLocation();
    const [iniciandoSesion, setIniciandoSesion] = useState(false);

    useEffect(() => {
        
        // Revisar si viene ?verified=true en la URL
        const params = new URLSearchParams(location.search);
        if (params.get("verified") === "true") {
            setNotification({
                type: "success",
                message: "Email verificado"
            });
            
            // Limpiar query param de la URL para no mostrarlo otra vez
            navigate("/login", { replace: true });
        }
        
        // Mostrar notificaciones de páginas hijas
        const stored = sessionStorage.getItem("notification");
        if (stored) {
            setNotification(JSON.parse(stored));
            sessionStorage.removeItem("notification");
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIniciandoSesion(true);
        setError("");
        setErrorLink(null);

        try {
            const token = await loginUser(identifier, password);
            login(token);
            navigate("/"); // Navega inmediatamente a la principal
        } catch (err) {
            const mensaje = err.response?.data?.mensaje || "Error inesperado";

            // Si el error es por email no verificado, añadimos el enlace en el mensaje
            if (mensaje.includes("Email no verificado")) {
                setError(mensaje);
                setErrorLink(
                    <a href="/resend-verification" className={styles.link}>
                        Reenviar correo de verificación
                    </a>
                );
            } else {
                setError(mensaje);
                setErrorLink(null);
                setIniciandoSesion(false);
            }
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
                    placeholder="Nombre de usuario o correo electrónico"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className={styles.input}
                    disabled={iniciandoSesion}
                />

                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                    disabled={iniciandoSesion}
                />

                <Button type="submit" variant="primary" size="lg" disabled={iniciandoSesion}>
                    {iniciandoSesion ? "Iniciando sesión..." : "Iniciar sesión"}
                </Button>

                <hr />
                <p>
                    ¿Has olvidado tu contraseña? <a href="/forgot-password">Recuérdala</a>
                </p>
                <p>¿No tienes una cuenta? <a href="/register">Regístrate</a></p>

                {error && <p className={styles.error}>{error}</p>}
                {errorLink && <p className={styles.error}>{errorLink}</p>}
            </form>
        </>
    );
};

export default Login;