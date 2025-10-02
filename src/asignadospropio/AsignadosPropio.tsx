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
  Button,
} from "@mui/material";
import { getMisEquipos } from "./service";
import type { EquipoAsignado } from "./types";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

  // Función para generar el PDF
  const descargarPDF = () => {
    const doc = new jsPDF();

    const fecha = new Date();
    const fechaStr = fecha.toLocaleString();

    // Título del PDF
    doc.setFontSize(16);
    doc.text("Mis Equipos Asignados", 105, 15, { align: "center" });

    // Fecha y hora
    doc.setFontSize(10);
    doc.text(`Fecha de impresión: ${fechaStr}`, 105, 22, { align: "center" });

    // Encabezados de la tabla
    const tableColumn = ["Clase", "Marca", "Calibre", "Serie", "Tipo", "Usuario", "Estado"];
    // Filas de datos
    const tableRows: any[] = [];

    equipos.forEach((equipo) => {
      const usuario = `${equipo.usuario?.nombres || ""} ${equipo.usuario?.apellidos || ""}`;
      const row = [
        equipo.clase,
        equipo.marca || "-",
        equipo.calibre || "-",
        equipo.serie,
        equipo.tipo?.nombre || "-",
        usuario,
        equipo.estado,
      ];
      tableRows.push(row);
    });

    // Generar tabla en el PDF
    // Generar tabla en el PDF
autoTable(doc, {
  head: [tableColumn],
  body: tableRows,
  startY: 30,
  styles: { fontSize: 10 },
  headStyles: { fillColor: [25, 118, 210], textColor: [255, 255, 255] },
});


    doc.save(`Mis_Equipos_${fecha.getTime()}.pdf`);
  };

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

      <Button
        variant="contained"
        color="error"
        sx={{ mb: 2 }}
        onClick={descargarPDF}
      >
        Descargar PDF
      </Button>

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
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color:
                        equipo.estado === "guardado"
                          ? "green"
                          : equipo.estado === "en uso"
                          ? "red"
                          : "inherit",
                    }}
                  >
                    {equipo.estado}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AsignadosPropio;
