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
  keyframes,
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { login } from '../login/authService';

interface Props {
  onLoginSuccess: () => void;
}

const fadeSlide = keyframes`
  from { opacity: 0; transform: translateY(-50px); }
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
        <Typography
          variant="h4"
          fontWeight="bold"
          color="#333"
          mb={1}
          textAlign="center"
          sx={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Accede a tu cuenta
        </Typography>
        <Typography
          variant="subtitle1"
          color="#555"
          mb={3}
          textAlign="center"
        >
          Ingresa tu correo y contraseña
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
        >
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
                  <Email sx={{ color: '#04a4e8ff' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: '#fff8f5',
                '& fieldset': { borderColor: '#0e32e4ff' },
                '&:hover fieldset': { borderColor: '#382ce5ff' },
                '&.Mui-focused fieldset': { borderColor: '#2522e9ff', boxShadow: '0 0 10px rgba(255,126,95,0.5)' },
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
                  <Lock sx={{ color: '#04a4e8ff' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    edge="end"
                    size="small"
                    sx={{ color: '#1276bcff' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: '#fff8f5',
                '& fieldset': { borderColor: '#0f16e4ff' },
                '&:hover fieldset': { borderColor: '#3817e0ff' },
                '&.Mui-focused fieldset': { borderColor: '#4024bdff', boxShadow: '0 0 10px rgba(255,126,95,0.5)' },
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
              background: 'linear-gradient(90deg, #e1af45ff, #f9cd0bff)',
              boxShadow: '0 6px 15px rgba(255,126,95,0.5)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(90deg, #82e163ff, #19e10bff)',
                transform: 'translateY(-2px) scale(1.02)',
                boxShadow: '0 10px 25px rgba(255,126,95,0.7)',
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
