import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDisponiblesByUsername, getNoDisponiblesByUsername } from "../../services/cartasFisicas";
import { getIntercambiosByUsuario } from "../../services/intercambios";
import { deleteUser } from "../../services/usuarios";
import styles from "./CardUser.module.css";

const CardUser = ({ user, onDelete }) => {
    const navigate = useNavigate();

    if (!user) return null;

    const { id, username, roles, desactivado } = user;

    const [hasCartas, setHasCartas] = useState(false);
    const [hasIntercambios, setHasIntercambios] = useState(false);
    const [loadingChecks, setLoadingChecks] = useState(true);

    // Modal eliminar
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteErr, setDeleteErr] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const goToUser = () => navigate(`/usuario/${encodeURIComponent(username)}`);
    const goToIntercambios = () => navigate("/mis-intercambios");

    useEffect(() => {
        const checkData = async () => {
            try {
                const [disp, noDisp, intercambios] = await Promise.all([
                    getDisponiblesByUsername(username),
                    getNoDisponiblesByUsername(username),
                    getIntercambiosByUsuario(username)
                ]);

                setHasCartas(
                    (disp.data?.length || 0) > 0 ||
                    (noDisp.data?.length || 0) > 0
                );

                setHasIntercambios((intercambios.data?.length || 0) > 0);
            } catch {
                setHasCartas(false);
                setHasIntercambios(false);
            } finally {
                setLoadingChecks(false);
            }
        };

        checkData();
    }, [username]);

    const handleDelete = async () => {
        try {
            setDeleting(true);
            await deleteUser(id);

            // Notificar al padre para quitar el usuario de la lista
            if (onDelete) onDelete(id);

            setShowDeleteModal(false);
        } catch (err) {
            setDeleteErr("Error al eliminar el usuario");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <div className={`card ${styles.cardUser} mb-2`}>
                <div className="card-body py-2 px-3">
                    <div className="row align-items-center g-2">

                        <div className="col-2 col-sm-1 text-muted small">
                            #{id}
                        </div>

                        <div className="col-4 col-sm-3 fw-semibold text-truncate">
                            {username}
                        </div>

                        <div className="col-3 col-sm-2 text-truncate">
                            <span className={roles?.includes("ADMIN") ? "badge bg-warning" : "badge bg-secondary"}>
                                {roles}
                            </span>
                        </div>

                        <div className="col-3 col-sm-2">
                            <span className={`badge ${desactivado ? "bg-danger" : "bg-success"}`}>
                                {desactivado ? "Desactivado" : "Activo"}
                            </span>
                        </div>

                        {/* Botones */}
                        <div className="col-12 col-sm-4 d-flex justify-content-sm-end gap-2 mt-2 mt-sm-0 flex-wrap">

                            <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={goToUser}
                                disabled={loadingChecks || !hasCartas}
                                title={
                                    loadingChecks
                                        ? "Cargando..."
                                        : !hasCartas
                                            ? "Usuario sin cartas"
                                            : ""
                                }
                            >
                                Cartas
                            </button>

                            <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={goToIntercambios}
                                disabled={loadingChecks || !hasIntercambios}
                                title={
                                    loadingChecks
                                        ? "Cargando..."
                                        : !hasIntercambios
                                            ? "Usuario sin intercambios"
                                            : ""
                                }
                            >
                                Intercambios
                            </button>

                            <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => setShowDeleteModal(true)}
                                disabled={desactivado}
                                title={desactivado ? "Usuario ya desactivado" : ""}
                            >
                                Eliminar
                            </button>

                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showDeleteModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h5>¿Eliminar usuario?</h5>
                        <p>No se podrá recuperar.</p>

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
                                onClick={handleDelete}
                                disabled={deleting}
                            >
                                {deleting ? "Eliminando..." : "Eliminar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CardUser;