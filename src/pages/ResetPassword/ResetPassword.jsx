import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/auth";
import Notification from "../../components/Notification/Notification.jsx";
import styles from "./ResetPassword.module.css";
import { Eye, EyeOff } from "lucide-react";
import Button from "../../components/Button/Button.jsx";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

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

                <div className={styles.passwordWrapper}>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Nueva contraseña"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={styles.input}
                    />

                    <button
                        type="button"
                        className={styles.toggleButton}
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                </div>

                <Button type="submit" variant="primary" size="lg">
                    Cambiar contraseña
                </Button>

                {error && <p className={styles.error}>{error}</p>}
            </form>
        </>
    );
};

export default ResetPassword;