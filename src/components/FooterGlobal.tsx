import { Box, Typography, Link } from "@mui/material";

export default function FooterGlobal() {
  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(90deg, #0b60d8 0%, #003b8a 100%)", // mismo degradado que el header
        color: "white",
        py: 2, // padding vertical
        px: 4, // padding horizontal
        textAlign: "center",
        mt: "auto", // empuja el footer al fondo
        boxShadow: "0px -2px 8px rgba(0,0,0,0.25)", // mejora visual opcional
        borderTop: "1px solid rgba(255,255,255,0.15)", // sutil separación con el contenido
      }}
    >
      <Typography variant="body2" sx={{ opacity: 0.9 }}>
        © {new Date().getFullYear()} "la seguridad es hoy, no mañana"
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
