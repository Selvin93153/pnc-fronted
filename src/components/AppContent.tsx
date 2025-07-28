// src/components/AppContent.tsx
import { useState } from 'react';
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Paper,
  Button,
  Stack,
} from '@mui/material';
import RolesTable from '../roles/RolesTable';
import TiposTable from '../tipos_equipos/TiposTable';

interface Props {
  onLogout: () => void;
}

export default function AppContent({ onLogout }: Props) {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" color="primary">
          Panel de Administración
        </Typography>
        <Button variant="outlined" color="secondary" onClick={onLogout}>
          Cerrar sesión
        </Button>
      </Stack>

      <Paper elevation={3} sx={{ borderRadius: 2 }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          centered
        >
          <Tab label="Roles" />
          <Tab label="Tipos de Equipos" />
        </Tabs>
      </Paper>

      <Box sx={{ mt: 4 }}>
        {tabIndex === 0 && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Lista de Roles
            </Typography>
            <RolesTable />
          </Box>
        )}

        {tabIndex === 1 && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Lista de Tipos de Equipos
            </Typography>
            <TiposTable />
          </Box>
        )}
      </Box>
    </Box>
  );
}
