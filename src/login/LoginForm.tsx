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
  IconButton,
  Fade,
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { login } from '../login/authService';
import { keyframes } from '@mui/system';

interface Props {
  onLoginSuccess: () => void;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export default function LoginForm({ onLoginSuccess }: Props) {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (correo === 'admin@hotmal.com' && contraseña === 'admin') {
        localStorage.setItem('token', 'mock-token-admin');
        onLoginSuccess();
        return;
      }

     const { access_token, usuario } = await login(correo, contraseña);

// Guardar el token y el objeto del usuario en localStorage
localStorage.setItem('token', access_token);
localStorage.setItem('usuario', JSON.stringify(usuario));

onLoginSuccess();


    } catch (err: any) {
      setError('Correo o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fade in timeout={500}>
      <Paper
        elevation={8}
        sx={{
          p: 7,
          mt: 10,
          mx: 'auto',
          maxWidth: 500,
          borderRadius: 5,
          animation: `${fadeIn} 0.6s ease-in-out`,
          boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
          backgroundColor: '#fff',
        }}
      >
        <Typography
          variant="h3"
          textAlign="center"
          gutterBottom
          color="primary"
          fontWeight="bold"
          mb={2}
        >
          Bienvenido
        </Typography>

        <Typography
          variant="h6"
          textAlign="center"
          mb={4}
          color="text.secondary"
        >
          Ingresa tus credenciales para continuar
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, fontSize: '1rem' }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Correo electrónico"
            type="email"
            fullWidth
            required
            margin="normal"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
              sx: {
                backgroundColor: '#f9f9f9',
                borderRadius: 2,
              },
            }}
            sx={{
              mt: 1,
              mb: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#f9f9f9',
                borderRadius: 2,
                '& fieldset': {
                  borderColor: '#ddd',
                },
                '&:hover fieldset': {
                  borderColor: '#bbb',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1976d2',
                  boxShadow: '0 0 8px rgba(25, 118, 210, 0.3)',
                },
              },
            }}
          />

          <TextField
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            required
            margin="normal"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    onClick={handleClickShowPassword}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                backgroundColor: '#f9f9f9',
                borderRadius: 2,
              },
            }}
            sx={{
              mt: 1,
              mb: 3,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#f9f9f9',
                borderRadius: 2,
                '& fieldset': {
                  borderColor: '#ddd',
                },
                '&:hover fieldset': {
                  borderColor: '#bbb',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1976d2',
                  boxShadow: '0 0 8px rgba(25, 118, 210, 0.3)',
                },
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              py: 1.8,
              fontWeight: 'bold',
              fontSize: '1.2rem',
              backgroundColor: '#90caf9', // azul claro
              color: '#0d47a1',
              '&:hover': {
                backgroundColor: '#64b5f6',
              },
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(144, 202, 249, 0.6)',
              transition: 'all 0.3s ease',
            }}
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </Button>
        </Box>
      </Paper>
    </Fade>
  );
}
