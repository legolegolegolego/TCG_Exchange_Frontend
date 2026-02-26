// import { useEffect, useState } from "react";
// import styles from "./MisCartas.module.css";
// import {
//   getDisponiblesByUsername,
//   getNoDisponiblesByUsername,
//   deleteCartaFisica,
//   createCartaFisica,
//   updateCartaFisica
// } from "../../services/cartasFisicas";
// import { useAuth } from "../../context/AuthContext";
// import CardFisica from "../../components/CardFisica/CardFisica";
// import CartaModal from "./CartaModal";

// const MisCartas = () => {
//   const { username } = useAuth();

//   const [cartas, setCartas] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [openModal, setOpenModal] = useState(false);
//   const [editingCarta, setEditingCarta] = useState(null);

//   const loadCartas = async () => {
//     try {
//       setLoading(true);
//       const [disp, nodisp] = await Promise.all([
//         getDisponiblesByUsername(username),
//         getNoDisponiblesByUsername(username),
//       ]);

//       const all = [...(disp.data || []), ...(nodisp.data || [])];
//       setCartas(all);
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (username) loadCartas();
//   }, [username]);

//   const handleDelete = async (id) => {
//     await deleteCartaFisica(id);
//     loadCartas();
//   };

//   const handleEdit = (carta) => {
//     setEditingCarta(carta);
//     setOpenModal(true);
//   };

//   const handleCreate = () => {
//     setEditingCarta(null);
//     setOpenModal(true);
//   };

//   const handleSubmit = async (data) => {
//     if (editingCarta) {
//       await updateCartaFisica(editingCarta.id, data);
//     } else {
//       await createCartaFisica(data);
//     }
//     setOpenModal(false);
//     loadCartas();
//   };

//   return (
//     <div className={styles.container}>
//       <h2>Mis cartas</h2>

//       {loading ? (
//         <div>Cargando...</div>
//       ) : (
//         <div className={styles.grid}>
//           {cartas.map((c) => (
//             <CardFisica
//               key={c.id}
//               carta={c}
//               onEdit={() => handleEdit(c)}
//               onDelete={() => handleDelete(c.id)}
//               isOwner
//             />
//           ))}
//         </div>
//       )}

//       {/* Botón flotante */}
//       <button className={styles.fab} onClick={handleCreate}>
//         +
//       </button>

//       {openModal && (
//         <CartaModal
//           carta={editingCarta}
//           onClose={() => setOpenModal(false)}
//           onSubmit={handleSubmit}
//         />
//       )}
//     </div>
//   );
// };

// export default MisCartas;