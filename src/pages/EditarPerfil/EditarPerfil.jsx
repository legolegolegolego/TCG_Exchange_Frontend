import styles from "./EditarPerfil.module.css";
import { changeUsername, changePassword } from "../../services/usuarios.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useState, useEffect } from "react";
import * as jwtDecodeModule from "jwt-decode";

const safeJwtDecode = (token) => {
    try {
        const fn = jwtDecodeModule.default || jwtDecodeModule;
        return fn(token);
    } catch (e) {
        return null;
    }
};

const EditarPerfil = () => {
    const [username, setUsername] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPassword2, setNewPassword2] = useState("");

    const [userMsg, setUserMsg] = useState("");
    const [userErr, setUserErr] = useState("");
    const [passMsg, setPassMsg] = useState("");
    const [passErr, setPassErr] = useState("");

    const { token } = useAuth();
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        if (!token) return;
        try {
            const decoded = safeJwtDecode(token);
            const decodedUsername = decoded?.sub || decoded?.username || decoded?.user || decoded?.preferred_username;
            let decodedId = null;
            if (decoded?.id) decodedId = decoded.id;
            else if (decoded?.userId) decodedId = decoded.userId;
            else if (decoded?.usuarioId) decodedId = decoded.usuarioId;
            else if (decoded?.sub && /^[0-9]+$/.test(String(decoded.sub))) decodedId = Number(decoded.sub);

            if (decodedUsername) setUsername(decodedUsername);
            if (decodedId !== null && decodedId !== undefined && !isNaN(Number(decodedId))) {
                setUserId(Number(decodedId));
            } else {
                setUserErr("El token no contiene el id del usuario.");
            }
        } catch (e) {
            setUserErr("Token inválido: no se pudo decodificar.");
        }
    }, [token]);

    const handleUsernameSubmit = async (e) => {
        e.preventDefault();
        setUserErr("");
        setUserMsg("");

        try {
            if (!userId) throw new Error("Usuario no identificado");

            await changeUsername(userId, username);

            setUserMsg("Nombre de usuario actualizado correctamente.");
        } catch (err) {
            setUserErr(err.response?.data?.mensaje || err.message || "Error al actualizar usuario");
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPassErr("");
        setPassMsg("");

        try {
            if (!userId) throw new Error("Usuario no identificado");

            await changePassword(userId, { currentPassword, newPassword, newPassword2 });

            setPassMsg("Contraseña actualizada correctamente.");
            setCurrentPassword("");
            setNewPassword("");
            setNewPassword2("");
        } catch (err) {
            setPassErr(err.response?.data?.mensaje || err.message || "Error al actualizar contraseña");
        }
    };

    return (
        <div className={styles.container}>
            <h1>Editar Perfil</h1>

            <section className={styles.section}>
                <h2>Cambiar nombre de usuario</h2>
                <form onSubmit={handleUsernameSubmit}>
                    <div className={styles.field}>
                        <label>Nuevo nombre de usuario</label>
                        <input className={styles.input} value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <button className={styles.button} type="submit">Actualizar nombre de usuario</button>
                    {userMsg && <p className={styles.success}>{userMsg}</p>}
                    {userErr && <p className={styles.error}>{userErr}</p>}
                </form>
            </section>

            <section className={styles.section}>
                <h2>Cambiar contraseña</h2>
                <form onSubmit={handlePasswordSubmit}>
                    <div className={styles.field}>
                        <label>Contraseña actual</label>
                        <input className={styles.input} type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                    </div>
                    <div className={styles.field}>
                        <label>Nueva contraseña</label>
                        <input className={styles.input} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                    <div className={styles.field}>
                        <label>Repetir nueva contraseña</label>
                        <input className={styles.input} type="password" value={newPassword2} onChange={(e) => setNewPassword2(e.target.value)} />
                    </div>
                    <button className={styles.button} type="submit">Actualizar contraseña</button>
                    {passMsg && <p className={styles.success}>{passMsg}</p>}
                    {passErr && <p className={styles.error}>{passErr}</p>}
                </form>
            </section>
        </div>
    );
};

export default EditarPerfil;
