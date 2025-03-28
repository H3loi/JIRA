const express = require('express');
const router = express.Router();
const applicantController = require('../controllers/applicant.controller');

router.post('/', applicantController.createApplicant);
router.get('/', applicantController.getAllApplicants);
router.put('/:id', applicantController.updateApplicant);
router.delete('/:id', applicantController.deleteApplicant);

module.exports = router;