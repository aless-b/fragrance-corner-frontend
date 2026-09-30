# Fragrance Corner — React + Vite + Tailwind CSS Frontend

A modern web frontend application for the **Fragrance Corner** fine perfumery catalog. Features an elegant UI designed with a classic light color palette (`#FAF7F4`, `#85544D`, `#F2DDCC`, `#F1C7A7`), OAuth2 / LDAP authentication via Keycloak using Zustand, clean browser console JWT Bearer Token inspection upon screen navigation, automated image upload optimization, and full integration with a Node.js / MySQL backend.

---

## 🚀 Technologies Used

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 (Custom Palette: Cream, Terracotta, Peach)
- **State Management**: Zustand (`useAuthStore`)
- **Authentication**: OAuth2 / OpenID Connect (Keycloak LDAP Realm `cybersecurity`)
- **Icons**: Lucide React
- **Containerization**: Docker + Docker Compose

---

## ✨ Key Features

1. **Mandatory LDAP / Keycloak Authentication**:
   - Accessing `http://localhost:5173` immediately directs unauthenticated users to the Login view.
   - Authenticates against Keycloak running at `http://localhost:8081` using the `cybersecurity` realm (e.g., user `alice` / password `alice123`).

2. **Per-Screen JWT Inspection**:
   - Outputs a clean, single-line raw Bearer Token JWT log to the browser developer console (`F12`) whenever navigating between screens (Login, Dashboard, Add Product Form).

3. **Perfume Catalog & Dashboard**:
   - Interactive catalog grid with search filtering by name, brand, or olfactory category.
   - Real-time synchronization with the MySQL REST API (`http://localhost:3001/api/perfumes`).

4. **Add Product Form with Dynamic Canvas Compression**:
   - Upload custom local image files or select from curated presets.
   - Automatically resizes uploaded files via HTML `<canvas>` to max 800px JPEG (quality 0.8, ~60–150 KB) for optimal payload sizes across MySQL `LONGTEXT` and browser `localStorage`.

5. **Docker Integration**:
   - Fully containerized and served via Docker on port `5173`.

---

## 🛠️ Prerequisites

- **Docker & Docker Compose** (Recommended)
- Or **Node.js v20+** and **npm**

---

## 📦 Running with Docker Compose (Recommended)

From the root directory of the frontend project (`perfume-dashboard`):

```bash
# Build and start the container in background mode
docker-compose up -d --build
```

The application will be accessible at: **`http://localhost:5173`**

---

## 💻 Running Locally without Docker

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev
```

---

## 📁 Project Structure

```text
perfume-dashboard/
├── src/
│   ├── components/
│   │   ├── AddProductForm.jsx   # Product creation form with canvas compression
│   │   ├── DashboardOverview.jsx# Main dashboard overview and product catalog
│   │   ├── Login.jsx            # LDAP / Keycloak login component
│   │   ├── Navbar.jsx           # Top header navigation bar
│   │   └── ProductCard.jsx      # Individual fragrance card component
│   ├── context/
│   │   └── PerfumeContext.jsx   # Global perfume catalog context & toast notifications
│   ├── data/
│   │   └── initialPerfumes.js   # Fallback initial seed catalog
│   ├── store/
│   │   └── useAuthStore.js      # Zustand store for LDAP session, JWT, and Keycloak API
│   ├── App.jsx                  # Main root component & tab navigation
│   ├── index.css                # Global styles and Tailwind custom colors
│   └── main.jsx                 # React DOM entry point
├── Dockerfile                   # Docker image specification (Node 20 Alpine)
├── docker-compose.yml           # Docker Compose setup exposing port 5173
├── index.html                   # Vite root HTML entry point
├── vite.config.js               # Proxy configuration for Keycloak (:8081) and Backend API (:3001)
└── package.json
```
