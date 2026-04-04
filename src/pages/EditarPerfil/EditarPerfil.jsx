import styles from "./EditarPerfil.module.css";
import { changeUsername, changePassword, deleteUser } from "../../services/usuarios.js";
import { getDireccionByUsername, updateDireccion, createDireccion } from "../../services/direcciones.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useState, useEffect } from "react";
import { getCurrentUser } from "../../utils/token.js";
import { useNavigate, useLocation } from "react-router-dom";
import Notification from "../../components/Notification/Notification.jsx";
import Button from "../../components/Button/Button.jsx";

const EditarPerfil = () => {
    const [activeTab, setActiveTab] = useState("credenciales"); // Tab activa: credenciales, direccion, eliminar
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
    const [nombre, setNombre] = useState("");
    const [calleYNumero, setCalleYNumero] = useState("");
    const [pisoYPuerta, setPisoYPuerta] = useState("");
    const [codigoPostal, setCodigoPostal] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [pais, setPais] = useState("");

    // --- Controles de carga ---
    const [updatingUsername, setUpdatingUsername] = useState(false);
    const [updatingPassword, setUpdatingPassword] = useState(false);
    const [updatingDireccion, setUpdatingDireccion] = useState(false);
    const [deletingAccount, setDeletingAccount] = useState(false);

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
                    setNombre(d.nombre || "");
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
        if (updatingUsername) return;

        setUserErr("");
        setUpdatingUsername(true);

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
        } finally {
            setUpdatingUsername(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (updatingPassword) return;

        setPassErr("");
        setUpdatingPassword(true);

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
        } finally {
            setUpdatingPassword(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (deletingAccount) return;

        setDeleteErr("");
        setDeletingAccount(true);

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
        } finally {
            setDeletingAccount(false);
        }
    };

    // --- Manejo de dirección ---
    const handleDireccionSubmit = async (e) => {
        e.preventDefault();
        if (updatingDireccion) return;

        setUpdatingDireccion(true);

        try {
            const direccionDTO = {
                nombre,
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

            setNotification({
                type: "success",
                message: "Dirección actualizada correctamente."
            });
        } catch (err) {
            setNotification({
                type: "error",
                message: err.response?.data?.mensaje || err.message || "Error al actualizar dirección"
            });
        } finally {
            setUpdatingDireccion(false);
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
                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={updatingUsername}
                                >
                                    {updatingUsername ? "Actualizando…" : "Actualizar nombre de usuario"}
                                </Button>
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
                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={updatingPassword}
                                >
                                    {updatingPassword ? "Actualizando…" : "Actualizar contraseña"}
                                </Button>
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
                                <label>Nombre completo</label>
                                <input
                                    className={styles.input}
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    required
                                />
                            </div>
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
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={updatingDireccion}
                            >
                                {updatingDireccion ? "Actualizando…" : "Actualizar dirección"}
                            </Button>
                        </form>
                    </section>
                )}

                {activeTab === "eliminar" && (
                    <section className={styles.section}>
                        <h2>Eliminar cuenta</h2>
                        <Button
                            variant="danger"
                            onClick={() => setShowDeleteModal(true)}
                        >
                            Eliminar cuenta
                        </Button>
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
                                <Button
                                    variant="cancel"
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    Cancelar
                                </Button>

                                <Button
                                    variant="danger"
                                    onClick={handleDeleteAccount}
                                    disabled={deletingAccount}
                                >
                                    {deletingAccount ? "Eliminando…" : "Eliminar cuenta"}
                                </Button>
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