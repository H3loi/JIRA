const db = require("./index");

const Event = function (event) {
  this.title = event.title;
  this.interviewDate = event.interviewDate;
  this.is_available = event.is_available || "Available";
  this.remarks = event.remarks;
  this.new_Date = event.new_Date || new Date();
};

// Create event
Event.create = async (newEvent) => {
  const query = `INSERT INTO events (title, interviewDate, is_available, remarks, new_Date) 
                 VALUES (?, ?, ?, ?, ?)`;

  try {
    const [res] = await db.query(query, [
      newEvent.title,
      newEvent.interviewDate,
      newEvent.is_available,
      newEvent.remarks,
      newEvent.new_Date,
    ]);
    return { id: res.insertId, ...newEvent };
  } catch (err) {
    console.error("Error creating event:", err);
    throw err;
  }
};

// Find all events
Event.findAll = async () => {
  try {
    const [rows] = await db.query("SELECT * FROM events");
    return rows;
  } catch (err) {
    console.error("Error fetching events:", err);
    throw err;
  }
};

// Find event by ID
Event.findById = async (id) => {
  try {
    const [rows] = await db.query("SELECT * FROM events WHERE id = ?", [id]);
    if (!rows.length) {
      throw { message: `Event with id ${id} not found` };
    }
    return rows[0];
  } catch (err) {
    console.error("Error finding event:", err);
    throw err;
  }
};

// Update event
Event.update = async (id, updatedFields) => {
  const fields = Object.keys(updatedFields);
  const values = Object.values(updatedFields);

  if (fields.length === 0) {
    throw { message: "No fields provided for update" };
  }

  const setClause = fields.map((field) => `${field} = ?`).join(", ");

  try {
    const [res] = await db.query(
      `UPDATE events SET ${setClause} WHERE id = ?`,
      [...values, id]
    );

    if (res.affectedRows === 0) {
      throw { message: `Event with id ${id} not found` };
    }

    return { id, ...updatedFields };
  } catch (err) {
    console.error("Error updating event:", err);
    throw err;
  }
};

// Delete event
Event.delete = async (id) => {
  try {
    const [res] = await db.query("DELETE FROM events WHERE id = ?", [id]);

    if (res.affectedRows === 0) {
      throw { message: `Event with id ${id} not found` };
    }

    return { message: `Event with id ${id} deleted` };
  } catch (err) {
    console.error("Error deleting event:", err);
    throw err;
  }
};

module.exports = Event;
