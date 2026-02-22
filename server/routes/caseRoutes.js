const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Case = require('../models/Case');
const ActivityLog = require('../models/ActivityLog');

// ─── Helper ──────────────────────────────────────────────────────────────────
async function getUser(firebaseUid, res) {
    if (!firebaseUid) {
        res.status(401).json({ message: 'Unauthorized' });
        return null;
    }
    const user = await User.findOne({ firebaseUid });
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return null;
    }
    return user;
}

// Normalise status string → lowercase (frontend sends 'Active', DB stores 'active')
function normaliseStatus(s) {
    if (!s) return 'active';
    const map = {
        active: 'active', Active: 'active',
        pending: 'pending', Pending: 'pending',
        completed: 'completed', Completed: 'completed',
        'on-hold': 'on-hold', 'On Hold': 'on-hold', onhold: 'on-hold',
        resolved: 'resolved', Resolved: 'resolved',
        closed: 'closed', Closed: 'closed'
    };
    return map[s] || 'active';
}

// ─── GET all cases ────────────────────────────────────────────────────────────
// GET /api/cases?firebaseUid=...
router.get('/', async (req, res) => {
    try {
        const user = await getUser(req.query.firebaseUid, res);
        if (!user) return;
        const cases = await Case.find({ userId: user._id }).sort({ createdAt: -1 });
        res.json(cases);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// ─── CREATE case ─────────────────────────────────────────────────────────────
// POST /api/cases
router.post('/', async (req, res) => {
    try {
        const {
            firebaseUid, title, description, status, category, priority,
            urgentDeadline, startDate, deadlineDate, nextActionDate,
            completionPercentage, isManualProgress, milestones
        } = req.body;

        const user = await getUser(firebaseUid, res);
        if (!user) return;

        const newCase = new Case({
            userId: user._id,
            title,
            description: description || '',
            status: normaliseStatus(status),
            category: category || 'Other',
            priority: priority || 'Medium',
            urgentDeadline: urgentDeadline || false,
            startDate: startDate ? new Date(startDate) : new Date(),
            deadlineDate: deadlineDate ? new Date(deadlineDate) : undefined,
            nextActionDate: nextActionDate ? new Date(nextActionDate) : undefined,
            isManualProgress: isManualProgress || false,
            completionPercentage: isManualProgress ? (completionPercentage || 0) : 0,
            milestones: milestones || []
        });

        // Auto-generate default milestones if none provided
        if (!milestones || milestones.length === 0) {
            const templates = {
                'Property Dispute': [
                    { title: 'Initial Consultation', description: 'Meeting with legal counsel to assess property documents', daysOffset: 0 },
                    { title: 'Legal Notice Sent', description: 'Formal notice sent to opposing party', daysOffset: 7 },
                    { title: 'Response Period', description: 'Waiting period for counter-party response', daysOffset: 37 },
                    { title: 'File Civil Suit', description: 'Filing of suit if no favorable response received', daysOffset: 50 }
                ],
                'Consumer Rights': [
                    { title: 'Complaint Filed', description: 'Filing complaint with Consumer Forum', daysOffset: 0 },
                    { title: 'Evidence Submission', description: 'Submission of invoices and correspondence', daysOffset: 14 },
                    { title: 'First Hearing', description: 'Initial hearing and admission of case', daysOffset: 30 },
                    { title: 'Mediation Session', description: 'Court-mandated mediation attempt', daysOffset: 45 }
                ],
                'Employment': [
                    { title: 'Document Collection', description: 'Gathering employment contracts and termination letters', daysOffset: 0 },
                    { title: 'Legal Consultation', description: 'Review of case merits with labor lawyer', daysOffset: 5 },
                    { title: 'Conciliation Notice', description: 'Notice for conciliation proceedings', daysOffset: 14 },
                    { title: 'Labor Court Filing', description: 'Filing dispute with Labor Commissioner', daysOffset: 30 }
                ],
                'Family Law': [
                    { title: 'Counseling Session', description: 'Mandatory pre-litigation counseling', daysOffset: 0 },
                    { title: 'Petition Filing', description: 'Filing of petition in Family Court', daysOffset: 10 },
                    { title: 'Appearance of Party', description: 'First appearance of respondent', daysOffset: 30 },
                    { title: 'Interim Relief', description: 'Hearing for interim maintenance/custody', daysOffset: 45 }
                ]
            };

            const template = templates[category] || [
                { title: 'Case Review', description: 'Initial review of facts and evidence', daysOffset: 0 },
                { title: 'Strategy Planning', description: 'Formulating legal strategy', daysOffset: 7 },
                { title: 'First Action', description: 'Initiating formal legal action', daysOffset: 14 },
                { title: 'Checkpoint', description: 'Review of progress and next steps', daysOffset: 30 }
            ];

            const base = newCase.startDate;
            newCase.milestones = template.map((item, idx) => {
                const due = new Date(base);
                due.setDate(due.getDate() + item.daysOffset);
                return {
                    title: item.title,
                    description: item.description,
                    dueDate: due,
                    completed: false,
                    status: idx === 0 ? 'current' : 'upcoming',
                    documents: []
                };
            });

            // Set nextActionDate to first milestone's dueDate
            if (newCase.milestones.length > 0) {
                newCase.nextActionDate = newCase.milestones[0].dueDate;
            }
        }

        await newCase.save();

        await ActivityLog.create({
            userId: user._id,
            type: 'case',
            title: `New Case Created: ${title}`,
            description: description || `Category: ${category || 'Other'}`,
            link: '/legal-timeline-tracker',
            icon: 'FolderOpen',
            iconColor: 'var(--color-primary)'
        });

        res.status(201).json(newCase);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// ─── UPDATE case ─────────────────────────────────────────────────────────────
// PUT /api/cases/:id
router.put('/:id', async (req, res) => {
    try {
        const {
            firebaseUid, title, description, status, category, priority,
            urgentDeadline, deadlineDate, nextActionDate, startDate,
            completionPercentage, isManualProgress, milestones
        } = req.body;

        const user = await getUser(firebaseUid, res);
        if (!user) return;

        const caseDoc = await Case.findOne({ _id: req.params.id, userId: user._id });
        if (!caseDoc) return res.status(404).json({ message: 'Case not found' });

        if (title !== undefined) caseDoc.title = title;
        if (description !== undefined) caseDoc.description = description;
        if (status !== undefined) caseDoc.status = normaliseStatus(status);
        if (category !== undefined) caseDoc.category = category;
        if (priority !== undefined) caseDoc.priority = priority;
        if (urgentDeadline !== undefined) caseDoc.urgentDeadline = urgentDeadline;
        if (deadlineDate !== undefined) caseDoc.deadlineDate = deadlineDate ? new Date(deadlineDate) : undefined;
        if (nextActionDate !== undefined) caseDoc.nextActionDate = nextActionDate ? new Date(nextActionDate) : undefined;
        if (startDate !== undefined) caseDoc.startDate = new Date(startDate);
        if (isManualProgress !== undefined) caseDoc.isManualProgress = isManualProgress;
        if (milestones !== undefined) caseDoc.milestones = milestones;

        // Handle completionPercentage
        if (isManualProgress && completionPercentage !== undefined) {
            caseDoc.completionPercentage = completionPercentage;
        } else if (!caseDoc.isManualProgress) {
            caseDoc.recalcProgress();
        }

        const updated = await caseDoc.save();

        await ActivityLog.create({
            userId: user._id,
            type: 'case',
            title: `Case Updated: ${caseDoc.title}`,
            description: `Status: ${caseDoc.status}`,
            link: '/legal-timeline-tracker',
            icon: 'FolderOpen',
            iconColor: 'var(--color-primary)'
        });

        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// ─── TOGGLE milestone ─────────────────────────────────────────────────────────
// PUT /api/cases/:id/milestones  { firebaseUid, milestoneId, completed }
router.put('/:id/milestones', async (req, res) => {
    try {
        const { firebaseUid, milestoneId, completed } = req.body;
        const user = await getUser(firebaseUid, res);
        if (!user) return;

        const caseDoc = await Case.findOne({ _id: req.params.id, userId: user._id });
        if (!caseDoc) return res.status(404).json({ message: 'Case not found' });

        const milestone = caseDoc.milestones.id(milestoneId);
        if (!milestone) return res.status(404).json({ message: 'Milestone not found' });

        milestone.completed = completed;
        milestone.completedAt = completed ? new Date() : undefined;
        milestone.status = completed ? 'completed' : 'upcoming';

        // Re-derive statuses: first incomplete milestone is 'current'
        let foundCurrent = false;
        caseDoc.milestones.forEach(m => {
            if (!m.completed && !foundCurrent) {
                m.status = 'current';
                foundCurrent = true;
            } else if (!m.completed) {
                m.status = 'upcoming';
            }
        });

        caseDoc.recalcProgress();
        const updated = await caseDoc.save();

        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// ─── ADD custom milestone ─────────────────────────────────────────────────────
// POST /api/cases/:id/milestones  { firebaseUid, title, description, dueDate }
router.post('/:id/milestones', async (req, res) => {
    try {
        const { firebaseUid, title, description, dueDate } = req.body;
        const user = await getUser(firebaseUid, res);
        if (!user) return;

        const caseDoc = await Case.findOne({ _id: req.params.id, userId: user._id });
        if (!caseDoc) return res.status(404).json({ message: 'Case not found' });

        const newMilestone = {
            title,
            description: description || '',
            dueDate: dueDate ? new Date(dueDate) : undefined,
            completed: false,
            status: 'upcoming',
            documents: []
        };

        caseDoc.milestones.push(newMilestone);
        caseDoc.recalcProgress();
        const updated = await caseDoc.save();

        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// ─── ADD note ────────────────────────────────────────────────────────────────
// POST /api/cases/:id/notes  { firebaseUid, text }
router.post('/:id/notes', async (req, res) => {
    try {
        const { firebaseUid, text } = req.body;
        const user = await getUser(firebaseUid, res);
        if (!user) return;

        const caseDoc = await Case.findOne({ _id: req.params.id, userId: user._id });
        if (!caseDoc) return res.status(404).json({ message: 'Case not found' });

        caseDoc.notes.unshift({ text, createdAt: new Date() });
        const updated = await caseDoc.save();

        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// ─── DELETE case ─────────────────────────────────────────────────────────────
// DELETE /api/cases/:id?firebaseUid=...
router.delete('/:id', async (req, res) => {
    try {
        const user = await getUser(req.query.firebaseUid, res);
        if (!user) return;

        const caseDoc = await Case.findOne({ _id: req.params.id, userId: user._id });
        if (!caseDoc) return res.status(404).json({ message: 'Case not found' });

        await caseDoc.deleteOne();

        await ActivityLog.create({
            userId: user._id,
            type: 'case',
            title: `Case Deleted: ${caseDoc.title}`,
            description: `Category: ${caseDoc.category}`,
            link: '/legal-timeline-tracker',
            icon: 'Trash2',
            iconColor: 'var(--color-accent)'
        });

        res.json({ message: 'Case removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
