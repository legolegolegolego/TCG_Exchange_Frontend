import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Explorar = () => {
	const { token, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	return (
		<div style={{ padding: 24 }}>
			<h1>Página principal de prueba</h1>
			<p>
				Token almacenado: {token ? `${token.substring(0, 40)}...` : "(no hay token)"}
			</p>
			<div style={{ display: "flex", gap: 8 }}>
				<button onClick={handleLogout}>Cerrar sesión</button>
			</div>
		</div>
	);
};

export default Explorar;

