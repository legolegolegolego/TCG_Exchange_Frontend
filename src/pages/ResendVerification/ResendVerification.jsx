import { useState } from "react";
import { resendVerification } from "../../services/auth";
import Notification from "../../components/Notification/Notification.jsx";
import styles from "./ResendVerification.module.css";

const ResendVerification = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await resendVerification(email);

            setMessage({
                type: "success",
                message: "Se ha enviado un email de verificación. Revisa tu bandeja de entrada.",
            });
        } catch (err) {
            setError(err.response?.data?.mensaje || "Error al enviar el email de verificación");
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
                <h2 className={styles.title}>Reenviar correo de verificación</h2>

                <input
                    type="email"
                    placeholder="Introduce tu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                    required
                />

                <button type="submit" className={styles.button}>
                    Enviar correo
                </button>

                {error && <p className={styles.error}>{error}</p>}
            </form>
        </>
    );
};

export default ResendVerification;