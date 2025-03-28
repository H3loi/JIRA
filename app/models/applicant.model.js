const db = require("./index");

const Applicants = function (applicants) {
  this.name = applicants.name;
  this.position = applicants.position;
  this.applicationDate = applicants.applicationDate || new Date();
  this.contact = applicants.contact;
  this.email = applicants.email;
  this.curriculumVitae = applicants.curriculumVitae;
  this.interviewer = applicants.interviewer || "HR Associates";
  this.interviewDate = applicants.interviewDate || new Date();
  this.applicationStatus = applicants.applicationStatus || "First Interview";
  this.status = applicants.status || "On Going";
};

// Create method
Applicants.create = async (newApplicant) => {
  const query = `
    INSERT INTO applicants 
    (name, position, applicationDate, contact, email, curriculumVitae, interviewer, interviewDate, applicationStatus, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  try {
    const [res] = await db.query(query, [
      newApplicant.name,
      newApplicant.position,
      newApplicant.applicationDate,
      newApplicant.contact,
      newApplicant.email,
      newApplicant.curriculumVitae,
      newApplicant.interviewer,
      newApplicant.interviewDate,
      newApplicant.applicationStatus,
      newApplicant.status,
    ]);
    return { id: res.insertId, ...newApplicant };
  } catch (err) {
    console.error("Error creating applicant:", err);
    throw err;
  }
};

// Find all applicants
Applicants.findAll = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM applicants");
    return rows;
  } catch (err) {
    console.error("Error fetching applicants:", err);
    throw err;
  }
};

// Find applicant by ID
Applicants.findById = async (id) => {
  try {
    const [rows] = await db.query("SELECT * FROM applicants WHERE id = ?", [id]);
    if (!rows.length) {
      throw { message: `Applicant with id ${id} not found` };
    }
    return rows[0];
  } catch (err) {
    console.error("Error finding applicant by ID:", err);
    throw err;
  }
};

// Update applicant
Applicants.update = async (id, updatedFields) => {
  const fields = Object.keys(updatedFields);
  const values = Object.values(updatedFields);

  if (fields.length === 0) {
    throw { message: "No fields provided for update" };
  }

  const setClause = fields.map((field) => `${field} = ?`).join(", ");

  try {
    const [res] = await db.query(
      `UPDATE applicants SET ${setClause} WHERE id = ?`,
      [...values, id]
    );

    if (res.affectedRows === 0) {
      throw { message: `Applicant with id ${id} not found` };
    }

    return { id, ...updatedFields };
  } catch (err) {
    console.error("Error updating applicant:", err);
    throw err;
  }
};

// Delete applicant
Applicants.delete = async (id) => {
  try {
    const [res] = await db.query("DELETE FROM applicants WHERE id = ?", [id]);

    if (res.affectedRows === 0) {
      throw { message: `Applicant with id ${id} not found` };
    }

    return { message: `Applicant with id ${id} deleted` };
  } catch (err) {
    console.error("Error deleting applicant:", err);
    throw err;
  }
};

module.exports = Applicants;
