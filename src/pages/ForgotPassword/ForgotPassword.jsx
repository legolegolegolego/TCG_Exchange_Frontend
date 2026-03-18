import { useState } from "react";
import { forgotPassword } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import Notification from "../../components/Notification/Notification.jsx";
import styles from "./ForgotPassword.module.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState("");
    const [errorLink, setErrorLink] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setErrorLink(null);

        try {
            await forgotPassword(email);

            sessionStorage.setItem("notification", JSON.stringify({
                type: "success",
                message: "Se ha enviado un email para restablecer la contraseña",
            }));

            navigate("/")

        } catch (err) {
            const mensaje = err.response?.data?.mensaje || "Error al enviar el email";

            if (mensaje.includes("Debes verificar tu email antes de recuperar la contraseña.")) {
                setError(mensaje);
                setErrorLink(
                    <a href="/resend-verification" className={styles.link}>
                        Reenviar correo de verificación
                    </a>
                );
            } else {
                setError(mensaje);
                setErrorLink(null);
            }
        }
    };

    return (
        <>
            {message && (
                <Notification
                    type={message.type}
                    message={message.message}
                    onClose={() => setMessage(null)}
                />
            )}

            <form onSubmit={handleSubmit} className={styles.formContainer}>
                <h2 className={styles.title}>Recuperar contraseña</h2>

                <input
                    type="email"
                    placeholder="Introduce tu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                />

                <button type="submit" className={styles.button}>
                    Enviar email
                </button>

                {error && <p className={styles.error}>{error}</p>}
                {errorLink && <p className={styles.error}>{errorLink}</p>}
            </form>
        </>
    );
};

export default ForgotPassword;