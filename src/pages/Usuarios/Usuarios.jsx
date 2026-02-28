import React, { useEffect, useState } from "react";
import CardUser from "../../components/CardUser/CardUser";
import { getAllUsers } from "../../services/usuarios";
import styles from "./Usuarios.module.css";

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    // PAGINACIÓN
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    // ORDENACIÓN POR DEFECTO
    const [sortField, setSortField] = useState("id");
    const [sortOrder, setSortOrder] = useState("asc"); // asc o desc

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await getAllUsers();
                setUsuarios(response.data);
            } catch (err) {
                setError("Error al cargar los usuarios");
            } finally {
                setLoading(false);
            }
        };

        fetchUsuarios();
    }, []);

    // Filtrar usuarios
    const filteredUsers = usuarios.filter((u) =>
        u.username.toLowerCase().includes(search.toLowerCase())
    );

    // Ordenar usuarios
    const sortedUsers = [...filteredUsers].sort((a, b) => {
        const aField = a[sortField];
        const bField = b[sortField];

        if (typeof aField === "string") {
            return sortOrder === "asc"
                ? aField.localeCompare(bField)
                : bField.localeCompare(aField);
        } else if (typeof aField === "number") {
            return sortOrder === "asc" ? aField - bField : bField - aField;
        } else {
            return 0;
        }
    });

    // Cortar array según página
    const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
    const paginatedUsers = sortedUsers.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    const handlePrev = () => setPage((p) => Math.max(p - 1, 1));
    const handleNext = () => setPage((p) => Math.min(p + 1, totalPages));

    const handleSortChange = (field) => {
        if (sortField === field) {
            // alternar asc/desc
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
        setPage(1); // reiniciar página al cambiar orden
    };

    return (
        <div className={`container ${styles.container}`}>
            <h1 className="mb-4">Lista de Usuarios</h1>

            {loading && <p>Cargando...</p>}
            {error && <p className="text-danger">{error}</p>}

            {!loading && !error && (
                <>
                    <div className="mb-3 d-flex justify-content-between align-items-center flex-wrap gap-2">

                        {/* IZQUIERDA: Ordenación */}
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                            <span>Ordenar por:</span>

                            <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleSortChange("id")}
                            >
                                ID {sortField === "id" && (sortOrder === "asc" ? "↑" : "↓")}
                            </button>

                            <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleSortChange("username")}
                            >
                                Username {sortField === "username" && (sortOrder === "asc" ? "↑" : "↓")}
                            </button>

                            <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleSortChange("roles")}
                            >
                                Roles {sortField === "roles" && (sortOrder === "asc" ? "↑" : "↓")}
                            </button>
                        </div>

                        {/* DERECHA: Buscador */}
                        <div>
                            <input
                                type="text"
                                placeholder="Buscar username..."
                                className="form-control form-control-sm"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1); // reset paginación
                                }}
                            />
                        </div>

                    </div>

                    {/* Lista de usuarios */}
                    <div className="d-flex flex-column">
                        {paginatedUsers.length === 0 ? (
                            <p className="text-muted">
                                No se encontraron usuarios{search && ` con username: "${search}"`}
                            </p>
                        ) : (
                            paginatedUsers.map((user) => (
                                <CardUser key={user.id}
                                    user={user}
                                    onDelete={(deletedId) =>
                                        setUsuarios((prev) =>
                                            prev.filter((u) => u.id !== deletedId)
                                        )
                                    }
                                />
                            ))
                        )}
                    </div>

                    {/* Paginación */}
                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={handlePrev}
                            disabled={page === 1}
                        >
                            Anterior
                        </button>
                        <span>
                            Página {page} de {totalPages}
                        </span>
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={handleNext}
                            disabled={page === totalPages}
                        >
                            Siguiente
                        </button>

                    </div>
                </>
            )}
        </div>
    );
};

export default Usuarios;