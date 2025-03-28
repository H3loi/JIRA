const db = require("./index");

const Admin = function (admin) {
  this.username = admin.username;
  this.password = admin.password;
  this.role = admin.role || "HR Associates";
  this.status = admin.status || "Active";
};

// Create user
Admin.create = async (newAdmin) => {
    const query = `INSERT INTO admin (username, password, role, status) 
                   VALUES (?, ?, ?, ?)`;
  
    try {
      const [res] = await db.query(query, [
        newAdmin.username,
        newAdmin.password,
        newAdmin.role,
        newAdmin.status,
      ]);
      return { id: res.insertId, ...newAdmin };
    } catch (err) {
      console.error("Error creating user:", err);
      throw err;
    }
};

// Find all user
Admin.findAll = async () => {
    try {
      const [rows] = await db.query("SELECT * FROM admin");
      return rows;
    } catch (err) {
      console.error("Error fetching user:", err);
      throw err;
    }
};
  
  // Find user by ID
  Admin.findById = async (id) => {
    try {
      const [rows] = await db.query("SELECT * FROM admin WHERE id = ?", [id]);
      if (!rows.length) {
        throw { message: `User with id ${id} not found` };
      }
      return rows[0];
    } catch (err) {
      console.error("Error finding user by ID:", err);
      throw err;
    }
};

// Update user
Admin.update = async (id, updatedFields) => {
    const fields = Object.keys(updatedFields);
    const values = Object.values(updatedFields);
  
    if (fields.length === 0) {
      throw { message: "No fields provided for update" };
    }
  
    const setClause = fields.map((field) => `${field} = ?`).join(", ");
  
    try {
      const [res] = await db.query(
        `UPDATE admin SET ${setClause} WHERE id = ?`,
        [...values, id]
      );
  
      if (res.affectedRows === 0) {
        throw { message: `User with id ${id} not found` };
      }
  
      return { id, ...updatedFields };
    } catch (err) {
      console.error("Error updating user:", err);
      throw err;
    }
};

module.exports = Admin;