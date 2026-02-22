const express = require('express');
const router = express.Router();

// ─── Official portal links ────────────────────────────────────────────────────
const PORTAL_LINKS = {
    ecourts: 'https://services.ecourts.gov.in/ecourtindiaServices/cases/case_status.php',
    scdrc: 'https://ncdrc.nic.in/case_status.html',
    ncdrc: 'https://ncdrc.nic.in/case_status.html'
};

// Mock case statuses for demonstration
const MOCK_STATUSES = [
    { status: 'Pending', nextDate: '15 Mar 2026', stage: 'Arguments', judge: 'Hon\'ble Justice S. Kumar' },
    { status: 'Disposed', nextDate: null, stage: 'Final Order', judge: 'Hon\'ble Justice R. Pillai' },
    { status: 'Pending', nextDate: '02 Apr 2026', stage: 'Evidence', judge: 'Hon\'ble Justice A. Das' },
    { status: 'Adjourned', nextDate: '28 Mar 2026', stage: 'Written Arguments', judge: 'Hon\'ble Justice P. Sharma' },
    { status: 'Reserved for Judgment', nextDate: '10 Mar 2026', stage: 'Judgment Reserved', judge: 'Hon\'ble Justice M. Nair' }
];

// POST /api/case-tracker/lookup
router.post('/lookup', async (req, res) => {
    try {
        const { caseNumber, court, year } = req.body;

        if (!caseNumber || !court) {
            return res.status(400).json({ message: 'Case number and court are required' });
        }

        // Generate a deterministic mock result based on the case number
        const hash = caseNumber.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
        const mockEntry = MOCK_STATUSES[hash % MOCK_STATUSES.length];
        const courtYear = year || new Date().getFullYear();

        const result = {
            caseNumber,
            court,
            year: courtYear,
            ...mockEntry,
            petitioner: 'As per court records',
            respondent: 'As per court records',
            filingDate: `${Math.ceil(Math.random() * 28)} Jan ${courtYear}`,
            portalLink: PORTAL_LINKS[court] || PORTAL_LINKS.ecourts,
            disclaimer: 'This is a simulated result for demonstration. Please visit the official portal to see live case status.',
            isSimulated: true
        };

        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/case-tracker/portals – list supported portals
router.get('/portals', (req, res) => {
    res.json([
        {
            id: 'ecourts',
            name: 'eCourts (District & High Court)',
            url: PORTAL_LINKS.ecourts,
            description: 'Track cases in District Courts, High Courts, and Subordinate Courts across India',
            icon: 'Scale'
        },
        {
            id: 'scdrc',
            name: 'SCDRC (State Consumer Disputes)',
            url: PORTAL_LINKS.scdrc,
            description: 'Track State Consumer Disputes Redressal Commission cases',
            icon: 'ShoppingBag'
        },
        {
            id: 'ncdrc',
            name: 'NCDRC (National Consumer Disputes)',
            url: PORTAL_LINKS.ncdrc,
            description: 'Track National Consumer Disputes Redressal Commission cases',
            icon: 'Building'
        }
    ]);
});

module.exports = router;
