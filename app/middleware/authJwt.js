const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models/index.js");

const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
  }

  return res.sendStatus(401).send({ message: "Unauthorized!" });
}

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["x-refresh-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token,
  config.secret,
  (err, decoded) => {
  if (err) {
    return res.status(401).send({
    message: "Unauthorized!",
    });        
  }
    req.adminId = decoded.id;
    next();
  });
};

const isAdmin = async (req, res, next) => {
  const adminId = req.adminId;

  const query = `
    SELECT r.name FROM roles r
    INNER JOIN admin_roles ur ON ur.roleId = r.id
    WHERE ur.adminId = ?
  `;

  try {
    const [results] = await db.execute(query, [adminId]);

    const hasAdminRole = results.some(role => role.name === 'Admin');

    if (hasAdminRole) {
      next();
      return;
    }

    res.status(403).send({ message: "Require Admin Role!" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error checking roles" });
  }
};

const isPresident = async (req, res, next) => {
  const adminId = req.adminId;

  const query = `
    SELECT r.name FROM roles r
    INNER JOIN admin_roles ur ON ur.roleId = r.id
    WHERE ur.adminId = ?
  `;

  try {
    const [results] = await db.execute(query, [adminId]);

    const hasPresidentRole = results.some(role => role.name === 'President');

    if (hasPresidentRole) {
      next();
      return;
    }

    res.status(403).send({ message: "Require President Role!" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error checking roles" });
  }
};

const isManagerOrTeamLeads = async (req, res, next) => {
  const adminId = req.adminId;

  const query = `
    SELECT r.name FROM roles r
    INNER JOIN admin_roles ur ON ur.roleId = r.id
    WHERE ur.adminId = ?
  `;

  try {
    const [results] = await db.execute(query, [adminId]);

    const hasRole = results.some(
      role => role.name === 'Manager' || role.name === 'Team Leads'
    );

    if (hasRole) {
      next();
      return;
    }

    res.status(403).send({ message: "Require Manager or Team Leads Role!" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error checking roles" });
  }
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isPresident: isPresident,
  isManagerOrTeamLeads: isManagerOrTeamLeads,
};
module.exports = {authJwt, catchError};