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
import ReportesTable from '../reportes/ReportesTable';
import PeopleIcon from '@mui/icons-material/People';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DevicesIcon from '@mui/icons-material/Devices';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BuildIcon from '@mui/icons-material/Build';
import ChecklistIcon from '@mui/icons-material/Checklist';
import SummarizeIcon from '@mui/icons-material/Summarize';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';


import { useState } from 'react';
import AsignadosTable from '../asignados/AsignadosTable';
import PrestamosTable from '../prestamos/prestamostable';
import MovimientosTable from '../movimientos/movimientosTable';


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
  {
  title: 'Reportes',
  description: 'Visualización de reportes del sistema',
  icon: <SummarizeIcon fontSize="large" color="primary" />,
  index: 3,
},
   {
    title: 'Vehiculos',
    description: 'Control de vehiculos',
    icon: <DirectionsCarIcon fontSize="large" color="info" />,
    index: 4,
  },
  {
    title: 'Mantenimiento',
    description: 'Control de vehiculos',
    icon: <BuildIcon fontSize="large" color="warning" />,
    index: 5,
  },
  {
  title: 'Equipos Asignados',
  description: 'Gestión de armas, chalecos y radios',
  icon: <ChecklistIcon fontSize="large" color="success" />,
  index: 6,
},
 {
  title: 'Equipos a Prestamo',
  description: 'Total de armas, chalecos y radios disponibles',
  icon: <AssignmentReturnIcon fontSize="large" color="success" />,
  index: 7,
},
 {
  title: 'Movimientos de Equipos',
  description: 'Registro de Ingreso y egreso de equipos',
  icon: <AssignmentReturnIcon fontSize="large" color="success" />,
  index: 8,
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
      gridTemplateColumns: {
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
        lg: 'repeat(4, 1fr)',
      },
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

        {tabIndex === 3 && (
        <Box mt={4}>
          <Button onClick={() => setTabIndex(null)}>&larr; Volver</Button>
          <Typography variant="h5" gutterBottom>
            Lista de Reportes
          </Typography>
          <ReportesTable />
        </Box>
      )}

       {tabIndex === 6 && (
        <Box mt={4}>
          <Button onClick={() => setTabIndex(null)}>&larr; Volver</Button>
          <Typography variant="h5" gutterBottom>
            Lista de Equipos Asignados
          </Typography>
          <AsignadosTable />
        </Box>
      )}

      {tabIndex === 7 && (
        <Box mt={4}>
          <Button onClick={() => setTabIndex(null)}>&larr; Volver</Button>
          <Typography variant="h5" gutterBottom>
            Lista de Equipos a Prestamo
          </Typography>
          <PrestamosTable />
        </Box>
      )}

       {tabIndex === 8 && (
        <Box mt={4}>
          <Button onClick={() => setTabIndex(null)}>&larr; Volver</Button>
          <Typography variant="h5" gutterBottom>
            Movimientos de Equipos 
          </Typography>
          <MovimientosTable />
        </Box>
      )}



    </Box>
  );
}
