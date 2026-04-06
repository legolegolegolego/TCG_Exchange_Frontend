import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/auth";
import Notification from "../../components/Notification/Notification.jsx";
import styles from "./ResetPassword.module.css";
import { Eye, EyeOff } from "lucide-react";
import Button from "../../components/Button/Button.jsx";
import PasswordInput from "../../components/PasswordInput/PasswordInput.jsx";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState(null);
    const [cambiando, setCambiando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setCambiando(true);

        try {
            await resetPassword({
                token,
                newPassword
            });

            sessionStorage.setItem("notification", JSON.stringify({
                type: "success",
                message: "Contraseña actualizada correctamente",
            }));

            navigate("/login");

        } catch (err) {
            setError(err.response?.data?.mensaje || "Error al restablecer la contraseña");
        } finally {
            setCambiando(false);
        }
    };

    if (!token) {
        return <p>Token inválido o ausente</p>;
    }

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
                <h2 className={styles.title}>Nueva contraseña</h2>

                <PasswordInput
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Ingresa tu nueva contraseña"
                    disabled={cambiando}
                />

                <Button type="submit" variant="primary" size="lg" disabled={cambiando}>
                    {cambiando ? "Cambiando contraseña..." : "Cambiar contraseña"}
                </Button>

                {error && <p className={styles.error}>{error}</p>}
            </form>
        </>
    );
};

export default ResetPassword;