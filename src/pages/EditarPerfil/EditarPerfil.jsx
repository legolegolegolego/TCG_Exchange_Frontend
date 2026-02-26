import styles from "./EditarPerfil.module.css";
import { changeUsername, changePassword, deleteUser } from "../../services/usuarios.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useState, useEffect } from "react";
import { getCurrentUser } from "../../utils/token.js";
import { useNavigate } from "react-router-dom";
import Notification from "../../components/Notification/Notification.jsx";

const EditarPerfil = () => {
    const [username, setUsername] = useState("");
    const [passwordActual, setPasswordActual] = useState("");
    const [passwordNueva, setPasswordNueva] = useState("");
    const [passwordNueva2, setPasswordNueva2] = useState("");

    const [userMsg, setUserMsg] = useState("");
    const [userErr, setUserErr] = useState("");
    const [passMsg, setPassMsg] = useState("");
    const [passErr, setPassErr] = useState("");

    const { token, logout } = useAuth();
    const [userId, setUserId] = useState(null);

    const navigate = useNavigate();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteErr, setDeleteErr] = useState("");

    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const user = getCurrentUser();
        if (!user) {
            setUserErr("Usuario no autenticado.");
            return;
        }

        if (user.username) setUsername(user.username);
        setUserId(user.id);
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

            await changePassword(userId, { passwordActual, passwordNueva, passwordNueva2 });

            setPassMsg("Contraseña actualizada correctamente.");
            setPasswordActual("");
            setPasswordNueva("");
            setPasswordNueva2("");
        } catch (err) {
            setPassErr(err.response?.data?.mensaje || err.message || "Error al actualizar contraseña");
        }
    };

    const handleDeleteAccount = async () => {
        setDeleteErr("");

        try {
            if (!userId) throw new Error("Usuario no identificado");

            await deleteUser(userId);

            // Guardar mensaje temporal
            sessionStorage.setItem(
                "notification",
                JSON.stringify({
                    type: "success",
                    message: "Cuenta eliminada correctamente"
                })
            );

            // Cerrar sesión
            logout();

            // Redirigir a login
            navigate("/login", { replace: true });

        } catch (err) {
            setDeleteErr(err.response?.data?.mensaje || err.message || "Error al eliminar cuenta");
        }
    };

    return (
        <div className={styles.container}>
            <h1>Editar Perfil</h1>

            {/* NOTIFICACIÓN */}
            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}

            <section className={styles.section}>
                <h2>Cambiar nombre de usuario</h2>
                <form onSubmit={handleUsernameSubmit}>
                    <div className={styles.field}>
                        <label>Nuevo nombre de usuario</label>
                        <input
                            className={styles.input}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <button className={styles.button} type="submit">
                        Actualizar nombre de usuario
                    </button>
                    {userMsg && <p className={styles.success}>{userMsg}</p>}
                    {userErr && <p className={styles.error}>{userErr}</p>}
                </form>
            </section>

            <section className={styles.section}>
                <h2>Cambiar contraseña</h2>
                <form onSubmit={handlePasswordSubmit}>
                    <div className={styles.field}>
                        <label>Contraseña actual</label>
                        <input
                            className={styles.input}
                            type="password"
                            value={passwordActual}
                            onChange={(e) => setPasswordActual(e.target.value)}
                        />
                    </div>
                    <div className={styles.field}>
                        <label>Nueva contraseña</label>
                        <input
                            className={styles.input}
                            type="password"
                            value={passwordNueva}
                            onChange={(e) => setPasswordNueva(e.target.value)}
                        />
                    </div>
                    <div className={styles.field}>
                        <label>Repetir nueva contraseña</label>
                        <input
                            className={styles.input}
                            type="password"
                            value={passwordNueva2}
                            onChange={(e) => setPasswordNueva2(e.target.value)}
                        />
                    </div>
                    <button className={styles.button} type="submit">
                        Actualizar contraseña
                    </button>
                    {passMsg && <p className={styles.success}>{passMsg}</p>}
                    {passErr && <p className={styles.error}>{passErr}</p>}
                </form>
            </section>

            <section className={styles.section}>
                <h2>Eliminar cuenta</h2>
                <button
                    className={styles.deleteButton}
                    onClick={() => setShowDeleteModal(true)}
                >
                    Eliminar cuenta
                </button>
            </section>

            {showDeleteModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>¿Estás seguro que quieres eliminar tu cuenta?</h3>
                        <p>
                            Ya no podrás acceder más a nuestra web con tu usuario.
                        </p>

                        {deleteErr && <p className={styles.error}>{deleteErr}</p>}

                        <div className={styles.modalActions}>
                            <button
                                className={styles.cancelButton}
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancelar
                            </button>

                            <button
                                className={styles.confirmDeleteButton}
                                onClick={handleDeleteAccount}
                            >
                                Eliminar cuenta
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditarPerfil;