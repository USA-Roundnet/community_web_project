const express = require('express');
const userOrganizationController = require('../controllers/userOrganizationController');
const router = express.Router();

router.get('/', userOrganizationController.getAllUserOrganizations);
router.get('/:id', userOrganizationController.getUserOrganizationById);
router.post('/', userOrganizationController.createUserOrganization);
router.put('/:id', userOrganizationController.updateUserOrganization);
router.delete('/:id', userOrganizationController.deleteUserOrganization);

module.exports = router;
