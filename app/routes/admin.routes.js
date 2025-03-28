const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

router.post('/', adminController.createAdmin);
router.get('/', adminController.getAllAdmin);
router.put('/:id', adminController.updateAdmin);


module.exports = router;