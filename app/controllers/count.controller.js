const db = require("../models");

exports.getCounts = async (req, res) => {
  try {
    const totalApplicants = await countQuery("SELECT COUNT(*) AS count FROM applicants");
    const totalEmployees = await countQuery("SELECT COUNT(*) AS count FROM applicants"); 
    const totalPassed = await countQuery("SELECT COUNT(*) AS count FROM applicants WHERE status = 'Passed'");
    const totalDroppedOut = await countQuery("SELECT COUNT(*) AS count FROM applicants WHERE status = 'Dropped Out'");

    res.status(200).json({
      totalApplicants,
      totalEmployees,
      totalPassed,
      totalDroppedOut,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const countQuery = async (sql) => {
  const [rows] = await db.execute(sql);
  return rows[0].count;
};
