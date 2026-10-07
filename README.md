# Fragrance Corner — React + Vite + Tailwind CSS Frontend (Protected with Fail2Ban)

A modern web frontend application for the **Fragrance Corner** fine perfumery catalog. Features an elegant UI designed with a classic light color palette (`#FAF7F4`, `#85544D`, `#F2DDCC`, `#F1C7A7`), OAuth2 / LDAP authentication via Keycloak using Zustand, automated image upload optimization, and **Fail2Ban HTTP flood protection** via Nginx and `iptables`.

---

## 🚀 Technologies Used

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 (Custom Palette: Cream, Terracotta, Peach)
- **State Management**: Zustand (`useAuthStore`)
- **Authentication**: OAuth2 / OpenID Connect (Keycloak LDAP Realm `cybersecurity`)
- **Security & Rate Limiting**: Nginx + Fail2Ban (`http-flood` jail) + `iptables`
- **Containerization**: Docker + Docker Compose (`NET_ADMIN` & `NET_RAW` capabilities)

---

## 🛡️ Fail2Ban HTTP Protection

Inside the Docker container (`perfume-react-frontend`), **Nginx** listens on ports `80` and `5173`, logging all incoming HTTP requests in `combined` format to `/var/log/nginx/access.log` and proxying traffic to the internal Vite server (`127.0.0.1:5174`).

- **Jail**: `[http-flood]` defined in `jail.local`
- **Filter**: `filter-http-flood.conf` matching all HTTP methods (`GET`, `POST`, etc.)
- **Threshold**: `maxretry = 60` within `findtime = 10s`
- **Ban Action**: `iptables-allports` (`bantime = 10m`, escalating up to `1d`)

### Verify Fail2Ban Status:
```bash
docker exec perfume-react-frontend fail2ban-client status http-flood
docker exec perfume-react-frontend iptables -S | grep -i f2b
```

---

## ✨ Key Features

1. **Mandatory LDAP / Keycloak Authentication**:
   - Accessing `http://localhost:5173` immediately directs unauthenticated users to the Login view.
   - Authenticates against Keycloak running at `http://localhost:8081` using the `cybersecurity` realm (e.g., user `alice` / password `alice123`).

2. **Perfume Catalog & Dashboard**:
   - Interactive catalog grid with search filtering by name, brand, or olfactory category.
   - Real-time synchronization with the MySQL REST API (`http://localhost:3001/api/perfumes`).

3. **Add Product Form with Dynamic Canvas Compression**:
   - Upload custom local image files or select from curated presets.
   - Automatically resizes uploaded files via HTML `<canvas>` to max 800px JPEG (quality 0.8, ~60–150 KB) for optimal payload sizes across MySQL `LONGTEXT` and browser `localStorage`.

---

## 📦 Running with Docker Compose

```bash
docker compose up -d --build
```

The application will be accessible at: **`http://localhost:5173`**

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
├── Dockerfile                   # Docker image with Node 20, Nginx, Fail2Ban & iptables
├── docker-compose.yml           # Compose configuration with NET_ADMIN & NET_RAW
├── entrypoint.sh                # Starts Vite, Nginx, and Fail2Ban
├── filter-http-flood.conf       # Fail2Ban filter for HTTP flood detection
├── jail.local                   # Fail2Ban jail configuration
├── nginx.conf                   # Nginx reverse proxy & access log configuration
├── index.html                   # Vite root HTML entry point
├── vite.config.js               # Proxy configuration for Keycloak (:8081) and Backend API (:3001)
└── package.json
```
