import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getCartasModelo } from "../../services/cartasModelo";
import CardModel from "../../components/CardModel/CardModel";
import RangeSlider from "../../components/RangeSlider/RangeSlider";
import Notification from "../../components/Notification/Notification";
import styles from "./Explorar.module.css";

const SORT_OPTIONS = [
  { label: "Número ↑", value: "numero,asc" },
  { label: "Número ↓", value: "numero,desc" },
  { label: "Nombre A-Z", value: "nombre,asc" },
  { label: "Nombre Z-A", value: "nombre,desc" },
  { label: "Rareza (común→rara-holo)", value: "rareza,asc" },
  { label: "Rareza (rara-holo→común)", value: "rareza,desc" },
];

const Explorar = () => {
  const location = useLocation();
  const [filters, setFilters] = useState({
    numeroMin: null,
    numeroMax: null,
    nombre: "",
    tipoCarta: "",
    rareza: "",
    tipoPokemon: "",
    evolucion: "",
  });
  const [numberBounds, setNumberBounds] = useState({ min: 1, max: 1000 });
  const [sort, setSort] = useState(SORT_OPTIONS[0].value);
  const [page, setPage] = useState(0);
  const [size] = useState(12);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [notification, setNotification] = useState(location.state?.notification || null);

  useEffect(() => {
    window.history.replaceState({}, document.title);
  }, []);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const params = { ...filters, page, size, sort };
      const res = await getCartasModelo(params);
      const data = res.data;
      setCards(data.content || []);
      setTotalPages(data.totalPages ?? 0);
    } catch (err) {
      const msg = err.response?.data?.mensaje || "No se pudieron cargar las cartas.";
      setNotification({ type: "error", message: msg });
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [filters, sort, page]);

  useEffect(() => {
    const fetchBounds = async () => {
      try {
        const resMax = await getCartasModelo({ page: 0, size: 1, sort: "numero,desc" });
        const maxNum = resMax?.data?.content?.[0]?.numero;
        const resMin = await getCartasModelo({ page: 0, size: 1, sort: "numero,asc" });
        const minNum = resMin?.data?.content?.[0]?.numero;
        const minVal = Number(minNum) || 1;
        const maxVal = Number(maxNum) || 1000;
        setNumberBounds({ min: minVal, max: maxVal });
        setFilters(prev => ({ ...prev, numeroMin: minVal, numeroMax: maxVal }));
      } catch (err) {
        const msg = err.response?.data?.mensaje || "No se pudieron obtener los límites de número de cartas.";
        setNotification({ type: "error", message: msg });
      }
    };
    fetchBounds();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(0);
  };

  const handleClear = () => {
    setFilters({ numeroMin: "", numeroMax: "", nombre: "", tipoCarta: "", rareza: "", tipoPokemon: "", evolucion: "" });
    setPage(0);
  };

  return (
    <div className={styles.container}>
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <aside className={styles.filters}>
        <h3>Filtros</h3>
        <label>Número</label>
        <RangeSlider
          min={numberBounds.min}
          max={numberBounds.max}
          step={1}
          value={[filters.numeroMin ?? numberBounds.min, filters.numeroMax ?? numberBounds.max]}
          onChange={(vals) => {
            setFilters(prev => ({ ...prev, numeroMin: vals[0], numeroMax: vals[1] }));
            setPage(0);
          }}
        />
        <label>Nombre</label>
        <input name="nombre" value={filters.nombre} onChange={handleChange} />
        <label>Tipo de carta</label>
        <select name="tipoCarta" value={filters.tipoCarta} onChange={handleChange}>
          <option value="">(Todos)</option>
          <option value="POKEMON">POKEMON</option>
          <option value="ENTRENADOR">ENTRENADOR</option>
        </select>
        <label>Rareza</label>
        <select name="rareza" value={filters.rareza} onChange={handleChange}>
          <option value="">(Todas)</option>
          <option value="COMUN">COMUN</option>
          <option value="INFRECUENTE">INFRECUENTE</option>
          <option value="RARA">RARA</option>
          <option value="RARA_HOLO">RARA HOLO</option>
        </select>
        <label>Tipo Pokémon</label>
        <select name="tipoPokemon" value={filters.tipoPokemon} onChange={handleChange}>
          <option value="">(Todos)</option>
          <option value="PLANTA">PLANTA</option>
          <option value="FUEGO">FUEGO</option>
          <option value="AGUA">AGUA</option>
          <option value="ELÉCTRICO">ELECTRICO</option>
          <option value="PSIQUICO">PSÍQUICO</option>
          <option value="LUCHA">LUCHA</option>
          <option value="INCOLORO">INCOLORO</option>
        </select>
        <label>Etapa evolución</label>
        <select name="evolucion" value={filters.evolucion} onChange={handleChange}>
          <option value="">(Todas)</option>
          <option value="BASICO">BASICO</option>
          <option value="FASE_1">FASE 1</option>
          <option value="FASE_2">FASE 2</option>
        </select>
        <div style={{ marginTop: 8 }}>
          <button onClick={handleClear}>Limpiar</button>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.topbar}>
          <div>
            <label>Ordenar:</label>
            <select value={sort} onChange={e => { setSort(e.target.value); setPage(0); }}>
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <small>{loading ? "Cargando..." : `Página ${page + 1} de ${totalPages || 1}`}</small>
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page <= 0}>Anterior</button>
            <button onClick={() => setPage(p => Math.min((totalPages || 1) - 1, p + 1))} disabled={page >= (totalPages || 1) - 1}>Siguiente</button>
          </div>
        </div>

        <div className={styles.grid}>
          {cards.length === 0 && !loading && <p>No se encontraron cartas.</p>}
          {cards.map(c => (
            <CardModel key={c.id} carta={c} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Explorar;