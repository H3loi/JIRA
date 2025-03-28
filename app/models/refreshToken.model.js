const { v4: uuidv4 } = require("uuid");
const config = require("../config/auth.config");
const db = require("./index");

const refreshTokenModel = {
  async createToken(adminId) {
    try {
      const expiredAt = new Date();
      expiredAt.setSeconds(expiredAt.getSeconds() + config.jwtRefreshExpiration);

      const token = uuidv4();
      const expiryDate = expiredAt.toISOString(); // Ensures proper datetime format
      
      const [result] = await db.query(
        `INSERT INTO refresh_tokens (token, adminId, expiryDate) VALUES (?, ?, ?)`,
        [token, adminId, expiryDate]
      );

      if (result.affectedRows === 0) {
        throw new Error("Failed to create refresh token.");
      }

      return token;
    } catch (err) {
      console.error("Error creating refresh token:", err);
      throw err;
    }
  },

  async findByToken(token) {
    try {
      const [rows] = await db.query(
        `SELECT * FROM refresh_tokens WHERE token = ?`,
        [token]
      );
      return rows[0];
    } catch (err) {
      console.error("Error finding refresh token:", err);
      throw err;
    }
  },

  async deleteById(id) {
    try {
      const [result] = await db.query(
        `DELETE FROM refresh_tokens WHERE id = ?`,
        [id]
      );

      if (result.affectedRows === 0) {
        throw new Error("Failed to delete refresh token.");
      }
    } catch (err) {
      console.error("Error deleting refresh token:", err);
      throw err;
    }
  },

  verifyExpiration(tokenRow) {
    return tokenRow.expiryDate < Date.now();
  },
};

module.exports = refreshTokenModel;
