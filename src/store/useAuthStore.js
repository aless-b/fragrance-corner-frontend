import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'fragrance_corner_jwt_token';

// Función para decodificar JWT
const parseAndLogJwt = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (e) {
    console.error('Error al decodificar JWT:', e);
    return null;
  }
};

export const useAuthStore = create((set, get) => ({
  token: null,
  user: null,
  isAuthenticated: false, // Siempre requiere iniciar sesión al ingresar a http://localhost:5173
  isLoading: false,
  error: null,

  // Acción de inicio de sesión
  login: async (username, password) => {
    set({ isLoading: true, error: null });

    const directUrl = 'http://localhost:8081/realms/cybersecurity/protocol/openid-connect/token';
    const proxiedUrl = '/keycloak-api/realms/cybersecurity/protocol/openid-connect/token';

    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('client_id', 'fastapi-api');
    params.append('username', username);
    params.append('password', password);
    params.append('scope', 'openid');

    let response = null;

    try {
      try {
        response = await fetch(directUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params.toString()
        });
      } catch (errDirect) {
        console.warn('Fallo en URL directa, probando endpoint proxied:', errDirect);
        response = await fetch(proxiedUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params.toString()
        });
      }

      if (!response || !response.ok) {
        const errorData = response ? await response.json().catch(() => ({})) : {};
        throw new Error(errorData.error_description || errorData.error || 'Credenciales LDAP incorrectas o error de autenticación');
      }

      const data = await response.json();
      const jwtToken = data.access_token;

      if (!jwtToken) {
        throw new Error('El servidor Keycloak no retornó un access_token JWT válido.');
      }

      // Loguear e inyectar el JWT en Zustand
      const decodedUser = parseAndLogJwt(jwtToken, 'Login LDAP / Keycloak Exitoso');
      const userProfile = {
        name: decodedUser?.name || decodedUser?.preferred_username || username,
        username: decodedUser?.preferred_username || username,
        email: decodedUser?.email || `${username}@example.com`,
        role: 'Usuario Autenticado (LDAP)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        rawPayload: decodedUser
      };

      localStorage.setItem(TOKEN_KEY, jwtToken);

      set({
        token: jwtToken,
        user: userProfile,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });

      return { success: true, token: jwtToken };
    } catch (err) {
      console.error('Error en conexión LDAP / Keycloak:', err.message);
      set({ isLoading: false, error: err.message });
      return { success: false, error: err.message };
    }
  },

  setJwtToken: (jwtToken) => {
    const decodedUser = parseAndLogJwt(jwtToken, 'Inyección Manual JWT');
    if (!decodedUser) {
      set({ error: 'Token JWT inválido.' });
      return false;
    }

    const userProfile = {
      name: decodedUser.name || decodedUser.preferred_username || 'Usuario JWT',
      username: decodedUser.preferred_username || 'jwt_user',
      email: decodedUser.email || 'user@example.com',
      role: 'Usuario Autenticado (JWT)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      rawPayload: decodedUser
    };

    localStorage.setItem(TOKEN_KEY, jwtToken);

    set({
      token: jwtToken,
      user: userProfile,
      isAuthenticated: true,
      error: null
    });
    return true;
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      error: null
    });
  },

  clearError: () => set({ error: null })
}));
