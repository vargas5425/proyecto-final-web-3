const Sequelize = require("sequelize");
const sequelize = require("../config/db");

// Modelos
const User = require("./user")(sequelize, Sequelize.DataTypes);
const Role = require("./role")(sequelize, Sequelize.DataTypes);
const Event = require("./event")(sequelize, Sequelize.DataTypes);
const Registration = require("./registration")(sequelize, Sequelize.DataTypes);

// Usuario → Rol
User.belongsTo(Role, { foreignKey: "roleId" });

// Evento → Organizador (User)
Event.belongsTo(User, { as: "organizer", foreignKey: "organizerId" });

// Evento → Inscripciones
Event.hasMany(Registration, { foreignKey: "eventId", onDelete: "CASCADE" });

// Inscripción → Usuario
Registration.belongsTo(User, { foreignKey: "userId" });

// Inscripción → Evento
Registration.belongsTo(Event, { foreignKey: "eventId" });

module.exports = {
  sequelize,
  User,
  Role,
  Event,
  Registration,
};
