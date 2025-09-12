// src/login/LoginPage.tsx
import { Box } from '@mui/material';
import LoginForm from './LoginForm';

interface Props {
  onLoginSuccess: () => void;
}

export default function LoginPage({ onLoginSuccess }: Props) {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0d1b2a, #1b263b, #0a1128)',
      }}
    >
      <LoginForm onLoginSuccess={onLoginSuccess} />
    </Box>
  );
}
