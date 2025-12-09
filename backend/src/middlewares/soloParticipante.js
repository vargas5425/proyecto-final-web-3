module.exports = function soloParticipante(req, res, next) {
  try {
    // Aquí accedemos al nombre del rol correctamente
    const rol = req.user?.Role?.name;

    if (rol !== "participant") {
      return res.status(403).json({
        ok: false,
        msg: "Solo los participantes pueden inscribirse a un evento."
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      ok: false,
      msg: "Error al validar el rol del usuario."
    });
  }
};
