import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";

interface AddRoleFormProps {
  onAdd: (nombre: string) => void;
}

export default function AddRoleForm({ onAdd }: AddRoleFormProps) {
  const [nombreRol, setNombreRol] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nombreRol.trim() === "") return;
    onAdd(nombreRol.trim());
    setNombreRol("");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mb: 4,
        display: "flex",
        justifyContent: "center",
        gap: 2,
        flexWrap: "wrap",
      }}
    >
      <TextField
        label="Nombre del nuevo rol"
        value={nombreRol}
        onChange={(e) => setNombreRol(e.target.value)}
        size="small"
        sx={{ minWidth: 250 }}
      />
      <Button variant="contained" color="primary" type="submit">
        Guardar
      </Button>
    </Box>
  );
}
