import { useState } from "react";
import { forgotPassword } from "../../services/auth";
import Notification from "../../components/Notification/Notification.jsx";
import styles from "./ForgotPassword.module.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await forgotPassword(email);

            setMessage({
                type: "success",
                message: "Se ha enviado un email para restablecer la contraseña",
            });
        } catch (err) {
            setError(err.response?.data?.mensaje || "Error al enviar el email");
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
            </form>
        </>
    );
};

export default ForgotPassword;