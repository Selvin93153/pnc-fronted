// src/login/LoginPage.tsx
import { Container } from '@mui/material';
import LoginForm from '../login/LoginForm';

interface Props {
  onLoginSuccess: () => void;
}

export default function LoginPage({ onLoginSuccess }: Props) {
  return (
    <Container maxWidth="sm">
      <LoginForm onLoginSuccess={onLoginSuccess} />
    </Container>
  );
}