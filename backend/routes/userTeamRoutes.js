const express = require('express');
const userTeamController = require('../controllers/userTeamController');
const router = express.Router();

router.get('/', userTeamController.getAllUserTeams);
router.get('/:id', userTeamController.getUserTeamById);
router.post('/', userTeamController.createUserTeam);
router.put('/:id', userTeamController.updateUserTeam);
router.delete('/:id', userTeamController.deleteUserTeam);

module.exports = router;
