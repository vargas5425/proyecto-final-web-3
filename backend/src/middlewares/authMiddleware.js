const jwt = require("jsonwebtoken");
const { User, Role } = require("../models");

module.exports = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ msg: "Falta token" });

  const token = auth.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(payload.id, { include: [Role] });

    if (!user) return res.status(401).json({ msg: "Token inválido" });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token inválido" });
  }
};
