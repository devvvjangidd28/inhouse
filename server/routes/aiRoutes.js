const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/generate-event-plan', aiController.generateEventPlan);

router.post('/generate-poster/:eventId', aiController.generatePoster);

router.post('/generate-email/:eventId', aiController.generateEmailDraft);

router.post('/generate-instagram/:eventId', aiController.generateInstagramCaption);

router.post('/generate-all', aiController.generateAllContent);

module.exports = router;
