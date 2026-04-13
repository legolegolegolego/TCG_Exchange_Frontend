import { useState } from "react";
import { getCurrentUser } from "../../utils/token";
import styles from "./Soporte.module.css";

function Soporte() {
  const user = getCurrentUser();
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");

  const [openId, setOpenId] = useState("1");

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const faqUser = [
    {
      id: "1",
      title: "¿Qué puedo hacer en la plataforma?",
      content:
        "Puedes explorar las cartas oficiales, publicar tus propias cartas para intercambio, ver cartas de otros usuarios y proponer intercambios.",
    },
    {
      id: "2",
      title: "¿Necesito verificar mi email?",
      content:
        "Sí. Debes verificar tu email para poder iniciar sesión y utilizar la plataforma.",
    },
    {
      id: "3",
      title: "¿Cómo puedo añadir cartas?",
      content:
        "Debes tener una cuenta y una dirección registrada. Después podrás publicar cartas físicas asociadas a un modelo existente.",
    },
    {
      id: "4",
      title: "¿Qué significa que una carta esté disponible?",
      content:
        "Una carta disponible puede participar en intercambios. Cuando se acepta un intercambio, las cartas pasan a no estar disponibles.",
    },
    {
      id: "5",
      title: "¿Puedo intercambiar una carta varias veces?",
      content:
        "No. Una carta solo puede formar parte de un intercambio aceptado. Una vez usada, deja de estar disponible.",
    },
    {
      id: "6",
      title: "¿Qué ocurre al aceptar un intercambio?",
      content:
        "El intercambio pasa a estado aceptado, las cartas dejan de estar disponibles y se comparten las direcciones para el envío.",
    },
    {
      id: "7",
      title: "¿La plataforma gestiona envíos o pagos?",
      content:
        "No. La plataforma solo facilita el acuerdo entre usuarios. El envío se realiza de forma externa entre los usuarios.",
    },
    {
      id: "8",
      title: "¿Qué pasa si rechazo un intercambio?",
      content:
        "El intercambio pasa a estado rechazado y las cartas siguen disponibles para otros intercambios.",
    },
    {
      id: "9",
      title: "¿Puedo eliminar mi cuenta?",
      content:
        "Sí. Si no has participado en intercambios se elimina completamente. Si has participado, se desactiva.",
    },
  ];

  const faqAdmin = [
    {
      id: "1",
      title: "¿Qué puede hacer un administrador?",
      content:
        "Puede consultar usuarios, cartas modelo (y añadirlas), cartas físicas e intercambios, además de eliminar recursos cuando sea necesario.",
    },
    {
      id: "2",
      title: "Gestión de usuarios",
      content:
        "Puedes consultar usuarios, actualizar username o contraseña y eliminar/desactivar cuentas.",
    },
    {
      id: "3",
      title: "Gestión de cartas modelo",
      content:
        "Puedes crear, modificar y eliminar cartas modelo. Si tienen cartas físicas asociadas: se desactivan en lugar de eliminarse.",
    },
    {
      id: "4",
      title: "Gestión de cartas físicas",
      content:
        "Puedes eliminar o desactivar cartas físicas de cualquier usuario.",
    },
    {
      id: "5",
      title: "Gestión de intercambios",
      content:
        "Puedes consultar cualquier intercambio del sistema y supervisar su estado.",
    },
    {
      id: "6",
      title: "Restricciones del administrador",
      content:
        "No puedes modificar recursos que pertenecen exclusivamente al usuario (como cartas físicas), solo gestionarlos o eliminarlos según las reglas del sistema.",
    },
  ];

  const items = isAdmin ? faqAdmin : faqUser;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Centro de ayuda</h1>

      {!isAdmin ? (
        <p>
          TCG Exchange es una plataforma para intercambiar cartas de Pokémon TCG entre usuarios,
          sin compra ni venta, centrada en el coleccionismo y la colaboración.
        </p>
      ) : (
        <p>
          Panel de administración para supervisar usuarios, cartas e intercambios.
        </p>
      )}

      <h3 className={styles.subtitle}>
        {isAdmin ? "Gestión para administradores" : "Preguntas frecuentes"}
      </h3>

      <div className={styles.accordion}>
        {items.map((item) => {
          const isOpen = openId === item.id;

          return (
            <div key={item.id} className={styles.item}>
              <button
                className={`${styles.button} ${isOpen ? styles.active : ""}`}
                onClick={() => toggle(item.id)}
              >
                {item.title}
                <span className={styles.icon}>{isOpen ? "−" : "+"}</span>
              </button>

              <div
                className={`${styles.content} ${isOpen ? styles.open : ""}`}
              >
                <div className={styles.body}>{item.content}</div>
              </div>
            </div>
          );
        })}
      </div>

      <h3 className={styles.subtitle}>Contacto</h3>
      <p>
        Si tienes cualquier duda o problema:
      </p>
      <p>
        <strong>tcgexchange.automail@gmail.com</strong>
      </p>
    </div>
  );
}

export default Soporte;