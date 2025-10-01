import { Box, keyframes } from '@mui/material';
import LoginForm from './LoginForm';

interface Props {
  onLoginSuccess: () => void;
}

const bgAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export default function LoginPage({ onLoginSuccess }: Props) {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #53c3f0ff, #06765cff, #80a6ecff, #06765cff)',
        backgroundSize: '400% 400%',
        animation: `${bgAnimation} 20s ease infinite`,
      }}
    >
      <LoginForm onLoginSuccess={onLoginSuccess} />
    </Box>
  );
}