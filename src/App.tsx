import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography, Paper } from '@mui/material';
import RolesTable from './roles/RolesTable';
import TiposTable from './tipos_equipos/TiposTable';
import './index.css';

const App: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1', p: 3 }}>
      {/* Contenedor de pestañas */}
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

      {/* Contenido según la pestaña */}
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
};

export default App;
