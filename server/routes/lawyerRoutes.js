const express = require('express');
const router = express.Router();
const Lawyer = require('../models/Lawyer');

// ─── Routes ───────────────────────────────────────────────────────────────────

// GET /api/lawyers – list & filter verified lawyers
router.get('/', async (req, res) => {
    try {
        const { search = '', specialization = 'all', location = 'all', page = 1, limit = 12 } = req.query;

        const query = {};

        if (search) {
            query.$or = [
                { Name: { $regex: search, $options: 'i' } },
                { "Practice Areas": { $regex: search, $options: 'i' } },
                { Location: { $regex: search, $options: 'i' } }
            ];
        }

        if (specialization !== 'all') {
            query["Practice Areas"] = { $regex: specialization, $options: 'i' };
        }

        if (location !== 'all') {
            query.Location = { $regex: location, $options: 'i' };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Lawyer.countDocuments(query);
        const lawyers = await Lawyer.find(query).skip(skip).limit(parseInt(limit));

        res.json({ lawyers, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/lawyers/filters – get distinct filter values for dropdowns
router.get('/filters', async (req, res) => {
    try {
        // Fetch all lawyers to extract unique practice areas and locations
        // This could be slow for 17k records, we might want to cache or use aggregations
        // For distinct practice areas:
        const practiceAreasRaw = await Lawyer.distinct("Practice Areas");

        let specializations = new Set();
        practiceAreasRaw.forEach(area => {
            if (area) {
                // Split by '+' if it exists 'Property + 3 more' -> 'Property'
                const mainArea = area.split('+')[0].trim();
                if (mainArea) specializations.add(mainArea);
            }
        });
        specializations = [...specializations].sort();

        // For distinct locations:
        const locationsRaw = await Lawyer.distinct("Location");
        let cities = new Set();
        locationsRaw.forEach(loc => {
            if (loc) {
                // E.g 'Panchsheel Enclave, Delhi' -> 'Delhi'
                const parts = loc.split(',');
                const city = parts[parts.length - 1].trim();
                if (city) cities.add(city);
            }
        });
        cities = [...cities].sort();

        // Empty languages since we don't have it
        const languages = [];

        res.json({ specializations, languages, cities });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Empty seed function to prevent errors if import left somewhere
const seedLawyers = async () => { };

module.exports = { router, seedLawyers };
