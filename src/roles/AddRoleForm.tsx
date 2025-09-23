import { Box, Button, TextField, Paper, Stack } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
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
    <Paper
      elevation={1}
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: "background.paper",
        maxWidth: 500,
        mx: "auto",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
      >
        <Stack spacing={2}>
          <TextField
            label="Nombre del nuevo rol"
            value={nombreRol}
            onChange={(e) => setNombreRol(e.target.value)}
            size="medium"
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            startIcon={<SaveIcon />}
            sx={{ borderRadius: 2 }}
          >
            Guardar Rol
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}
