import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminDashboard.module.css";
import Button from "../../components/Button/Button";
import { getCartasModelo } from "../../services/cartasModelo";
import { getAllUsers } from "../../services/usuarios";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCards: 0,
        recentUsers: [],
        recentCards: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Cargar cartas recientes y total
        const fetchCartas = async () => {
            try {
                const res = await getCartasModelo({ page: 0, size: 5, sort: "id,desc" });
                const cards = res.data.content || res.data;
                setStats(prev => ({
                    ...prev,
                    totalCards: res.data.totalElements || cards.length,
                    recentCards: cards,
                }));
            } catch (err) {
                console.error("Error fetching cartas:", err);
            } finally {
                setLoading(false);
            }
        };

        // Cargar usuarios recientes y total
        const fetchUsuarios = async () => {
            try {
                const res = await getAllUsers();
                const users = res.data || [];
                setStats(prev => ({
                    ...prev,
                    totalUsers: users.length,
                    recentUsers: users.slice(-5).reverse(), // últimos 5 usuarios
                }));
            } catch (err) {
                console.error("Error fetching usuarios:", err);
            }
        };

        fetchCartas();
        fetchUsuarios();
    }, []);

    if (loading) {
        return (
            <div className="py-5 text-center">
                <div className="spinner-border mb-3" role="status" />
                <div>Cargando datos...</div>
            </div>
        );
    }

    return (
        <div className={styles.dashboardContainer}>
            <h1 className={styles.title}>Panel de Administración</h1>

            {/* Resumen rápido */}
            <div className={styles.summaryRow}>
                <div className={styles.cardSummary}
                    onClick={() => navigate("/usuarios")}>
                    <div className="card-body">
                        <h2 className="card-title">Usuarios</h2>
                        <p className="card-text display-5">{stats.totalUsers}</p>
                        <Button onClick={(e) => {
                            e.stopPropagation();
                            navigate("/usuarios");
                        }}>
                            Ver Usuarios
                        </Button>
                    </div>
                </div>
                <div className={styles.cardSummary}
                    onClick={() => navigate("/explorar")}
                >
                    <div className="card-body">
                        <h2 className="card-title">Cartas</h2>
                        <p className="card-text display-5">{stats.totalCards}</p>
                        <Button onClick={(e) => {
                            e.stopPropagation();
                            navigate("/explorar");
                        }}>
                            Explorar Cartas
                        </Button>
                    </div>
                </div>
            </div>

            {/* Actividad reciente */}
            <div className={styles.recentActivityRow}>
                <div className={styles.recentActivityColumn}>
                    <h3>Usuarios recientes</h3>
                    <ul className={styles.list}>
                        {stats.recentUsers.map((user) => (
                            <li key={user.id}>{user.username || user.nombre || `ID ${user.id}`}</li>
                        ))}
                    </ul>
                </div>
                <div className={styles.recentActivityColumn}>
                    <h3>Cartas recientes</h3>
                    <ul className={styles.list}>
                        {stats.recentCards.map((card) => (
                            <li key={card.id}>{card.nombre || `Carta ${card.id}`}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;