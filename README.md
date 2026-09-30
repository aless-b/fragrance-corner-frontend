# Fragrance Corner — Frontend React + Vite + Tailwind CSS

Aplicación web frontend para el catálogo de perfumería fina **Fragrance Corner**. Ofrece una interfaz elegante en paleta de colores claros tradicionales (`#FAF7F4`, `#85544D`, `#F2DDCC`, `#F1C7A7`), autenticación OAuth2 / LDAP contra Keycloak mediante Zustand, visualización del Bearer Token JWT por pantalla en consola, formulario para agregar perfumes con optimización automática de imágenes y conexión con backend Node.js / MySQL.

---

## 🚀 Tecnologías Utilizadas

- **Framework**: React 19 + Vite
- **Estilos**: Tailwind CSS v4 (Paleta personalizada: Crema, Terracota, Durazno)
- **Gestión de Estado**: Zustand (`useAuthStore`)
- **Autenticación**: OAuth2 / OpenID Connect (Keycloak LDAP Realm `cybersecurity`)
- **Iconografía**: Lucide React
- **Contenedores**: Docker + Docker Compose

---

## ✨ Características Principales

1. **Autenticación LDAP / Keycloak obligatoria**:
   - Al ingresar a `http://localhost:5173`, el usuario es redirigido al formulario de Login.
   - Autenticación contra Keycloak en `http://localhost:8081` usando el Realm `cybersecurity` (ej. usuario `alice` / contraseña `alice123`).

2. **Inspección de JWT por Pantalla**:
   - Imprime en la consola del navegador (`F12`) el Bearer Token JWT de manera limpia únicamente al navegar a cada sección (Login, Dashboard, Formulario de Alta).

3. **Dashboard e Inventario de Perfumes**:
   - Catálogo interactivo con filtros por marca, familia olfativa (categoría) y búsqueda por texto.
   - Sincronización automática con la API RESTful de MySQL (`http://localhost:3001/api/perfumes`).

4. **Formulario de Alta con Compresión Dinámica de Imágenes**:
   - Permite elegir imágenes predeterminadas o subir un archivo propio desde la computadora.
   - Procesa y redimensiona las imágenes locales mediante `<canvas>` (JPEG 800px max, calidad 0.8, ~60–150 KB) para optimizar el envío por la red, almacenamiento en MySQL `LONGTEXT` y `localStorage`.

5. **Empaquetado en Docker**:
   - Servido a través de Docker en el puerto `5173`.

---

## 🛠️ Requisitos Previos

- **Docker y Docker Compose** (Recomendado)
- O en su defecto **Node.js v20+** y **npm**

---

## 📦 Ejecución con Docker Compose (Recomendado)

Desde la carpeta raíz del frontend (`perfume-dashboard`):

```bash
# Construir y levantar el contenedor en segundo plano
docker-compose up -d --build
```

La aplicación estará disponible en: **`http://localhost:5173`**

---

## 💻 Ejecución Local sin Docker

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo Vite
npm run dev
```

---

## 📁 Estructura del Proyecto

```text
perfume-dashboard/
├── src/
│   ├── components/
│   │   ├── AddProductForm.jsx   # Formulario de alta de perfumes con compresión canvas
│   │   ├── DashboardOverview.jsx# Dashboard principal y listado de productos
│   │   ├── Login.jsx            # Pantalla de inicio de sesión LDAP / Keycloak
│   │   ├── Navbar.jsx           # Barra de navegación superior
│   │   └── ProductCard.jsx      # Tarjeta individual de fragancia
│   ├── context/
│   │   └── PerfumeContext.jsx   # Estado global del catálogo y tostadas de notificación
│   ├── data/
│   │   └── initialPerfumes.js   # Catálogo semilla inicial de respaldo
│   ├── store/
│   │   └── useAuthStore.js      # Store Zustand para sesión, JWT y comunicación Keycloak
│   ├── App.jsx                  # Componente principal con enrutamiento por pestañas
│   ├── index.css                # Estilos globales y paleta de colores Tailwind
│   └── main.jsx                 # Punto de entrada de React
├── Dockerfile                   # Configuración de imagen Docker (Node 20 Alpine)
├── docker-compose.yml           # Orquestación de contenedor en puerto 5173
├── vite.config.js               # Proxy para Keycloak (:8081) y Backend API (:3001)
└── package.json
```
