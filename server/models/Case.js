const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
}, { _id: true });

const milestoneSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    dueDate: { type: Date },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
    status: {
        type: String,
        enum: ['completed', 'current', 'upcoming'],
        default: 'upcoming'
    },
    documents: [{ type: String }]
}, { _id: true });

const caseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    status: {
        type: String,
        enum: ['active', 'pending', 'completed', 'on-hold', 'resolved', 'closed'],
        default: 'active'
    },
    category: {
        type: String,
        enum: [
            'Property Dispute',
            'Consumer Rights',
            'Family Law',
            'Employment',
            'Criminal',
            'Civil',
            'Cyber Fraud',
            'Other'
        ],
        default: 'Other'
    },
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium'
    },
    urgentDeadline: { type: Boolean, default: false },
    startDate: { type: Date, default: Date.now },
    deadlineDate: { type: Date },
    nextActionDate: { type: Date },
    completionPercentage: { type: Number, default: 0, min: 0, max: 100 },
    isManualProgress: { type: Boolean, default: false },
    milestones: [milestoneSchema],
    notes: [noteSchema]
}, { timestamps: true });

// Auto-recalculate completionPercentage from milestones (when not manual)
caseSchema.methods.recalcProgress = function () {
    if (this.isManualProgress) return;
    if (!this.milestones || this.milestones.length === 0) {
        this.completionPercentage = 0;
        return;
    }
    const completed = this.milestones.filter(m => m.completed).length;
    this.completionPercentage = Math.round((completed / this.milestones.length) * 100);

    // Auto-update case status based on progress
    if (this.completionPercentage === 100) {
        this.status = 'completed';
    } else if (this.status === 'completed') {
        // If a milestone was un-ticked, revert status back to active
        this.status = 'active';
    }
};

module.exports = mongoose.model('Case', caseSchema);
