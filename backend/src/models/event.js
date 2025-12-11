module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define("Event", {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    dateTime: { type: DataTypes.DATE, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    capacity: { type: DataTypes.INTEGER },
    posterPath: { type: DataTypes.STRING },
    lat: { type: DataTypes.FLOAT, allowNull: false },
    lng: { type: DataTypes.FLOAT, allowNull: false },
    precio: { type: DataTypes.FLOAT, defaultValue: 0 },
    organizerId: { type: DataTypes.INTEGER, allowNull: true },
  });

  return Event;
};
