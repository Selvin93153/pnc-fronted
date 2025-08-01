import {
  Box,
  Typography,
  Button,
  Stack,
  Card,
  CardActionArea,
  CardContent,
} from '@mui/material';
import RolesTable from '../roles/RolesTable';
import TiposTable from '../tipos_equipos/TiposTable';
import UsuariosTable from '../usuarios/UsuariosTable';
import PeopleIcon from '@mui/icons-material/People';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DevicesIcon from '@mui/icons-material/Devices';
import { useState } from 'react';

interface Props {
  onLogout: () => void;
}

const modules = [
  {
    title: 'Roles',
    description: 'Gestiona los roles del sistema',
    icon: <AdminPanelSettingsIcon fontSize="large" color="primary" />,
    index: 0,
  },
  {
    title: 'Tipos de Equipos',
    description: 'Administra los tipos de equipos registrados',
    icon: <DevicesIcon fontSize="large" color="success" />,
    index: 1,
  },
  {
    title: 'Usuarios',
    description: 'Control de cuentas de usuarios',
    icon: <PeopleIcon fontSize="large" color="secondary" />,
    index: 2,
  },
];

export default function AppContent({ onLogout }: Props) {
  const [tabIndex, setTabIndex] = useState<number | null>(null);

  const handleModuleClick = (index: number) => {
    setTabIndex(index);
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" color="primary">
          Panel de Administración
        </Typography>
        <Button variant="outlined" color="secondary" onClick={onLogout}>
          Cerrar sesión
        </Button>
      </Stack>

      {tabIndex === null && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 4,
          }}
        >
          {modules.map((mod) => (
            <Card
              key={mod.title}
              sx={{
                borderRadius: 4,
                boxShadow: 4,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: 6,
                },
              }}
            >
              <CardActionArea onClick={() => handleModuleClick(mod.index)}>
                <CardContent sx={{ textAlign: 'center', py: 6 }}>
                  <Box mb={2}>{mod.icon}</Box>
                  <Typography variant="h6" gutterBottom>
                    {mod.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {mod.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      )}

      {tabIndex === 0 && (
        <Box mt={4}>
          <Button onClick={() => setTabIndex(null)}>&larr; Volver</Button>
          <Typography variant="h5" gutterBottom>
            Lista de Roles
          </Typography>
          <RolesTable />
        </Box>
      )}

      {tabIndex === 1 && (
        <Box mt={4}>
          <Button onClick={() => setTabIndex(null)}>&larr; Volver</Button>
          <Typography variant="h5" gutterBottom>
            Lista de Tipos de Equipos
          </Typography>
          <TiposTable />
        </Box>
      )}

      {tabIndex === 2 && (
        <Box mt={4}>
          <Button onClick={() => setTabIndex(null)}>&larr; Volver</Button>
          <Typography variant="h5" gutterBottom>
            Lista de Usuarios
          </Typography>
          <UsuariosTable />
        </Box>
      )}
    </Box>
  );
}
