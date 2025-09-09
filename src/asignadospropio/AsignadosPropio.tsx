// src/asignadospropio/AsignadosPropio.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Typography,
} from "@mui/material";
import { getMisEquipos } from "./service";
import type { EquipoAsignado } from "./types";

const AsignadosPropio: React.FC = () => {
  const [equipos, setEquipos] = useState<EquipoAsignado[]>([]);
  const [page] = useState(0);
  const [rowsPerPage] = useState(5);

  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const data = await getMisEquipos();
        setEquipos(data);
      } catch (error) {
        console.error("Error cargando equipos asignados:", error);
      }
    };

    fetchEquipos();
  }, []);

 


  return (
    <Box p={3}>
      <Typography
        variant="h4"
        fontWeight="bold"
        color="primary"
        mb={3}
        sx={{ textAlign: "center", textTransform: "uppercase", letterSpacing: 1 }}
      >
        Mis Equipos Asignados
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: 5,
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Clase</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Marca</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Calibre</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Serie</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Tipo</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Usuario</TableCell>
             <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {equipos
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((equipo) => (
                <TableRow key={equipo.id_asignacion} hover sx={{ cursor: "pointer" }}>
                  <TableCell>{equipo.clase}</TableCell>
                  <TableCell>{equipo.marca || "-"}</TableCell>
                  <TableCell>{equipo.calibre || "-"}</TableCell>
                  <TableCell>{equipo.serie}</TableCell>
                   <TableCell>{equipo.tipo?.nombre}</TableCell>
  <TableCell>{equipo.usuario?.nombres} {equipo.usuario?.apellidos}</TableCell>
                     <TableCell>{equipo.estado}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        
      </TableContainer>
    </Box>
  );
};

export default AsignadosPropio;
