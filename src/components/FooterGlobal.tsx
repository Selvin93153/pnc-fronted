import { Box, Typography, Link } from "@mui/material";

export default function FooterGlobal() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#0b60d8ff", // mismo color que el header para coherencia
        color: "white",
        py: 2, // padding vertical
        px: 4, // padding horizontal
        textAlign: "center",
        mt: "auto", // empuja el footer al fondo
      }}
    >
      <Typography variant="body2" sx={{ opacity: 0.9 }}>
        © {new Date().getFullYear()} Sistema de Control. Todos los derechos reservados.
      </Typography>

      <Box sx={{ mt: 1 }}>
        <Link
          href="#"
          underline="hover"
          sx={{ color: "white", mx: 1, fontSize: 14 }}
        >
          Política de Privacidad
        </Link>
        |
        <Link
          href="#"
          underline="hover"
          sx={{ color: "white", mx: 1, fontSize: 14 }}
        >
          Términos de Uso
        </Link>
        |
        <Link
          href="#"
          underline="hover"
          sx={{ color: "white", mx: 1, fontSize: 14 }}
        >
          Contacto
        </Link>
      </Box>
    </Box>
  );
}
