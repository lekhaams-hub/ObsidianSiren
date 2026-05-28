const express = require('express');
const router = express.Router();

const { getDrafts, saveDraft } = require('../controllers/draftController');

router.get('/', getDrafts);
router.post('/', saveDraft);

module.exports = router;