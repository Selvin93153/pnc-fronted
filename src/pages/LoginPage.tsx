// src/pages/LoginPage.tsx
import { Container } from '@mui/material';
import LoginForm from '../components/LoginForm';

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
