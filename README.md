# TCG Exchange Frontend

## Descripción
Este repositorio contiene el **frontend** de la aplicación TCG Exchange.

Proporciona la interfaz de usuario para interactuar con el sistema, permitiendo gestionar cuentas, visualizar cartas y realizar intercambios de forma intuitiva.

👉 Para la documentación completa del sistema (modelo de datos, lógica de negocio, seguridad, endpoints, etc.), consultar el backend:  
https://github.com/legolegolegolego/TCG_Exchange

---

## Responsabilidades del Frontend

El frontend se encarga de:

- Renderizar la interfaz de usuario.
- Gestionar la navegación entre vistas.
- Manejar el estado del cliente.
- Consumir la API REST del backend.
- Gestionar la autenticación en cliente mediante JWT.
- Mostrar estados de carga y errores.

---

## Funcionalidades

- Registro e inicio de sesión.
- Verificación de email.
- Recuperación de contraseña.
- Visualización del catálogo de cartas.
- Gestión de cartas físicas.
- Visualización de perfiles de usuario.
- Creación de intercambios.
- Gestión de intercambios (aceptar/rechazar).
- Edición de perfil y dirección.

---

## Arquitectura

Estructura basada en componentes:

```
src/
├── assets/         # Recursos estáticos
├── components/     # Componentes reutilizables
├── context/        # Estado global de autenticación
├── pages/          # Vistas principales
├── services/       # Llamadas a la API
└── utils/          # Utilidades
```

---

## Autenticación en cliente

- Uso de JWT proporcionado por el backend.
- Almacenamiento del token en cliente.
- Inclusión en peticiones HTTP.
- Authorization: Bearer <token\>.
- Protección de rutas privadas desde el frontend.

---

## Comunicación con la API

- Interacción mediante peticiones HTTP al backend.
- URL base configurable mediante variables de entorno.
- Manejo de errores basado en códigos HTTP.

---

## Tecnologías utilizadas

- **React (JavaScript)**
- **Bootstrap**
- **Axios / Fetch API**

---

## Notas

- Toda la lógica de negocio reside en el backend.
- El frontend actúa exclusivamente como cliente.
- La seguridad crítica se gestiona en el servidor.

---

## Licencia

Proyecto académico con fines educativos.