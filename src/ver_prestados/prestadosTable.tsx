import React, { useEffect, useState } from 'react';
import { getPrestamosEnUso, type Prestamo } from '../ver_prestados/prestadosService';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Alert,
  Stack,
} from '@mui/material';

interface PrestadosTableProps {
  id_usuario?: number;
}

const PrestadosTable: React.FC<PrestadosTableProps> = ({ id_usuario }) => {
  const storedUser = localStorage.getItem('usuario');
  const userId = id_usuario ?? (storedUser ? JSON.parse(storedUser).id_usuario : null);

  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setError('No se encontró el ID del usuario. Por favor inicia sesión.');
      setLoading(false);
      return;
    }

    const fetchPrestamos = async () => {
      try {
        setLoading(true);
        const data = await getPrestamosEnUso(userId);
        setPrestamos(data.prestamos);
      } catch (err) {
        console.error('Error al cargar préstamos:', err);
        setError('Error al cargar los préstamos. Intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrestamos();
  }, [userId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" marginTop={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box padding={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box padding={3}>
      {/* Título moderno con badge del total */}
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={2} mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Préstamos en Uso
        </Typography>
        <Box
          sx={{
            minWidth: 50,
            minHeight: 50,
            borderRadius: '50%',
            bgcolor: '#1976d2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1.3rem',
            boxShadow: '0px 4px 12px rgba(0,0,0,0.25)',
          }}
        >
          {prestamos.length}
        </Box>
      </Stack>

      <Paper elevation={6} sx={{ p: 3, borderRadius: '16px', backgroundColor: '#f5f5f5' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1976d2' }}>
                <TableCell align="center" sx={{ color: '#fff', fontWeight: 'bold' }}>Clase</TableCell>
                <TableCell align="center" sx={{ color: '#fff', fontWeight: 'bold' }}>Marca</TableCell>
                <TableCell align="center" sx={{ color: '#fff', fontWeight: 'bold' }}>Calibre</TableCell>
                <TableCell align="center" sx={{ color: '#fff', fontWeight: 'bold' }}>Serie</TableCell>
                <TableCell align="center" sx={{ color: '#fff', fontWeight: 'bold' }}>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {prestamos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No hay préstamos en uso
                  </TableCell>
                </TableRow>
              ) : (
                prestamos.map((p) => (
                  <TableRow key={p.id_prestamo} hover>
                    <TableCell align="center">{p.clase}</TableCell>
                    <TableCell align="center">{p.marca}</TableCell>
                    <TableCell align="center">{p.calibre}</TableCell>
                    <TableCell align="center">{p.serie}</TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color: p.estado === 'en uso' ? 'green' : 'red',
                        fontWeight: 'bold',
                      }}
                    >
                      {p.estado}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default PrestadosTable;
