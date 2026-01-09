const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const Document = require('../models/Document');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Upload a document
// @route   POST /api/documents/upload
// @access  Private (Needs firebaseUid in body for now as simple auth)
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { firebaseUid, category, tags, isPasswordProtected, password } = req.body;

        if (!firebaseUid) {
            return res.status(401).json({ message: 'Unauthorized: No user ID provided' });
        }

        // Find user by firebaseUid
        const user = await User.findOne({ firebaseUid });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let passwordHash = undefined;
        if (isPasswordProtected === 'true' && password) {
            const salt = await bcrypt.genSalt(10);
            passwordHash = await bcrypt.hash(password, salt);
        }

        const doc = new Document({
            userId: user._id,
            name: req.file.originalname,
            fileType: req.file.mimetype.split('/')[1].toUpperCase(), // e.g., 'PDF' from 'application/pdf'
            size: req.file.size,
            data: req.file.buffer,
            category: category || 'Uncategorized',
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            isPasswordProtected: isPasswordProtected === 'true',
            password: passwordHash
        });

        await doc.save();

        res.status(201).json({
            _id: doc._id,
            name: doc.name,
            category: doc.category,
            fileType: doc.fileType,
            size: doc.size,
            uploadDate: doc.uploadDate,
            tags: doc.tags,
            isPasswordProtected: doc.isPasswordProtected
        });

    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all documents for a user
// @route   GET /api/documents
// @access  Private
router.get('/', async (req, res) => {
    try {
        const { firebaseUid } = req.query;

        if (!firebaseUid) {
            return res.status(401).json({ message: 'Unauthorized: No user ID provided' });
        }

        const user = await User.findOne({ firebaseUid });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const documents = await Document.find({ userId: user._id })
            .select('-data -password') // Exclude binary data and password for list view
            .sort({ uploadDate: -1 });

        res.json(documents);
    } catch (error) {
        console.error('Fetch Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Download a document
// @route   GET /api/documents/:id
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const { firebaseUid, password } = req.query;
        if (!firebaseUid) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await User.findOne({ firebaseUid });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const doc = await Document.findById(req.params.id);

        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }

        if (doc.userId.toString() !== user._id.toString()) {
            return res.status(401).json({ message: 'Unauthorized access to this document' });
        }

        // Check password protection
        if (doc.isPasswordProtected) {
            if (!password) {
                return res.status(403).json({ message: 'Password required' });
            }
            const isMatch = await bcrypt.compare(password, doc.password);
            if (!isMatch) {
                return res.status(403).json({ message: 'Incorrect password' });
            }
        }

        res.set({
            'Content-Type': doc.fileType === 'PDF' ? 'application/pdf' : 'application/octet-stream',
            'Content-Disposition': `inline; filename="${doc.name}"`
        });

        res.send(doc.data);
    } catch (error) {
        console.error('Download Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Delete a document
// @route   DELETE /api/documents/:id
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const { firebaseUid } = req.query; // Authenticate request
        if (!firebaseUid) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await User.findOne({ firebaseUid });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const doc = await Document.findById(req.params.id);
        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }

        if (doc.userId.toString() !== user._id.toString()) {
            return res.status(401).json({ message: 'Unauthorized access to this document' });
        }

        await doc.deleteOne();
        res.json({ message: 'Document removed' });
    } catch (error) {
        console.error('Delete Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update a document
// @route   PUT /api/documents/:id
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        const { firebaseUid, name, category, tags } = req.body;

        if (!firebaseUid) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await User.findOne({ firebaseUid });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const doc = await Document.findById(req.params.id);

        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }

        if (doc.userId.toString() !== user._id.toString()) {
            return res.status(401).json({ message: 'Unauthorized access to this document' });
        }

        doc.name = name || doc.name;
        doc.category = category || doc.category;
        doc.tags = tags ? tags.split(',').map(tag => tag.trim()) : doc.tags;

        const updatedDoc = await doc.save();

        res.json({
            _id: updatedDoc._id,
            name: updatedDoc.name,
            category: updatedDoc.category,
            fileType: updatedDoc.fileType,
            size: updatedDoc.size,
            uploadDate: updatedDoc.uploadDate,
            tags: updatedDoc.tags,
            isPasswordProtected: updatedDoc.isPasswordProtected,
            updatedAt: updatedDoc.updatedAt
        });

    } catch (error) {
        console.error('Update Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
