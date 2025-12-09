module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define("Event", {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    dateTime: { type: DataTypes.DATE, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false }, // Dirección legible
    capacity: { type: DataTypes.INTEGER },
    posterPath: { type: DataTypes.STRING },
    lat: { type: DataTypes.FLOAT, allowNull: false },       // Latitud
    lng: { type: DataTypes.FLOAT, allowNull: false },       // Longitud
    precio: { type: DataTypes.FLOAT, defaultValue: 0 },     // ← NUEVO CAMPO
    organizerId: { type: DataTypes.INTEGER, allowNull: true }, // ← FK a User
  });

  return Event;
};
