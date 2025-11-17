const express = require('express');
const router = express.Router();
const LedgerController = require('../controllers/ledgerController');
const { verifyToken } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(verifyToken);

// Ledger routes
router.get('/party/:partyId', LedgerController.getPartyLedger);
router.post('/entry', LedgerController.addLedgerEntry);
router.get('/parties', LedgerController.getAllPartiesWithBalances);
router.get('/summary', LedgerController.getLedgerSummary);
router.delete('/entry/:id', LedgerController.deleteLedgerEntry);
router.get('/party/:partyId/export/pdf', LedgerController.exportLedgerPDF);

module.exports = router;
