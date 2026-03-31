import styles from "./Soporte.module.css";
import { getCurrentUser } from "../../utils/token";

function Soporte() {
  const user = getCurrentUser();
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");

  return (
    <div className="container mt-4 mb-5" style={{ maxWidth: "800px" }}>
      <h1 className="mb-4">Centro de ayuda</h1>

      {!isAdmin ? (
        <>

          <p>
            TCG Exchange es una plataforma para intercambiar cartas de Pokémon TCG entre usuarios,
            sin compra ni venta, centrada en el coleccionismo y la colaboración.
          </p>

          <h3 className="mt-5 mb-4">Preguntas frecuentes</h3>

          <div className="accordion" id="faqAccordion">

            {/* 1 */}
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingOne">
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                  ¿Qué puedo hacer en la plataforma?
                </button>
              </h2>
              <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  Puedes explorar las cartas oficiales, publicar tus propias cartas para intercambio,
                  ver cartas de otros usuarios y proponer intercambios.
                </div>
              </div>
            </div>

            {/* 2 */}
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingTwo">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
                  ¿Necesito verificar mi email?
                </button>
              </h2>
              <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  Sí. Debes verificar tu email para poder iniciar sesión y utilizar la plataforma.
                </div>
              </div>
            </div>

            {/* 3 */}
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingThree">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree">
                  ¿Cómo puedo añadir cartas?
                </button>
              </h2>
              <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  Debes tener una cuenta y una dirección registrada. Después podrás publicar cartas físicas
                  asociadas a un modelo existente.
                </div>
              </div>
            </div>

            {/* 4 */}
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingFour">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour">
                  ¿Qué significa que una carta esté disponible?
                </button>
              </h2>
              <div id="collapseFour" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  Una carta disponible puede participar en intercambios. Cuando se acepta un intercambio,
                  las cartas pasan a no estar disponibles.
                </div>
              </div>
            </div>

            {/* 5 */}
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingFive">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive">
                  ¿Puedo intercambiar una carta varias veces?
                </button>
              </h2>
              <div id="collapseFive" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  No. Una carta solo puede formar parte de un intercambio aceptado. Una vez usada,
                  deja de estar disponible.
                </div>
              </div>
            </div>

            {/* 6 */}
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingSix">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSix">
                  ¿Qué ocurre al aceptar un intercambio?
                </button>
              </h2>
              <div id="collapseSix" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  El intercambio pasa a estado aceptado, las cartas dejan de estar disponibles y se
                  comparten las direcciones para que los usuarios realicen el envío.
                </div>
              </div>
            </div>

            {/* 7 */}
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingSeven">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSeven">
                  ¿La plataforma gestiona envíos o pagos?
                </button>
              </h2>
              <div id="collapseSeven" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  No. La plataforma solo facilita el acuerdo entre usuarios. El envío de cartas se realiza
                  de forma externa entre los usuarios.
                </div>
              </div>
            </div>

            {/* 8 */}
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingEight">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEight">
                  ¿Qué pasa si rechazo un intercambio?
                </button>
              </h2>
              <div id="collapseEight" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  El intercambio pasa a estado rechazado y las cartas siguen disponibles para otros
                  intercambios.
                </div>
              </div>
            </div>

            {/* 9 */}
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingNine">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseNine">
                  ¿Puedo eliminar mi cuenta?
                </button>
              </h2>
              <div id="collapseNine" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  Sí. Si no has participado en intercambios, se eliminará completamente. Si has participado,
                  se desactivará para mantener la integridad del sistema.
                </div>
              </div>
            </div>

          </div>
        </>
      ) : (
      <>
        <p>
          Este panel está orientado a la gestión de la plataforma. Como administrador puedes supervisar
          usuarios, cartas e intercambios para garantizar el correcto funcionamiento del sistema.
        </p>

        <h3 className="mt-5 mb-4">Gestión para administradores</h3>

        <div className="accordion" id="faqAccordionAdmin">

          {/* 1 */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="adminHeadingOne">
              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#adminOne">
                ¿Qué puede hacer un administrador?
              </button>
            </h2>
            <div id="adminOne" className="accordion-collapse collapse show" data-bs-parent="#faqAccordionAdmin">
              <div className="accordion-body">
                Puede consultar usuarios, cartas modelo, cartas físicas e intercambios, además de eliminar
                recursos cuando sea necesario.
              </div>
            </div>
          </div>

          {/* 2 */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="adminHeadingTwo">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#adminTwo">
                Gestión de usuarios
              </button>
            </h2>
            <div id="adminTwo" className="accordion-collapse collapse" data-bs-parent="#faqAccordionAdmin">
              <div className="accordion-body">
                Puedes consultar cualquier usuario, actualizar username o contraseña y eliminar/desactivar cuentas.
              </div>
            </div>
          </div>

          {/* 3 */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="adminHeadingThree">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#adminThree">
                Gestión de cartas modelo
              </button>
            </h2>
            <div id="adminThree" className="accordion-collapse collapse" data-bs-parent="#faqAccordionAdmin">
              <div className="accordion-body">
                Puedes crear, modificar y eliminar cartas modelo. Si tienen cartas físicas asociadas, se desactivan en lugar de eliminarse.
              </div>
            </div>
          </div>

          {/* 4 */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="adminHeadingFour">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#adminFour">
                Gestión de cartas físicas
              </button>
            </h2>
            <div id="adminFour" className="accordion-collapse collapse" data-bs-parent="#faqAccordionAdmin">
              <div className="accordion-body">
                Puedes eliminar/desactivar cartas físicas de cualquier usuario.
              </div>
            </div>
          </div>

          {/* 5 */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="adminHeadingFive">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#adminFive">
                Gestión de intercambios
              </button>
            </h2>
            <div id="adminFive" className="accordion-collapse collapse" data-bs-parent="#faqAccordionAdmin">
              <div className="accordion-body">
                Puedes consultar cualquier intercambio del sistema y supervisar su estado.
              </div>
            </div>
          </div>

          {/* 6 */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="adminHeadingSix">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#adminSix">
                Restricciones del administrador
              </button>
            </h2>
            <div id="adminSix" className="accordion-collapse collapse" data-bs-parent="#faqAccordionAdmin">
              <div className="accordion-body">
                No puedes modificar recursos que pertenecen exclusivamente al usuario (como cartas físicas),
                solo gestionarlos o eliminarlos según las reglas del sistema.
              </div>
            </div>
          </div>

        </div>
      </>
      )}

      {/* CONTACTO */}
      <h3 className="mt-5">Contacto</h3>
      <p>
        Si tienes cualquier duda o problema, puedes escribir a:
      </p>
      <p>
        <strong>tcgexchange.automail@gmail.com</strong>
      </p>

    </div>
  );
}

export default Soporte;