const adminService = require("../services/adminService");

module.exports = {
  crearUsuarioConRol: async (req, res) => {
    try {
      const { nombre, email, password, rol } = req.body;
      const userRole = req.user.Role?.name;

      const usuario = await adminService.crearUsuarioConRol({
        nombre,
        email,
        password,
        rol,
        userRole,
      });

      return res.json({
        mensaje: "Usuario creado correctamente.",
        usuario,
      });
    } catch (error) {
      console.error(error);

      // Si el service lanzó un error con statusCode, lo usamos
      const status = error.statusCode || 400;
      return res.status(status).json({ mensaje: error.message || "Error en el servidor." });
    }
  },
};

