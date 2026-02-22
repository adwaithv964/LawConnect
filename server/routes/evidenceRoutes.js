const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const multer = require('multer');
const Evidence = require('../models/Evidence');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

// ─── Multer (memory storage — same as Document Vault) ───────────────────────
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
    fileFilter: (req, file, cb) => {
        const allowed = [
            'image/', 'video/',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain'
        ];
        const ok = allowed.some(t => file.mimetype.startsWith(t));
        ok ? cb(null, true) : cb(new Error('Unsupported file type'));
    }
});

// ─── Encryption helpers ───────────────────────────────────────────────────────
const ALGO = 'aes-256-gcm';

function deriveKey(userId) {
    const secret = process.env.ENCRYPTION_SECRET || 'LawConnectDefaultSecret32chars!!';
    // PBKDF2: deterministic key per user, never stored
    return crypto.pbkdf2Sync(secret, userId.toString(), 100_000, 32, 'sha256');
}

function encrypt(buffer, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGO, key, iv);
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return { encrypted, iv: iv.toString('hex'), authTag: authTag.toString('hex') };
}

function decrypt(encryptedBuffer, key, ivHex, authTagHex) {
    const decipher = crypto.createDecipheriv(ALGO, key, Buffer.from(ivHex, 'hex'));
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
    return Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
}

function sha256(buffer) {
    return crypto.createHash('sha256').update(buffer).digest('hex');
}

function detectMediaType(mimeType) {
    if (mimeType.startsWith('image/')) return 'photo';
    if (mimeType.startsWith('video/')) return 'video';
    return 'document';
}

// ─── POST /api/evidence/upload ────────────────────────────────────────────────
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const { firebaseUid, description = '', tags = '', caseRef = '' } = req.body;
        if (!firebaseUid) return res.status(401).json({ message: 'Unauthorized' });

        const user = await User.findOne({ firebaseUid });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const originalBuffer = req.file.buffer;
        const hash = sha256(originalBuffer);
        const key = deriveKey(user._id);
        const { encrypted, iv, authTag } = encrypt(originalBuffer, key);

        const evidence = await Evidence.create({
            userId: user._id,
            name: req.file.originalname,
            mediaType: detectMediaType(req.file.mimetype),
            mimeType: req.file.mimetype,
            size: req.file.size,
            description,
            tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
            caseRef,
            encryptedData: encrypted,
            iv,
            authTag,
            sha256Hash: hash,
            timestampedAt: new Date()
        });

        await ActivityLog.create({
            userId: user._id,
            type: 'document',
            title: `Evidence Uploaded: ${req.file.originalname}`,
            description: `SHA-256: ${hash.slice(0, 16)}… · ${(req.file.size / 1024).toFixed(1)} KB`,
            link: '/evidence-locker',
            icon: 'ShieldCheck',
            iconColor: 'var(--color-success)'
        });

        res.status(201).json({
            _id: evidence._id,
            name: evidence.name,
            mediaType: evidence.mediaType,
            mimeType: evidence.mimeType,
            size: evidence.size,
            description: evidence.description,
            tags: evidence.tags,
            caseRef: evidence.caseRef,
            sha256Hash: evidence.sha256Hash,
            timestampedAt: evidence.timestampedAt,
            createdAt: evidence.createdAt
        });
    } catch (err) {
        console.error('Evidence upload error:', err);
        res.status(500).json({ message: err.message });
    }
});

// ─── GET /api/evidence ────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
    try {
        const { firebaseUid } = req.query;
        if (!firebaseUid) return res.status(401).json({ message: 'Unauthorized' });

        const user = await User.findOne({ firebaseUid });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const list = await Evidence.find({ userId: user._id })
            .select('-encryptedData -iv -authTag') // don't send binary data in list
            .sort({ timestampedAt: -1 });

        res.json(list);
    } catch (err) {
        console.error('Evidence list error:', err);
        res.status(500).json({ message: err.message });
    }
});

// ─── GET /api/evidence/:id/download ─────────────────────────────────────────
router.get('/:id/download', async (req, res) => {
    try {
        const { firebaseUid } = req.query;
        if (!firebaseUid) return res.status(401).json({ message: 'Unauthorized' });

        const user = await User.findOne({ firebaseUid });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const ev = await Evidence.findById(req.params.id);
        if (!ev) return res.status(404).json({ message: 'Evidence not found' });
        if (ev.userId.toString() !== user._id.toString())
            return res.status(403).json({ message: 'Forbidden' });

        const key = deriveKey(user._id);
        const decrypted = decrypt(ev.encryptedData, key, ev.iv, ev.authTag);

        res.set({
            'Content-Type': ev.mimeType,
            'Content-Disposition': `attachment; filename="${ev.name}"`,
            'X-Evidence-Hash': ev.sha256Hash,
            'X-Evidence-Timestamp': ev.timestampedAt.toISOString()
        });
        res.send(decrypted);
    } catch (err) {
        console.error('Evidence download error:', err);
        res.status(500).json({ message: err.message });
    }
});

// ─── GET /api/evidence/:id/verify ────────────────────────────────────────────
// Decrypts and re-computes SHA-256 — compares against stored hash
router.get('/:id/verify', async (req, res) => {
    try {
        const { firebaseUid } = req.query;
        if (!firebaseUid) return res.status(401).json({ message: 'Unauthorized' });

        const user = await User.findOne({ firebaseUid });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const ev = await Evidence.findById(req.params.id);
        if (!ev) return res.status(404).json({ message: 'Evidence not found' });
        if (ev.userId.toString() !== user._id.toString())
            return res.status(403).json({ message: 'Forbidden' });

        const key = deriveKey(user._id);
        const decrypted = decrypt(ev.encryptedData, key, ev.iv, ev.authTag);
        const currentHash = sha256(decrypted);
        const intact = currentHash === ev.sha256Hash;

        res.json({
            intact,
            storedHash: ev.sha256Hash,
            currentHash,
            timestampedAt: ev.timestampedAt
        });
    } catch (err) {
        console.error('Evidence verify error:', err);
        res.status(500).json({ message: err.message });
    }
});

// ─── DELETE /api/evidence/:id ─────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
    try {
        const { firebaseUid } = req.query;
        if (!firebaseUid) return res.status(401).json({ message: 'Unauthorized' });

        const user = await User.findOne({ firebaseUid });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const ev = await Evidence.findById(req.params.id);
        if (!ev) return res.status(404).json({ message: 'Evidence not found' });
        if (ev.userId.toString() !== user._id.toString())
            return res.status(403).json({ message: 'Forbidden' });

        await ev.deleteOne();
        res.json({ message: 'Evidence deleted' });
    } catch (err) {
        console.error('Evidence delete error:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
