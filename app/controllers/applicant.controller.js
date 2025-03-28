const Applicant = require("../models/applicant.model");

// Create applicant
exports.createApplicant = async (req, res) => {
  try {
    const data = await Applicant.create(req.body);
    res.status(201).json({ message: "Applicant created successfully", data });
  } catch (err) {
    console.error("Error creating applicant:", err);
    res.status(500).json({ error: err.message || "Error creating applicant" });
  }
};

// Get all applicants
exports.getAllApplicants = async (req, res) => {
  try {
    const data = await Applicant.findAll();
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching applicants:", err);
    res.status(500).json({ error: err.message || "Error retrieving applicants" });
  }
};

// Update applicant by ID
exports.updateApplicant = async (req, res) => {
  const id = req.params.id;
  const updatedFields = req.body;

  try {
    const data = await Applicant.update(id, updatedFields);
    res.status(200).json({ message: "Applicant updated successfully", data });
  } catch (err) {
    console.error("Error updating applicant:", err);
    const code = err.message?.includes("not found") ? 404 : 500;
    res.status(code).json({ error: err.message || "Error updating applicant" });
  }
};

// Delete applicant by ID
exports.deleteApplicant = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await Applicant.delete(id);
    res.status(200).json(data);
  } catch (err) {
    console.error("Error deleting applicant:", err);
    const code = err.message?.includes("not found") ? 404 : 500;
    res.status(code).json({ error: err.message || "Error deleting applicant" });
  }
};
