const express = require('express');
const router = express.Router();
const Lawyer = require('../models/Lawyer');

// ─── Seed Data ────────────────────────────────────────────────────────────────
const SEED_LAWYERS = [
    {
        name: 'Adv. Priya Nair',
        specializations: ['Family Law', 'Property Dispute', 'Divorce'],
        experience: 12,
        languages: ['Malayalam', 'English', 'Hindi'],
        location: { city: 'Kochi', state: 'Kerala' },
        barCouncilId: 'KER/2012/4521',
        verified: true,
        bio: 'Experienced family law practitioner with expertise in divorce proceedings, child custody, and property disputes in Kerala High Court.',
        contactEmail: 'priya.nair@lawconnect.in',
        phone: '+91-9400000001',
        rating: 4.8,
        casesSolved: 320
    },
    {
        name: 'Adv. Rajesh Kumar',
        specializations: ['Criminal Law', 'Bail Matters', 'POCSO'],
        experience: 18,
        languages: ['Hindi', 'English'],
        location: { city: 'New Delhi', state: 'Delhi' },
        barCouncilId: 'DEL/2006/1122',
        verified: true,
        bio: 'Senior criminal defense attorney with over 18 years at the Delhi High Court and Supreme Court.',
        contactEmail: 'rajesh.kumar@lawconnect.in',
        phone: '+91-9811000002',
        rating: 4.9,
        casesSolved: 650
    },
    {
        name: 'Adv. Sunita Menon',
        specializations: ['Consumer Rights', 'RERA', 'Civil'],
        experience: 9,
        languages: ['Malayalam', 'English'],
        location: { city: 'Thiruvananthapuram', state: 'Kerala' },
        barCouncilId: 'KER/2015/7733',
        verified: true,
        bio: 'Consumer rights specialist with extensive SCDRC and NCDRC experience. RERA disputes handled professionally.',
        contactEmail: 'sunita.menon@lawconnect.in',
        phone: '+91-9400000003',
        rating: 4.7,
        casesSolved: 210
    },
    {
        name: 'Adv. Mohammed Farhan',
        specializations: ['Cyber Crime', 'IT Law', 'Data Privacy'],
        experience: 7,
        languages: ['English', 'Hindi', 'Malayalam'],
        location: { city: 'Bengaluru', state: 'Karnataka' },
        barCouncilId: 'KAR/2017/3344',
        verified: true,
        bio: 'Tech-savvy advocate specializing in cybercrime cases, IT Act offences, and online fraud disputes.',
        contactEmail: 'farhan@lawconnect.in',
        phone: '+91-9980000004',
        rating: 4.6,
        casesSolved: 145
    },
    {
        name: 'Adv. Kavitha Suresh',
        specializations: ['Employment Law', 'Labour Disputes', 'POSH'],
        experience: 11,
        languages: ['Tamil', 'English', 'Hindi'],
        location: { city: 'Chennai', state: 'Tamil Nadu' },
        barCouncilId: 'TN/2013/5566',
        verified: true,
        bio: 'Champion of employee rights with deep expertise in labour arbitration, POSH act cases, and wrongful termination.',
        contactEmail: 'kavitha.suresh@lawconnect.in',
        phone: '+91-9444000005',
        rating: 4.7,
        casesSolved: 290
    },
    {
        name: 'Adv. Arun Sharma',
        specializations: ['Property Dispute', 'Civil', 'Land Acquisition'],
        experience: 22,
        languages: ['Hindi', 'English'],
        location: { city: 'Lucknow', state: 'Uttar Pradesh' },
        barCouncilId: 'UP/2002/0089',
        verified: true,
        bio: 'Veteran property litigation expert practicing at Allahabad High Court for over two decades.',
        contactEmail: 'arun.sharma@lawconnect.in',
        phone: '+91-9451000006',
        rating: 4.8,
        casesSolved: 780
    },
    {
        name: 'Adv. Deepa Thomas',
        specializations: ['Family Law', 'Women\'s Rights', 'Domestic Violence'],
        experience: 8,
        languages: ['Malayalam', 'English'],
        location: { city: 'Thrissur', state: 'Kerala' },
        barCouncilId: 'KER/2016/8812',
        verified: true,
        bio: 'Passionate advocate for women\'s rights with experience in Protection of Women from Domestic Violence Act cases.',
        contactEmail: 'deepa.thomas@lawconnect.in',
        phone: '+91-9400000007',
        rating: 4.9,
        casesSolved: 185
    },
    {
        name: 'Adv. Vikram Patel',
        specializations: ['Corporate Law', 'Contracts', 'Mergers & Acquisitions'],
        experience: 15,
        languages: ['Gujarati', 'English', 'Hindi'],
        location: { city: 'Mumbai', state: 'Maharashtra' },
        barCouncilId: 'MH/2009/2233',
        verified: true,
        bio: 'Corporate counsel with a track record of handling complex M&A transactions and commercial disputes.',
        contactEmail: 'vikram.patel@lawconnect.in',
        phone: '+91-9820000008',
        rating: 4.8,
        casesSolved: 430
    },
    {
        name: 'Adv. Ananya Krishnan',
        specializations: ['Environment Law', 'NGT Matters', 'Civil'],
        experience: 6,
        languages: ['Malayalam', 'Tamil', 'English'],
        location: { city: 'Kochi', state: 'Kerala' },
        barCouncilId: 'KER/2018/9944',
        verified: true,
        bio: 'Environmental law advocate with expertise in National Green Tribunal proceedings and pollution cases.',
        contactEmail: 'ananya.krishnan@lawconnect.in',
        phone: '+91-9400000009',
        rating: 4.5,
        casesSolved: 90
    },
    {
        name: 'Adv. Sameer Joshi',
        specializations: ['Criminal Law', 'Bail', 'White-Collar Crime'],
        experience: 14,
        languages: ['Marathi', 'Hindi', 'English'],
        location: { city: 'Pune', state: 'Maharashtra' },
        barCouncilId: 'MH/2010/3377',
        verified: true,
        bio: 'Criminal defense specialist handling bail matters, fraud cases, and financial crimes at Bombay High Court.',
        contactEmail: 'sameer.joshi@lawconnect.in',
        phone: '+91-9823000010',
        rating: 4.6,
        casesSolved: 340
    },
    {
        name: 'Adv. Leela Devi',
        specializations: ['Family Law', 'Succession', 'Will Disputes'],
        experience: 20,
        languages: ['Hindi', 'English'],
        location: { city: 'Jaipur', state: 'Rajasthan' },
        barCouncilId: 'RAJ/2004/0455',
        verified: true,
        bio: 'Senior practitioner specializing in succession law, inheritance disputes, and will contestations.',
        contactEmail: 'leela.devi@lawconnect.in',
        phone: '+91-9413000011',
        rating: 4.7,
        casesSolved: 560
    },
    {
        name: 'Adv. Biju Varghese',
        specializations: ['Motor Accident Claims', 'Insurance', 'Civil'],
        experience: 10,
        languages: ['Malayalam', 'English'],
        location: { city: 'Kozhikode', state: 'Kerala' },
        barCouncilId: 'KER/2014/6623',
        verified: true,
        bio: 'Specialist in MACT claims and insurance disputes with a high success rate in compensation recovery.',
        contactEmail: 'biju.varghese@lawconnect.in',
        phone: '+91-9400000012',
        rating: 4.6,
        casesSolved: 275
    },
    {
        name: 'Adv. Neha Agarwal',
        specializations: ['Consumer Rights', 'Banking & Finance', 'Recovery'],
        experience: 5,
        languages: ['Hindi', 'English'],
        location: { city: 'Hyderabad', state: 'Telangana' },
        barCouncilId: 'TS/2019/1155',
        verified: true,
        bio: 'Young and dynamic advocate focused on consumer rights, NPA recovery cases, and Debt Recovery Tribual (DRT) matters.',
        contactEmail: 'neha.agarwal@lawconnect.in',
        phone: '+91-9000000013',
        rating: 4.4,
        casesSolved: 80
    },
    {
        name: 'Adv. George Mathew',
        specializations: ['Tax Law', 'GST', 'Income Tax'],
        experience: 17,
        languages: ['Malayalam', 'English'],
        location: { city: 'Ernakulam', state: 'Kerala' },
        barCouncilId: 'KER/2007/3001',
        verified: true,
        bio: 'Tax advocate with extensive practice before ITAT, GST appellate authorities and High Court.',
        contactEmail: 'george.mathew@lawconnect.in',
        phone: '+91-9400000014',
        rating: 4.8,
        casesSolved: 495
    },
    {
        name: 'Adv. Nalini Iyer',
        specializations: ['Property Dispute', 'Revenue Law', 'Civil'],
        experience: 13,
        languages: ['Tamil', 'English', 'Hindi'],
        location: { city: 'Coimbatore', state: 'Tamil Nadu' },
        barCouncilId: 'TN/2011/7890',
        verified: true,
        bio: 'Property and revenue law expert handling patta transfers, encumbrance certificates, and title disputes.',
        contactEmail: 'nalini.iyer@lawconnect.in',
        phone: '+91-9443000015',
        rating: 4.7,
        casesSolved: 380
    }
];

