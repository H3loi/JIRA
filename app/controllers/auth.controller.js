const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/auth.config");
const db = require("../models/index.js");
const refreshTokenModel = require("../models/refreshToken.model");

exports.signin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { username, password } = req.body;
    const [admins] = await db.query(
      "SELECT * FROM admin WHERE username = ?", 
      [username]);

    if (!admins || admins.length === 0) {
      return res.status(404).send(
        { message: "Invalid username or password!" }
      );
    }

    const admin = admins[0];
    if (admin.status === "Disable") {
      return res.status(403).json(
        { error: "Your account has been disabled. Please contact admin." }
      );
    }

    const passwordIsValid =  bcrypt.hashSync(password, admin.password);
    if (!passwordIsValid) {
      return res.status(401).send(
        { message: "Invalid username or password!" }
      );
    }

    const accessToken = jwt.sign({ id: admin.id }, config.secret, {
      algorithm: 'HS256',
      expiresIn: config.jwtExpiration
    });

    const refreshToken = await refreshTokenModel.createToken(admin.id);
    const [roles] = await db.execute(
      `SELECT r.name FROM roles r 
      INNER JOIN admin_roles ur ON 
      r.id = ur.roleId WHERE ur.adminId = ?`,
      [admin.id]
    );

    const authorities = roles.length > 0 
      ? roles.map(role => "ROLE_" + role.name.toUpperCase()) 
      : ["NO_ROLE_ASSIGNED"];

    res.status(200).send({
      id: admin.id,
      username: admin.username,
      role: authorities,
      status: [admin.status],
      accessToken,
      refreshToken
    });
  } catch (err) {
    console.error("Signin Error:", err);
    res.status(500).send({ message: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).send(
        { message: "Refresh token is required!" }
      );
    }
    await db.query("DELETE FROM refresh_tokens WHERE token = ?", [refreshToken]);
    res.status(200).send({ message: "User logged out successfully!" });
  } catch (err) {
    console.error("Logout Error:", err);
    res.status(500).send({ message: err.message });
  }
};

exports.refreshToken = async (req, res) => {
  const requestToken = req.body.refreshToken;
  if (!requestToken) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    const [rows] = await db.query(
      "SELECT * FROM refresh_tokens WHERE token = ?", 
      [requestToken]
    );
    const refreshToken = rows[0];

    if (!refreshToken) {
      return res.status(403).json({ message: "Refresh token is not in database!" });
    }

      const [adminRows] = await db.query("SELECT * FROM admin WHERE id = ?", [refreshToken.adminId]);
      const admin = adminRows[0];

      if (!admin) {
        return res.status(404).json({ message: "User not found" });
      }

      const newAccessToken = jwt.sign({ id: admin.id }, config.secret, {
        expiresIn: config.jwtExpiration
      });

      return res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: refreshToken.token,
      });
      
  } catch (err) {
    console.error("Refresh token error:", err);
    return res.status(500).json({ message: err.message });
  }
};
