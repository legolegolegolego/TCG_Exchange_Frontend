import styles from "./EditarPerfil.module.css";
import { changeUsername, changePassword, deleteUser } from "../../services/usuarios.js";
import { getDireccionByUsername, updateDireccion, createDireccion } from "../../services/direcciones.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useState, useEffect } from "react";
import { getCurrentUser } from "../../utils/token.js";
import { useNavigate, useLocation } from "react-router-dom";
import Notification from "../../components/Notification/Notification.jsx";

const EditarPerfil = () => {
    const [activeTab, setActiveTab] = useState("credenciales"); // Tab activa: credenciales o direccion
    const location = useLocation();

    // --- Datos de usuario ---
    const [username, setUsername] = useState("");
    const [passwordActual, setPasswordActual] = useState("");
    const [passwordNueva, setPasswordNueva] = useState("");
    const [passwordNueva2, setPasswordNueva2] = useState("");
    const [userErr, setUserErr] = useState("");
    const [passErr, setPassErr] = useState("");

    const { token, logout } = useAuth();
    const [userId, setUserId] = useState(null);

    const navigate = useNavigate();

    // --- Modal eliminar cuenta ---
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteErr, setDeleteErr] = useState("");

    // --- Notificación ---
    const [notification, setNotification] = useState(null);

    // --- Datos de dirección ---
    const [calleYNumero, setCalleYNumero] = useState("");
    const [pisoYPuerta, setPisoYPuerta] = useState("");
    const [codigoPostal, setCodigoPostal] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [pais, setPais] = useState("");

    useEffect(() => {
        if (location.state?.tab) {
            setActiveTab(location.state.tab);
        }
    }, [location.state]);

    useEffect(() => {
        const user = getCurrentUser();
        const stored = sessionStorage.getItem("notification");

        if (!user) {
            setUserErr("Usuario no autenticado.");
            return;
        }

        if (stored) {
            setNotification(JSON.parse(stored));
            sessionStorage.removeItem("notification");
        }

        if (user.username) setUsername(user.username);
        setUserId(user.id);

        // Cargar dirección si existe
        getDireccionByUsername(user.username)
            .then(res => {
                const d = res.data;
                if (d) {
                    setCalleYNumero(d.calleYNumero || "");
                    setPisoYPuerta(d.pisoYPuerta || "");
                    setCodigoPostal(d.codigoPostal || "");
                    setCiudad(d.ciudad || "");
                    setPais(d.pais || "");
                }
            })
            .catch(() => {
                // No existe dirección, campos vacíos
            });
    }, [token]);

    // --- Manejo de credenciales ---
    const handleUsernameSubmit = async (e) => {
        e.preventDefault();
        setUserErr("");

        try {
            if (!userId) throw new Error("Usuario no identificado");

            await changeUsername(userId, username);

            sessionStorage.setItem("notification", JSON.stringify({
                type: "success",
                message: "Nombre de usuario actualizado correctamente."
            }));

            logout();
            navigate("/login", { replace: true });
        } catch (err) {
            setUserErr(err.response?.data?.mensaje || err.message || "Error al actualizar usuario");
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPassErr("");

        try {
            if (!userId) throw new Error("Usuario no identificado");

            await changePassword(userId, { passwordActual, passwordNueva, passwordNueva2 });

            sessionStorage.setItem("notification", JSON.stringify({
                type: "success",
                message: "Contraseña actualizada correctamente."
            }));

            setPasswordActual("");
            setPasswordNueva("");
            setPasswordNueva2("");

            logout();
            navigate("/login", { replace: true });

        } catch (err) {
            setPassErr(err.response?.data?.mensaje || err.message || "Error al actualizar contraseña");
        }
    };

    const handleDeleteAccount = async () => {
        setDeleteErr("");

        try {
            if (!userId) throw new Error("Usuario no identificado");

            await deleteUser(userId);

            sessionStorage.setItem(
                "notification",
                JSON.stringify({
                    type: "success",
                    message: "Cuenta eliminada correctamente"
                })
            );

            logout();
            navigate("/login", { replace: true });

        } catch (err) {
            setDeleteErr(err.response?.data?.mensaje || err.message || "Error al eliminar cuenta");
        }
    };

    // --- Manejo de dirección ---
    const handleDireccionSubmit = async (e) => {
        e.preventDefault();
        try {
            const direccionDTO = {
                calleYNumero,
                pisoYPuerta: pisoYPuerta || null,
                codigoPostal,
                ciudad,
                pais
            };

            // Intentar actualizar; si no existe, crear
            await updateDireccion(direccionDTO).catch(async (err) => {
                // Si falla por no existir, creamos
                await createDireccion(direccionDTO);
            });

            sessionStorage.setItem("notification", JSON.stringify({
                type: "success",
                message: "Dirección actualizada correctamente."
            }));

            setNotification({
                type: "success",
                message: "Dirección actualizada correctamente."
            });
        } catch (err) {
            setNotification({
                type: "error",
                message: err.response?.data?.mensaje || err.message || "Error al actualizar dirección"
            });
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <button
                    className={activeTab === "credenciales" ? styles.active : ""}
                    onClick={() => setActiveTab("credenciales")}
                >
                    Credenciales
                </button>
                <button
                    className={activeTab === "direccion" ? styles.active : ""}
                    onClick={() => setActiveTab("direccion")}
                >
                    Dirección
                </button>
                <button
                    className={activeTab === "eliminar" ? styles.active : ""}
                    onClick={() => setActiveTab("eliminar")}
                >
                    Eliminar cuenta
                </button>
            </div>

            <div className={styles.content}>
                {activeTab === "credenciales" && (
                    <>
                        {/* Formulario de nombre de usuario */}
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
                                <button className={styles.button} type="submit">Actualizar nombre de usuario</button>
                                {userErr && <p className={styles.error}>{userErr}</p>}
                            </form>
                        </section>

                        {/* Formulario de contraseña */}
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
                                <button className={styles.button} type="submit">Actualizar contraseña</button>
                                {passErr && <p className={styles.error}>{passErr}</p>}
                            </form>
                        </section>
                    </>
                )}

                {activeTab === "direccion" && (
                    <section className={styles.section}>
                        <h2>Actualizar Dirección</h2>
                        <form onSubmit={handleDireccionSubmit}>
                            <div className={styles.field}>
                                <label>Calle y número</label>
                                <input
                                    className={styles.input}
                                    value={calleYNumero}
                                    onChange={(e) => setCalleYNumero(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.field}>
                                <label>Piso y puerta</label>
                                <input
                                    className={styles.input}
                                    value={pisoYPuerta}
                                    onChange={(e) => setPisoYPuerta(e.target.value)}
                                />
                            </div>
                            <div className={styles.field}>
                                <label>Código postal</label>
                                <input
                                    className={styles.input}
                                    value={codigoPostal}
                                    onChange={(e) => setCodigoPostal(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.field}>
                                <label>Ciudad</label>
                                <input
                                    className={styles.input}
                                    value={ciudad}
                                    onChange={(e) => setCiudad(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.field}>
                                <label>País</label>
                                <input
                                    className={styles.input}
                                    value={pais}
                                    onChange={(e) => setPais(e.target.value)}
                                    required
                                />
                            </div>
                            <button className={styles.button} type="submit">Actualizar dirección</button>
                        </form>
                    </section>
                )}

                {activeTab === "eliminar" && (
                    <section className={styles.section}>
                        <h2>Eliminar cuenta</h2>
                        <button
                            className={styles.deleteButton}
                            onClick={() => setShowDeleteModal(true)}
                        >
                            Eliminar cuenta
                        </button>
                    </section>
                )}

                {/* Modal de eliminación */}
                {showDeleteModal && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <h3>¿Estás seguro que quieres eliminar tu cuenta?</h3>
                            <p>Ya no podrás acceder más a nuestra web con tu usuario.</p>

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

            {/* Notificación */}
            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}
        </div>
    );
};

export default EditarPerfil;