module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    nombre: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
  });

  return User;
};
