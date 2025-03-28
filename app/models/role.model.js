const db = require("./index");

const Role = function (role) {
  this.name = role.name;
  this.description = role.description || "No description";
};

// Create role
Role.create = async (newRole) => {
  const query = `INSERT INTO roles (name, description) VALUES (?, ?)`;
  try {
    const [res] = await db.query(query, [newRole.name, newRole.description]);
    return { id: res.insertId, ...newRole };
  } catch (err) {
    console.error("Error creating role:", err);
    throw err;
  }
};

// Assign roles to user
Role.assignRolesToUser = async (adminId, roles) => {
  const query = "INSERT INTO admin_roles (adminId, roleId) VALUES ?";
  const values = roles.map((roleId) => [adminId, roleId]);

  try {
    const [res] = await db.query(query, [values]);
    return res;
  } catch (err) {
    console.error("Error assigning roles:", err);
    throw err;
  }
};

// Find all roles
Role.findAll = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM roles");
    return rows;
  } catch (err) {
    console.error("Error fetching roles:", err);
    throw err;
  }
};

// Find by ID
Role.findById = async (id) => {
  try {
    const [rows] = await db.query("SELECT * FROM roles WHERE id = ?", [id]);
    if (!rows.length) throw { message: `Role with id ${id} not found` };
    return rows[0];
  } catch (err) {
    console.error("Error finding role by ID:", err);
    throw err;
  }
};

// Update role
Role.update = async (id, updatedFields) => {
  const fields = Object.keys(updatedFields);
  const values = Object.values(updatedFields);

  if (!fields.length) throw { message: "No fields provided for update" };

  const setClause = fields.map((f) => `${f} = ?`).join(", ");

  try {
    const [res] = await db.query(`UPDATE roles SET ${setClause} WHERE id = ?`, [...values, id]);
    if (res.affectedRows === 0) throw { message: `Role with id ${id} not found` };
    return { id, ...updatedFields };
  } catch (err) {
    console.error("Error updating role:", err);
    throw err;
  }
};

// Delete role
Role.delete = async (id) => {
  try {
    const [res] = await db.query("DELETE FROM roles WHERE id = ?", [id]);
    if (res.affectedRows === 0) throw { message: `Role with id ${id} not found` };
    return { message: `Role with id ${id} deleted` };
  } catch (err) {
    console.error("Error deleting role:", err);
    throw err;
  }
};

module.exports = Role;
