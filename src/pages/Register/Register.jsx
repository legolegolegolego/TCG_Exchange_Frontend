import { useState } from "react";
import { registerUser } from "../../services/auth.js";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.css";

const Register = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await registerUser(username, password, password2);
            setSuccess("Registrado correctamente. Redirigiendo a inicio de sesión...");
            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.mensaje || "Error en registro");
            setSuccess("");
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
            <h2 className={styles.title}>Registrarse</h2>

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

            <input
                type="password"
                placeholder="Repetir contraseña"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                className={styles.input}
            />

            <button type="submit" className={styles.button}>Registrarse</button>

            <hr />
            <p>¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a></p>

            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.success}>{success}</p>}
        </form>
    );
};

export default Register;