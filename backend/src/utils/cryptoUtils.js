const crypto = require("crypto");

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function genTokenHex(size = 32) {
  return crypto.randomBytes(size).toString("hex");
}

module.exports = { hashPassword, genTokenHex };
