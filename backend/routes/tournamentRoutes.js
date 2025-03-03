const express = require('express');
const tournamentController = require('../controllers/tournamentController');
const router = express.Router();

router.get('/', tournamentController.getAllTournaments);
router.get('/:id', tournamentController.getTournamentById);
router.post('/', tournamentController.createTournament);
router.put('/:id', tournamentController.updateTournament);
router.delete('/:id', tournamentController.deleteTournament);

module.exports = router;
