// src/views/SupportView.tsx
import { Box, Typography, Paper, Button, Link } from '@mui/material';
import { HelpOutline, Description, Email } from '@mui/icons-material';

export default function SupportView() {
  return (
    <Box
      sx={{
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'linear-gradient(120deg, #fdfbfb, #ebedee)',
        minHeight: '100vh',
      }}
    >
      <Typography variant="h3" fontWeight="bold" color="#1976d2" mb={2} textAlign="center">
        Soporte y Ayuda
      </Typography>
      <Typography variant="subtitle1" color="#555" mb={4} textAlign="center" maxWidth={600}>
        Aquí encontrarás recursos y contacto para resolver cualquier duda o problema que tengas con nuestro sistema.
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 3,
          width: '100%',
          maxWidth: 1100,
        }}
      >
        {/* Manual de usuario */}
        <Paper
          elevation={8}
          sx={{
            flex: '1 1 300px',
            maxWidth: 320,
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 3,
            backgroundColor: '#e3f2fd',
            textAlign: 'center',
          }}
        >
          <Description sx={{ fontSize: 50, color: '#1976d2', mb: 1 }} />
          <Typography variant="h6" mb={1}>
            Manual de Usuario
          </Typography>
          <Typography variant="body2" color="#555" mb={2}>
            Descarga y revisa el manual completo para aprender a usar todas las funcionalidades.
          </Typography>
          <Link href="/manual-usuario.pdf" target="_blank" underline="none">
            <Button variant="contained" color="primary">
              Abrir Manual
            </Button>
          </Link>
        </Paper>

        {/* Correo de soporte */}
        <Paper
          elevation={8}
          sx={{
            flex: '1 1 300px',
            maxWidth: 320,
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 3,
            backgroundColor: '#fff3e0',
            textAlign: 'center',
          }}
        >
          <Email sx={{ fontSize: 50, color: '#fb8c00', mb: 1 }} />
          <Typography variant="h6" mb={1}>
            Contacto de Soporte
          </Typography>
          <Typography variant="body2" color="#555" mb={2}>
            Si tienes problemas técnicos o preguntas, contáctanos directamente por correo.
          </Typography>
          <Link href="pnc.soporte@gmail.com" underline="none">
            <Button variant="contained" color="warning">
              Enviar correo
            </Button>
          </Link>
        </Paper>

        {/* Preguntas frecuentes */}
        <Paper
          elevation={8}
          sx={{
            flex: '1 1 300px',
            maxWidth: 320,
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 3,
            backgroundColor: '#e8f5e9',
            textAlign: 'center',
          }}
        >
          <HelpOutline sx={{ fontSize: 50, color: '#43a047', mb: 1 }} />
          <Typography variant="h6" mb={1}>
            Preguntas Frecuentes
          </Typography>
          <Typography variant="body2" color="#555" mb={2}>
            Consulta las dudas más comunes y cómo resolverlas rápidamente.
          </Typography>
          <Button variant="contained" color="success">
            Ver FAQ
          </Button>
        </Paper>
      </Box>

      <Typography variant="caption" color="#777" textAlign="center" mt={5}>
        © 2025 PNC. Proteger y Servir.
      </Typography>
    </Box>
  );
}
