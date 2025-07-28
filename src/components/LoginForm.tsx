// src/components/LoginForm.tsx
import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  InputAdornment,
} from '@mui/material';
import { Email, Lock } from '@mui/icons-material';
import { login } from '../services/authService';

interface Props {
  onLoginSuccess: () => void;
}

export default function LoginForm({ onLoginSuccess }: Props) {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { access_token } = await login(correo, contraseña);
      localStorage.setItem('token', access_token);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={6} sx={{ p: 4, mt: 10, borderRadius: 4 }}>
      <Typography variant="h5" textAlign="center" gutterBottom color="primary">
        Iniciar Sesión
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Correo"
          type="email"
          fullWidth
          required
          margin="normal"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          required
          margin="normal"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock />
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? 'Cargando...' : 'Ingresar'}
        </Button>
      </Box>
    </Paper>
  );
}
