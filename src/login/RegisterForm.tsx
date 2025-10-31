// src/login/RegisterForm.tsx
import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Paper,
  Fade,
} from '@mui/material';
import { Email, Lock, Person, Badge, Visibility, VisibilityOff } from '@mui/icons-material';
import { registerUser, type RegisterUserData } from '../login/registerService';

interface Props {
  onCancel: () => void;
  onSuccess?: () => void;
}

function getBackendMessage(err: any, fallback = ''): string {
  const data = err?.response?.data;
  if (!data) return fallback || (err?.message ?? 'Ocurrió un error');
  const { message } = data;
  if (!message) return data?.error || fallback || 'Ocurrió un error';
  if (Array.isArray(message)) return message.join('; ');
  if (typeof message === 'string') return message;
  try {
    return String(message);
  } catch {
    return fallback || 'Ocurrió un error';
  }
}

export default function RegisterForm({ onCancel, onSuccess }: Props) {
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [nip, setNip] = useState('');
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // id_rol se enviará fijo
  const id_rol = 3;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (contraseña !== confirmarContraseña) {
      setError('Las contraseñas no coinciden. Verifica e inténtalo de nuevo.');
      return;
    }

    setLoading(true);

    try {
      const data: RegisterUserData = {
        nombres,
        apellidos,
        nip,
        correo,
        contraseña,
        id_rol,
      };

      const response = await registerUser(data);
      setSuccess(response.message || 'Usuario registrado correctamente.');
      setTimeout(() => {
        onSuccess?.();
        onCancel();
      }, 1500);
    } catch (err: any) {
      const msg = getBackendMessage(err, 'Error al registrar usuario.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fade in timeout={600}>
      <Paper
        elevation={15}
        sx={{
          p: 4,
          borderRadius: 5,
          width: '90%',
          maxWidth: 500,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
        }}
      >
        <Typography variant="h4" fontWeight="bold" color="#333" mb={2} textAlign="center">
          Crear cuenta nueva
        </Typography>
        <Typography variant="subtitle1" color="#555" mb={3} textAlign="center">
          Completa los datos para registrarte
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2, width: '100%' }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2, width: '100%' }}>{success}</Alert>}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          {/* Nombres y Apellidos en la misma fila */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Nombres"
              fullWidth
              required
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
              InputProps={{ startAdornment: (<InputAdornment position="start"><Person /></InputAdornment>) }}
            />
            <TextField
              label="Apellidos"
              fullWidth
              required
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              InputProps={{ startAdornment: (<InputAdornment position="start"><Person /></InputAdornment>) }}
            />
          </Box>

          <TextField
            label="NIP"
            fullWidth
            required
            value={nip}
            onChange={(e) => setNip(e.target.value)}
            InputProps={{ startAdornment: (<InputAdornment position="start"><Badge /></InputAdornment>) }}
          />

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
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Confirmar contraseña"
            type={showConfirmPassword ? 'text' : 'password'}
            fullWidth
            required
            value={confirmarContraseña}
            onChange={(e) => setConfirmarContraseña(e.target.value)}
            error={!!confirmarContraseña && contraseña !== confirmarContraseña}
            helperText={confirmarContraseña && contraseña !== confirmarContraseña ? 'Las contraseñas no coinciden' : ''}
            InputProps={{
              startAdornment: (<InputAdornment position="start"><Lock /></InputAdornment>),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" size="small">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button type="submit" fullWidth variant="contained" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </Button>

          <Button fullWidth variant="text" onClick={onCancel}>
            Volver al login
          </Button>
        </Box>
      </Paper>
    </Fade>
  );
}
