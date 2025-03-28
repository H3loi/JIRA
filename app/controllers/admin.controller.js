const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const db = require("../models/index.js");
const Admin = require("../models/admin.model");

// Create user
exports.createAdmin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) 
      return res.status(400).json({ errors: errors.array() });

  try {
      const { username, password, role, status } = req.body;

      // Check if username already exists
      const [existingAdmin] = await db.query(
          "SELECT * FROM admin WHERE username = ?", [username]
      );

      if (existingAdmin.length > 0) {
          return res.status(409).json({ error: "Username already exists" });
      }

      // Hash password
      const hashedPassword = bcrypt.hashSync(password, 8);

      // Check if role is provided, if not role default to "HR Associates"
      const roleToAssign = role || "HR Associates";

      // Insert into `admin` table
      const [insertResult] = await db.query(
        "INSERT INTO admin (username, password, role, status) VALUES (?, ?, ?, ?)",
        [username, hashedPassword, roleToAssign, status]
    );

      const adminId = insertResult.insertId; 

      // Find role ID in `roles` table
      const [roleData] = await db.query(
          "SELECT id FROM roles WHERE name = ?", 
          [roleToAssign]
      );

      if (roleData.length === 0) {
          return res.status(400).json({ error: "Role does not exist" });
      }

      const roleId = roleData[0].id;

      // Assign role to admin in `admin_roles`
      await db.query(
          "INSERT INTO admin_roles (adminId, roleId) VALUES (?, ?)",
          [adminId, roleId]
      );

      res.status(201).json({
          message: "User created successfully",
          adminId: adminId,
          assignedRole: roleToAssign
      });

  } catch (err) {
      console.error("Error creating user:", err);
      res.status(500).json({ error: err.message || "Error creating user" });
  }
};

// Get all users
exports.getAllAdmin = async (req, res) => {
  try {
      const [admins] = await db.query(`
          SELECT a.*, r.name as role 
          FROM admin a 
          LEFT JOIN admin_roles ar ON a.id = ar.adminId
          LEFT JOIN roles r ON ar.roleId = r.id
      `);

      res.status(200).json(admins);
  } catch (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ error: err.message || "Error retrieving users" });
  }
};

// Update user by ID
exports.updateAdmin = async (req, res) => {
    const id = req.params.id;
    const updatedFields = req.body;

    try {
        const [updatedRows] = await db.query(
            "UPDATE admin SET ? WHERE id = ?",
            [updatedFields, id]
        );

        if (updatedRows.affectedRows === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully" });

    } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ error: err.message || "Error updating user" });
    }
};
