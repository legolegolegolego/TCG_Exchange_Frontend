import { useEffect, useState } from "react";
import styles from "./EditarCrearCartaModelo.module.css";
import { createCartaModelo, updateCartaModelo } from "../../services/cartasModelo";
import Button from "../Button/Button";

const EditarCrearCartaModelo = ({ isOpen, onClose, onSave, onError, initialData }) => {
    const [form, setForm] = useState({
        numero: "",
        nombre: "",
        tipoCarta: "",
        rareza: "",
        tipoPokemon: "",
        evolucion: "",
        imagenUrl: "",
    });

    const [errors, setErrors] = useState({});
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        setErrors({});
        if (initialData) {
            setForm({
                numero: initialData.numero || "",
                nombre: initialData.nombre || "",
                tipoCarta: initialData.tipoCarta || "",
                rareza: initialData.rareza || "",
                tipoPokemon: initialData.tipoPokemon || "",
                evolucion: initialData.evolucion || "",
                imagenUrl: initialData.imagenUrl || "",
            });
        } else {
            setForm({
                numero: "",
                nombre: "",
                tipoCarta: "",
                rareza: "",
                tipoPokemon: "",
                evolucion: "",
                imagenUrl: "",
            });
        }
    }, [isOpen, initialData]);

    const handleSubmit = async () => {
        try {
            setErrors({});
            setGuardando(true);

            // Si no es Pokemon, pone los campos null para evitar problemas de validación de enum en el backend
            const dataToSend = {
                ...form,
                tipoCarta: form.tipoCarta || null,
                rareza: form.rareza || null,
                tipoPokemon: form.tipoCarta === "POKEMON" ? (form.tipoPokemon || null) : null,
                evolucion: form.tipoCarta === "POKEMON" ? (form.evolucion || null) : null
            };

            if (initialData?.id) {
                await updateCartaModelo(initialData.id, dataToSend);
            } else {
                await createCartaModelo(dataToSend);
            }

            onSave(dataToSend);
        } catch (error) {
            const backendErrors = error.response?.data?.errors || {};
            setErrors(backendErrors);
            setGuardando(false);

            // Notificación global al padre
            const msg = error.response?.data?.mensaje || "Error al guardar la carta modelo";
            if (onError) onError({ fieldErrors: backendErrors, message: msg });
        }
    };

    if (!isOpen) return null;

    const isPokemon = form.tipoCarta === "POKEMON";
    const disabledPokemon = !isPokemon;

    return (
        <div className={`${styles.modalOverlay} modal fade show d-block`} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content p-3 p-md-4">
                    <div className="modal-header pe-1">
                        <h3 className="modal-title">{initialData ? "Editar Carta Modelo" : "Nueva Carta Modelo"}</h3>
                        <button type="button" className="btn-close" onClick={onClose}></button>

                    </div>
                    <div className="modal-body">
                        <p>Modifica la información de tu carta modelo.</p>

                        <div className="row g-3">
                            {/* Número */}
                            <div className="col-12 col-md-6">
                                <label className="form-label">Número <span className="text-danger">*</span></label>
                                <input
                                    type="number"
                                    className={`form-control ${errors.numero ? "is-invalid" : ""}`}
                                    placeholder="Número de carta"
                                    value={form.numero}
                                    onChange={(e) => setForm({ ...form, numero: e.target.value })}
                                    required
                                    disabled={guardando}
                                />
                                {errors.numero && <div className="invalid-feedback">{errors.numero}</div>}
                            </div>

                            {/* Nombre */}
                            <div className="col-12 col-md-6">
                                <label className="form-label">Nombre <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                                    placeholder="Nombre de carta"
                                    value={form.nombre}
                                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                                    required
                                    disabled={guardando}
                                />
                                {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                            </div>

                            {/* Tipo de carta */}
                            <div className="col-12 col-md-6">
                                <label className="form-label">Tipo de Carta <span className="text-danger">*</span></label>
                                <select
                                    className={`form-select ${errors.tipoCarta ? "is-invalid" : ""}`}
                                    value={form.tipoCarta}
                                    onChange={(e) => setForm({ ...form, tipoCarta: e.target.value, tipoPokemon: "", evolucion: "" })}
                                    required
                                    disabled={guardando}
                                >
                                    <option value="">Selecciona tipo</option>
                                    <option value="POKEMON">POKEMON</option>
                                    <option value="ENTRENADOR">ENTRENADOR</option>
                                </select>
                                {errors.tipoCarta && <div className="invalid-feedback">{errors.tipoCarta}</div>}
                            </div>

                            {/* Rareza */}
                            <div className="col-12 col-md-6">
                                <label className="form-label">Rareza <span className="text-danger">*</span></label>
                                <select
                                    className={`form-select ${errors.rareza ? "is-invalid" : ""}`}
                                    value={form.rareza}
                                    onChange={(e) => setForm({ ...form, rareza: e.target.value })}
                                    required
                                    disabled={guardando}
                                >
                                    <option value="">Selecciona rareza</option>
                                    <option value="COMUN">COMÚN</option>
                                    <option value="INFRECUENTE">INFRECUENTE</option>
                                    <option value="RARA">RARA</option>
                                    <option value="RARA_HOLO">RARA HOLO</option>
                                </select>
                                {errors.rareza && <div className="invalid-feedback">{errors.rareza}</div>}
                            </div>

                            {/* Tipo Pokémon */}
                            <div className="col-12 col-md-6">
                                <label className="form-label">Tipo Pokémon {isPokemon && <span className="text-danger">*</span>}</label>
                                <select
                                    className={`form-select ${errors.tipoPokemon ? "is-invalid" : ""}`}
                                    value={form.tipoPokemon}
                                    onChange={(e) => setForm({ ...form, tipoPokemon: e.target.value })}
                                    disabled={disabledPokemon || guardando}
                                    title={disabledPokemon ? "Solo aplicable si tipo carta es POKEMON" : ""}
                                    required={isPokemon}
                                >
                                    <option value="">Selecciona tipo</option>
                                    <option value="PLANTA">PLANTA</option>
                                    <option value="FUEGO">FUEGO</option>
                                    <option value="AGUA">AGUA</option>
                                    <option value="ELECTRICO">ELÉCTRICO</option>
                                    <option value="PSIQUICO">PSÍQUICO</option>
                                    <option value="LUCHA">LUCHA</option>
                                    <option value="INCOLORO">INCOLORO</option>
                                </select>
                                {errors.tipoPokemon && <div className="invalid-feedback">{errors.tipoPokemon}</div>}
                            </div>

                            {/* Evolución */}
                            <div className="col-12 col-md-6">
                                <label className="form-label">Etapa Evolución {isPokemon && <span className="text-danger">*</span>}</label>
                                <select
                                    className={`form-select ${errors.evolucion ? "is-invalid" : ""}`}
                                    value={form.evolucion}
                                    onChange={(e) => setForm({ ...form, evolucion: e.target.value })}
                                    disabled={disabledPokemon || guardando}
                                    title={disabledPokemon ? "Solo aplicable si tipo carta es POKEMON" : ""}
                                    required={isPokemon}
                                >
                                    <option value="">Selecciona etapa</option>
                                    <option value="BASICO">BÁSICO</option>
                                    <option value="FASE_1">FASE 1</option>
                                    <option value="FASE_2">FASE 2</option>
                                </select>
                                {errors.evolucion && <div className="invalid-feedback">{errors.evolucion}</div>}
                            </div>

                            {/* Imagen */}
                            <div className="col-12">
                                <label className="form-label">URL Imagen <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.imagenUrl ? "is-invalid" : ""}`}
                                    placeholder="URL imagen"
                                    value={form.imagenUrl}
                                    onChange={(e) => setForm({ ...form, imagenUrl: e.target.value })}
                                    required
                                    disabled={guardando}
                                />
                                {errors.imagenUrl && <div className="invalid-feedback">{errors.imagenUrl}</div>}
                            </div>
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

export default EditarCrearCartaModelo;