// ─── Seed function (called on server start) ────────────────────────────────────
async function seedLawyers() {
    try {
        const count = await Lawyer.countDocuments();
        if (count === 0) {
            await Lawyer.insertMany(SEED_LAWYERS);
            console.log('✅ Lawyer directory seeded with', SEED_LAWYERS.length, 'entries');
        }
    } catch (err) {
        console.error('⚠️  Lawyer seed error:', err.message);
    }
}

// ─── Routes ───────────────────────────────────────────────────────────────────

// GET /api/lawyers – list & filter verified lawyers
router.get('/', async (req, res) => {
    try {
        const { search = '', specialization = 'all', language = 'all', location = 'all', page = 1, limit = 12 } = req.query;

        const query = { verified: true };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { specializations: { $regex: search, $options: 'i' } },
                { 'location.city': { $regex: search, $options: 'i' } },
                { bio: { $regex: search, $options: 'i' } }
            ];
        }

        if (specialization !== 'all') {
            query.specializations = { $regex: specialization, $options: 'i' };
        }

        if (language !== 'all') {
            query.languages = { $regex: language, $options: 'i' };
        }

        if (location !== 'all') {
            query.$or = query.$or || [];
            query['location.city'] = { $regex: location, $options: 'i' };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Lawyer.countDocuments(query);
        const lawyers = await Lawyer.find(query).sort({ rating: -1, experience: -1 }).skip(skip).limit(parseInt(limit));

        res.json({ lawyers, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/lawyers/filters – get distinct filter values for dropdowns
router.get('/filters', async (req, res) => {
    try {
        const lawyers = await Lawyer.find({ verified: true }, 'specializations languages location');
        const specializations = [...new Set(lawyers.flatMap(l => l.specializations))].sort();
        const languages = [...new Set(lawyers.flatMap(l => l.languages))].sort();
        const cities = [...new Set(lawyers.map(l => l.location?.city).filter(Boolean))].sort();
        res.json({ specializations, languages, cities });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = { router, seedLawyers };
