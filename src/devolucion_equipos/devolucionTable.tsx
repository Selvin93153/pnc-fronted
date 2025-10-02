import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Chip, IconButton, Tooltip, Button, Dialog,
  DialogTitle, DialogContent, TextField, DialogActions, Box, FormControl,
  InputLabel, Select, MenuItem
} from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import {
  getMovimientos, updateMovimiento,
  type MovimientoEquipo
} from "./movimientos-devolucion";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const DevolucionTable: React.FC = () => {
  const [movimientos, setMovimientos] = useState<MovimientoEquipo[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [comentarios, setComentarios] = useState("");
  const [movSeleccionado, setMovSeleccionado] = useState<MovimientoEquipo | null>(null);

  const [filtroEntregaMes, setFiltroEntregaMes] = useState<number | string>("");
  const [filtroEntregaAnio, setFiltroEntregaAnio] = useState<number | string>("");
  const [filtroDevolucionMes, setFiltroDevolucionMes] = useState<number | string>("");
  const [filtroDevolucionAnio, setFiltroDevolucionAnio] = useState<number | string>("");
  const [filtroEstado, setFiltroEstado] = useState<"todos" | "disponible" | "en uso">("todos"); // 🔹 nuevo

  const cargarMovimientos = async () => {
    const data = await getMovimientos();
    setMovimientos(data);
  };

  useEffect(() => { cargarMovimientos(); }, []);

  const handleAbrirDevolucion = (mov: MovimientoEquipo) => {
    setMovSeleccionado(mov);
    setComentarios("");
    setOpenDialog(true);
  };

  const handleConfirmarDevolucion = async () => {
    if (!movSeleccionado) return;

    const fechaActual = new Date();
    const fechaISO = fechaActual.toISOString().split("T")[0];
    const hora = fechaActual.toTimeString().split(" ")[0];

    await updateMovimiento(movSeleccionado.id_movimiento, {
      fecha_devolucion: fechaISO,
      hora_devolucion: hora,
      comentarios: comentarios || "Equipo devuelto",
      estado: "disponible",
    });

    setOpenDialog(false);
    setMovSeleccionado(null);
    cargarMovimientos();
  };

  // 🔹 Filtrado de movimientos
  const movimientosFiltrados = movimientos.filter((mov) => {
    const fechaEntrega = new Date(mov.fecha_entrega);
    const fechaDevolucion = mov.fecha_devolucion ? new Date(mov.fecha_devolucion) : null;

    // Filtro por estado
    if (filtroEstado !== "todos" && mov.estado !== filtroEstado) return false;

    // Filtros de fecha
    if (filtroEntregaMes !== "" && filtroEntregaAnio !== "") {
      const fechaInicio = new Date(filtroEntregaAnio as number, (filtroEntregaMes as number) - 1, 1);
      const fechaFin = new Date(filtroEntregaAnio as number, filtroEntregaMes as number, 0);
      return fechaEntrega >= fechaInicio && fechaEntrega <= fechaFin;
    }

    if (filtroDevolucionMes !== "" && filtroDevolucionAnio !== "" && fechaDevolucion) {
      const fechaInicio = new Date(filtroDevolucionAnio as number, (filtroDevolucionMes as number) - 1, 1);
      const fechaFin = new Date(filtroDevolucionAnio as number, filtroDevolucionMes as number, 0);
      return fechaDevolucion >= fechaInicio && fechaDevolucion <= fechaFin;
    }

    return true;
  });

  const meses = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ];

  // 🔹 Función para generar PDF
  const descargarPDF = () => {
    const doc = new jsPDF();
    const fecha = new Date();
    const fechaStr = fecha.toLocaleString();

    doc.setFontSize(16);
    doc.text("Devoluciones de Equipos", 105, 15, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Fecha de impresión: ${fechaStr}`, 105, 22, { align: "center" });

    const tableColumn = [
      "Clase", "Marca y Serie", "Entrega", "Recibe", "Fecha Entrega",
      "Hora Entrega", "Fecha Devolución", "Hora Devolución", "Comentarios", "Estado"
    ];

    const tableRows: any[] = movimientosFiltrados.map((mov) => [
      mov.id_prestamo.clase,
      `${mov.id_prestamo.marca} - ${mov.id_prestamo.serie}`,
      `${mov.id_usuario_entrega.nombres} ${mov.id_usuario_entrega.apellidos}`,
      `${mov.id_usuario_recibe.nombres} ${mov.id_usuario_recibe.apellidos}`,
      mov.fecha_entrega,
      mov.hora_entrega,
      mov.fecha_devolucion || "-",
      mov.hora_devolucion || "-",
      mov.comentarios || "-",
      mov.estado
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [25, 118, 210], textColor: [255, 255, 255] },
    });

    doc.save(`Devoluciones_${fecha.getTime()}.pdf`);
  };

  return (
    <Paper elevation={6} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
        📋 DEVOLUCIONES DE EQUIPOS
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Aquí puedes aceptar la devolución de equipos prestados.
      </Typography>

      {/* 🔹 Botones de filtro de estado y PDF */}
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <Button
          variant={filtroEstado === "todos" ? "contained" : "outlined"}
          color="primary"
          onClick={() => setFiltroEstado("todos")}
        >
          Todos
        </Button>
        <Button
          variant={filtroEstado === "disponible" ? "contained" : "outlined"}
          color="success"
          onClick={() => setFiltroEstado("disponible")}
        >
          Disponible
        </Button>
        <Button
          variant={filtroEstado === "en uso" ? "contained" : "outlined"}
          color="warning"
          onClick={() => setFiltroEstado("en uso")}
        >
          En Uso
        </Button>

        <Button
          variant="contained"
          color="error"
          sx={{ ml: "auto" }}
          onClick={descargarPDF}
        >
          Descargar PDF
        </Button>
      </Box>

      {/* 🔹 Filtros de fecha */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: "wrap" }}>
        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel>Mes Entrega</InputLabel>
          <Select
            value={filtroEntregaMes}
            onChange={(e) => setFiltroEntregaMes(e.target.value === "" ? "" : Number(e.target.value))}
            disabled={filtroDevolucionMes !== "" || filtroDevolucionAnio !== ""}
          >
            <MenuItem value="">Todos</MenuItem>
            {meses.map((nombre, i) => (
              <MenuItem key={i} value={i + 1}>{nombre}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          type="number"
          label="Año Entrega"
          value={filtroEntregaAnio}
          onChange={(e) => setFiltroEntregaAnio(e.target.value === "" ? "" : Number(e.target.value))}
          size="small"
          placeholder="2025"
          disabled={filtroDevolucionMes !== "" || filtroDevolucionAnio !== ""}
        />

        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel>Mes Devolución</InputLabel>
          <Select
            value={filtroDevolucionMes}
            onChange={(e) => setFiltroDevolucionMes(e.target.value === "" ? "" : Number(e.target.value))}
            disabled={filtroEntregaMes !== "" || filtroEntregaAnio !== ""}
          >
            <MenuItem value="">Todos</MenuItem>
            {meses.map((nombre, i) => (
              <MenuItem key={i} value={i + 1}>{nombre}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          type="number"
          label="Año Devolución"
          value={filtroDevolucionAnio}
          onChange={(e) => setFiltroDevolucionAnio(e.target.value === "" ? "" : Number(e.target.value))}
          size="small"
          placeholder="2025"
          disabled={filtroEntregaMes !== "" || filtroEntregaAnio !== ""}
        />
      </Box>

      <TableContainer sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.main" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Clase</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Marca y Serie</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Entrega</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Recibe</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Fecha Entrega</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Hora Entrega</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Fecha Devolución</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Hora Devolución</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Comentarios</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Estado</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {movimientosFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No hay movimientos registrados.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              movimientosFiltrados.map((mov) => (
                <TableRow key={mov.id_movimiento} hover>
                  <TableCell>{mov.id_prestamo.clase}</TableCell>
                  <TableCell>{mov.id_prestamo.marca} - {mov.id_prestamo.serie}</TableCell>
                  <TableCell>{mov.id_usuario_entrega.nombres} {mov.id_usuario_entrega.apellidos}</TableCell>
                  <TableCell>{mov.id_usuario_recibe.nombres} {mov.id_usuario_recibe.apellidos}</TableCell>
                  <TableCell>{mov.fecha_entrega}</TableCell>
                  <TableCell>{mov.hora_entrega}</TableCell>
                  <TableCell>{mov.fecha_devolucion || "-"}</TableCell>
                  <TableCell>{mov.hora_devolucion || "-"}</TableCell>
                  <TableCell>{mov.comentarios || "-"}</TableCell>
                  <TableCell>
                    <Chip
                      label={mov.estado === "en uso" ? "En Uso" : "Disponible"}
                      color={mov.estado === "en uso" ? "warning" : "success"}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Devolución">
                      <IconButton
                        color="primary"
                        onClick={() => handleAbrirDevolucion(mov)}
                        disabled={mov.estado !== "en uso"}
                      >
                        <ReplayIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Registrar Devolución</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Comentarios"
            value={comentarios}
            onChange={(e) => setComentarios(e.target.value)}
            multiline
            rows={3}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleConfirmarDevolucion} variant="contained" color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default DevolucionTable;
