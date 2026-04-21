import { useEffect, useState } from "react";
import styles from "./EditarCrearCartaFisica.module.css";
import { getCartasModelo } from "../../services/cartasModelo";
import Button from "../Button/Button";

const EditarCrearCartaFisica = ({ isOpen, onClose, onSave, initialData, guardando }) => {
  const [modelos, setModelos] = useState([]);
  const [form, setForm] = useState({
    idCartaModelo: "",
    estadoCarta: "EXCELENTE",
    imagenUrl: ""
  });

  useEffect(() => {
    if (!isOpen) return;

    const fetchAllModelos = async () => {
      let allModelos = [];
      let page = 0;
      let totalPages = 1;

      // Recorrer todas las páginas
      do {
        const res = await getCartasModelo({ sort: "numero,asc", page, size: 50 });
        const data = res.data;
        allModelos = allModelos.concat(data.content || data);
        totalPages = data.totalPages || 1;
        page++;
      } while (page < totalPages);

      setModelos(allModelos);
    };

    fetchAllModelos();

    // Inicializar formulario
    if (initialData) {
      setForm({
        idCartaModelo: initialData.idCartaModelo,
        estadoCarta: initialData.estadoCarta,
        imagen: null
      });
    } else {
      setForm({
        idCartaModelo: "",
        estadoCarta: "EXCELENTE",
        imagen: null
      });
    }
  }, [isOpen, initialData]);

  const handleSubmit = () => {
    const formData = new FormData();

    formData.append("idCartaModelo", form.idCartaModelo);
    formData.append("estadoCarta", form.estadoCarta);

    if (form.imagen) {
      formData.append("imagen", form.imagen);
    }

    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className={`${styles.modalOverlay} modal fade show d-block`} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-3 p-md-4">
          <div className="modal-header pe-1">
            <h3 className="modal-title">{initialData ? "Editar Carta" : "Nueva Carta"}</h3>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>Modifica la información de tu carta física.</p>

            {/* Selector modelo */}
            <div className="mb-3">
              <label className="form-label">Modelo de Carta</label>
              <select
                className="form-select"
                value={form.idCartaModelo}
                onChange={(e) => setForm({ ...form, idCartaModelo: e.target.value })}
                disabled={guardando}
              >
                <option value="">Selecciona carta</option>
                {modelos.map((m) => (
                  <option key={m.id} value={m.id}>
                    #{m.numero} - {m.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Estado */}
            <div className="mb-3">
              <label className="form-label">Estado</label>
              <select
                className="form-select"
                value={form.estadoCarta}
                onChange={(e) => setForm({ ...form, estadoCarta: e.target.value })}
                disabled={guardando}
              >
                <option value="EXCELENTE">EXCELENTE</option>
                <option value="ACEPTABLE">ACEPTABLE</option>
              </select>
            </div>

            {/* Imagen */}
            <div className="mb-3">
              <label className="form-label">Imagen</label>
              <input
                type="file"
                className="form-control"
                accept="image/jpeg, image/png, image/webp"
                placeholder="imagen carta física"
                onChange={(e) => setForm({ ...form, imagen: e.target.files[0] })}
                disabled={guardando}
              />
              {/* Preview de imagen actual */}
              {initialData?.imagenUrl && !form.imagen && (
                <div className={styles.previewContainer}>
                  <img
                    src={initialData.imagenUrl}
                    alt="preview imagen actual"
                    className={styles.previewImage}
                  />
                </div>
              )}
              {/* Preview nueva imagen */}
              {form.imagen && (
                <div className={styles.previewContainer}>
                  <img
                    src={URL.createObjectURL(form.imagen)}
                    alt="preview nueva imagen"
                    className={styles.previewImage}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <Button variant="cancel" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit} disabled={guardando}>
              {guardando ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarCrearCartaFisica;