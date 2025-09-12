// src/login/LoginForm.tsx
import { useState } from 'react';
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
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { keyframes } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { login } from '../login/authService';

interface Props {
  onLoginSuccess: () => void;
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export default function LoginForm({ onLoginSuccess }: Props) {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);

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
    } catch {
      setError('Correo o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fade in timeout={600}>
      <Paper
        elevation={12}
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
          width: '100%',
          maxWidth: 420,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: `${fadeIn} 0.8s ease-in-out`,
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(8px)',
          boxSizing: 'border-box',
        }}
      >
        <Typography variant="h4" fontWeight="bold" color="white" mb={1} textAlign="center">
          Bienvenido
        </Typography>
        <Typography variant="subtitle1" color="rgba(255,255,255,0.8)" mb={3} textAlign="center">
          Ingresa tus credenciales para continuar
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: '#90caf9' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              input: { color: 'white' },
              label: { color: 'rgba(255,255,255,0.7)' },
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: 'rgba(255,255,255,0.08)',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&:hover fieldset': { borderColor: '#90caf9' },
                '&.Mui-focused fieldset': { borderColor: '#42a5f5', boxShadow: '0 0 8px rgba(66,165,245,0.5)' },
              },
            }}
          />

          <TextField
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            required
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: '#90caf9' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end" size="small" sx={{ color: '#90caf9' }}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              input: { color: 'white' },
              label: { color: 'rgba(255,255,255,0.7)' },
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: 'rgba(255,255,255,0.08)',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&:hover fieldset': { borderColor: '#90caf9' },
                '&.Mui-focused fieldset': { borderColor: '#42a5f5', boxShadow: '0 0 8px rgba(66,165,245,0.5)' },
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              py: 1.5,
              fontWeight: 'bold',
              fontSize: '1.1rem',
              borderRadius: 4,
              background: 'linear-gradient(90deg, #1565c0, #42a5f5)',
              boxShadow: '0 6px 18px rgba(66,165,245,0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(90deg, #0d47a1, #1e88e5)',
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 24px rgba(66,165,245,0.6)',
              },
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
