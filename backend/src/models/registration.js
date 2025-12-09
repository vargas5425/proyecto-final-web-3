module.exports = (sequelize, DataTypes) => {
  const Registration = sequelize.define("Registration", {
    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected"),
      defaultValue: "pending",
    },

    paymentProofPath: DataTypes.STRING,

    // Nuevo campo → token único para validar QR
    tokenValidacion: {
      type: DataTypes.STRING,
      unique: true,
    },

    // Nuevo campo → estado del ingreso
    estadoIngreso: {
      type: DataTypes.ENUM("pending", "checked"),
      defaultValue: "pending",
    },

    // Ya lo tenías → sirve como "fecha y hora de ingreso"
    checkedInAt: DataTypes.DATE,
  });

  return Registration;
};
