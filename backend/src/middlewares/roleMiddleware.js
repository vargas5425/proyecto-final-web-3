module.exports = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ msg: "No autenticado" });

    const userRole = req.user.Role?.name;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ msg: "No autorizado" });
    }

    next();
  };
};
