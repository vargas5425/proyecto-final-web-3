const { body, validationResult } = require("express-validator");

// VALIDACIONES PARA REGISTRO DE USUARIO
const validarRegistro = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre completo es obligatorio."),

  body("email")
    .notEmpty()
    .withMessage("El correo electrónico es obligatorio.")
    .isEmail()
    .withMessage("El correo electrónico no es válido."),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria.")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres."),

  body("rol")
    .notEmpty()
    .withMessage("El rol es obligatorio."),

  // Middleware final para verificar errores
  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    next();
  },
];

//
// VALIDACIONES PARA LOGIN
//
const validarLogin = [
  body("email")
    .notEmpty()
    .withMessage("El correo electrónico es obligatorio.")
    .isEmail()
    .withMessage("El correo electrónico no es válido."),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria."),

  // Middleware final para verificar errores
  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    next();
  },
];

module.exports = {
  validarRegistro,
  validarLogin,
};
