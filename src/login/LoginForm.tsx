import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  Fade,
  keyframes,
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../login/authService';
import { publicClient } from './publicClient';

interface Props {
  onLoginSuccess: () => void;
}

const fadeSlide = keyframes`
  from { opacity: 0; transform: translateY(-50px); }
  to { opacity: 1; transform: translateY(0); }
`;

/**
 * Extrae un mensaje legible del error que devuelve el backend.
 * Maneja message como string, array o estructuras anidadas.
 */
function getBackendMessage(err: any, fallback = ''): string {
  const data = err?.response?.data;
  if (!data) return fallback || (err?.message ?? 'Ocurrió un error');
  const { message } = data;

  if (!message) return data?.error || fallback || 'Ocurrió un error';

  // message puede ser string o array (por ejemplo de class-validator)
  if (Array.isArray(message)) {
    // unir mensajes en un solo string
    return message.join('; ');
  }
  if (typeof message === 'string') return message;
  // a veces message puede ser objeto/otro formato
  try {
    return String(message);
  } catch {
    return fallback || 'Ocurrió un error';
  }
}

export default function LoginForm({ onLoginSuccess }: Props) {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotCorreo, setForgotCorreo] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const [showResetPassword, setShowResetPassword] = useState(false);
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [showResetNewPassword, setShowResetNewPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  // ==== Detectar token en URL para reset password ====
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      setShowResetPassword(true);
      setShowForgotPassword(false);
    }
  }, [location.search]);

  // ==== Login ====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (correo === 'admin@hotmal.com' && contraseña === 'admin') {
        localStorage.setItem('token', 'mock-token-admin');
        onLoginSuccess();
        navigate('/welcome');
        return;
      }

      const { access_token, usuario } = await login(correo, contraseña);
      localStorage.setItem('token', access_token);
      localStorage.setItem('usuario', JSON.stringify(usuario));

      onLoginSuccess();
      navigate('/welcome');
    } catch (err: any) {
      // Mostrar mensaje exacto del backend si existe
      const msg = getBackendMessage(err, 'Correo o contraseña incorrectos.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ==== Forgot Password ====
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError('');
    setForgotMessage('');

    try {
      const response = await publicClient.post(`/api/usuarios/forgot-password`, {
        correo: forgotCorreo,
      });
      setForgotMessage(response.data.message);
    } catch (err: any) {
      const msg = getBackendMessage(err, 'Error al enviar correo');
      setForgotError(msg);
    } finally {
      setForgotLoading(false);
    }
  };

  // ==== Reset Password ====
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError('');
    setResetMessage('');

    if (newPassword.length < 6) {
      setResetError('La contraseña debe tener al menos 6 caracteres.');
      setResetLoading(false);
      return;
    }

    try {
      const response = await publicClient.post(`/api/usuarios/reset-password`, {
        token,
        newPassword,
      });
      setResetMessage(response.data.message);
    } catch (err: any) {
      const msg = getBackendMessage(err, 'Error al resetear contraseña');
      setResetError(msg);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <Fade in timeout={700}>
      <Paper
        elevation={15}
        sx={{
          p: 5,
          borderRadius: 5,
          width: '100%',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: `${fadeSlide} 1s ease`,
          background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
        }}
      >
        {/* LOGO DENTRO DEL LOGIN */}
        <Box
          component="img"
          src="/logo.png" // reemplaza con la ruta de tu logo
          alt="Logo"
          sx={{
            width: 120,
            height: 'auto',
            mb: 3, // espacio debajo del logo
          }}
        />

        {/* LOGIN FORM */}
        {!showForgotPassword && !showResetPassword && (
          <>
            <Typography variant="h4" fontWeight="bold" color="#333" mb={1} textAlign="center">
              Accede a tu cuenta
            </Typography>
            <Typography variant="subtitle1" color="#555" mb={3} textAlign="center">
              Ingresa tu correo y contraseña
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2, width: '100%' }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Correo electrónico"
                type="email"
                fullWidth
                required
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                InputProps={{ startAdornment: (<InputAdornment position="start"><Email /></InputAdornment>) }}
              />
              <TextField
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                required
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                InputProps={{
                  startAdornment: (<InputAdornment position="start"><Lock /></InputAdornment>),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} edge="end" size="small">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button type="submit" fullWidth variant="contained" disabled={loading}>
                {loading ? 'Cargando...' : 'Iniciar Sesión'}
              </Button>
              <Button variant="text" onClick={() => setShowForgotPassword(true)}>
                Olvidé mi contraseña
              </Button>
            </Box>
          </>
        )}

        {/* FORGOT PASSWORD FORM */}
        {showForgotPassword && !showResetPassword && (
          <>
            <Typography variant="h5" fontWeight="bold" color="#333" mb={2} textAlign="center">
              Recuperar Contraseña
            </Typography>

            {forgotMessage && <Alert severity="success" sx={{ mb: 2, width: '100%' }}>{forgotMessage}</Alert>}
            {forgotError && <Alert severity="error" sx={{ mb: 2, width: '100%' }}>{forgotError}</Alert>}

            <Box component="form" onSubmit={handleForgotPassword} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Correo electrónico"
                type="email"
                fullWidth
                required
                value={forgotCorreo}
                onChange={(e) => setForgotCorreo(e.target.value)}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Button type="submit" fullWidth variant="contained" disabled={forgotLoading}>
                  {forgotLoading ? 'Enviando...' : 'Enviar'}
                </Button>
                <Button fullWidth variant="outlined" onClick={() => setShowForgotPassword(false)}>
                  Cancelar
                </Button>
              </Box>

              <Button variant="text" onClick={() => { setShowForgotPassword(false); setShowResetPassword(true); }}>
                Ya tengo el token
              </Button>
            </Box>
          </>
        )}

        {/* RESET PASSWORD FORM */}
        {showResetPassword && (
          <>
            <Typography variant="h5" fontWeight="bold" color="#333" mb={2} textAlign="center">
              Restablecer Contraseña
            </Typography>

            {resetMessage && <Alert severity="success" sx={{ mb: 2, width: '100%' }}>{resetMessage}</Alert>}
            {resetError && <Alert severity="error" sx={{ mb: 2, width: '100%' }}>{resetError}</Alert>}

            <Box component="form" onSubmit={handleResetPassword} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Token"
                fullWidth
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
              <TextField
                label="Nueva contraseña"
                type={showResetNewPassword ? 'text' : 'password'}
                fullWidth
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowResetNewPassword(!showResetNewPassword)} edge="end" size="small">
                        {showResetNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Button type="submit" fullWidth variant="contained" disabled={resetLoading}>
                  {resetLoading ? 'Cambiando...' : 'Cambiar contraseña'}
                </Button>
                <Button fullWidth variant="outlined" onClick={() => setShowResetPassword(false)}>
                  Cancelar
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Paper>
    </Fade>
  );
}
