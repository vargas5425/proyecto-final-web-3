const { Event, User, Role } = require("../src/models");
const path = require("path");
const { hashPassword } = require("../src/utils/cryptoUtils"); // si tu función está aquí

async function seed() {
  try {
    // ------------------------------
    // Crear Admin inicial si no existe
    // ------------------------------

      await User.create({
        nombre: "Super Admin",
        email: "admin@correo.com",
        passwordHash: hashPassword("admin123"), // cambia la contraseña si quieres
        roleId: 1,
      });
      console.log("✅ Admin inicial creado correctamente");
  
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creando seed:", error);
    process.exit(1);
  }
}

seed();
