require("dotenv").config();
const express = require("express");
const path = require("path");
const { sequelize, Role } = require("./models");
const cors = require("cors");

const app = express();

// Middlewares
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(cors({ origin: process.env.FRONTEND_URL }));

// Rutas
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/users.routes"));
app.use("/api/events", require("./routes/events.routes"));
app.use("/api/registrations", require("./routes/registrations.routes"));
app.use("/api/validate", require("./routes/validate.routes"));
app.use("/api/admin", require("./routes/admin.routes"));

// Sincronización de DB y creación de roles
sequelize.sync({ alter: false, force: false }).then(async () => {
  console.log("Base de datos sincronizada");

  const roles = ["admin", "organizer", "validator", "participant"];
  for (const r of roles) {
    const existe = await Role.findOne({ where: { name: r } });
    if (!existe) await Role.create({ name: r });
  }

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
});
