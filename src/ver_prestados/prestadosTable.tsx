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
        setPrestamos(data);
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
      <Typography variant="h4" gutterBottom color="primary">
        Préstamos en Uso
      </Typography>

      <Paper elevation={6} style={{ padding: '20px', borderRadius: '16px', backgroundColor: '#f9f9f9' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: '#1976d2' }}>
                {/* Se quitó el ID del préstamo */}
                <TableCell align="center" style={{ color: '#fff', fontWeight: 'bold' }}>Clase</TableCell>
                <TableCell align="center" style={{ color: '#fff', fontWeight: 'bold' }}>Marca</TableCell>
                <TableCell align="center" style={{ color: '#fff', fontWeight: 'bold' }}>Calibre</TableCell>
                <TableCell align="center" style={{ color: '#fff', fontWeight: 'bold' }}>Serie</TableCell>
                <TableCell align="center" style={{ color: '#fff', fontWeight: 'bold' }}>Estado</TableCell>
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
                      style={{
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
