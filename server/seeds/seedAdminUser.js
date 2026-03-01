const bcrypt = require('bcryptjs');
const AdminUser = require('../models/AdminUser');
const AppSettings = require('../models/AppSettings');

const DEFAULT_ADMIN = {
    email: 'admin@lawconnect.com',
    password: 'Admin@123!',
    name: 'Super Admin',
    role: 'super_admin'
};

const DEFAULT_HOTLINES = [
    { name: 'National Emergency', number: '112', category: 'emergency' },
    { name: 'Police', number: '100', category: 'police' },
    { name: 'Women Helpline', number: '1091', category: 'women' },
    { name: 'Child Helpline', number: '1098', category: 'child' },
    { name: 'Legal Aid Services', number: '15100', category: 'legal' },
    { name: 'National Commission for Women', number: '7827170170', category: 'women' },
    { name: 'Domestic Violence Helpline', number: '181', category: 'domestic' },
    { name: 'Cyber Crime Helpline', number: '1930', category: 'cyber' }
];

async function seedAdminUser() {
    try {
        const existing = await AdminUser.findOne({ email: DEFAULT_ADMIN.email });
        if (!existing) {
            const passwordHash = await bcrypt.hash(DEFAULT_ADMIN.password, 12);
            await AdminUser.create({
                email: DEFAULT_ADMIN.email,
                passwordHash,
                name: DEFAULT_ADMIN.name,
                role: DEFAULT_ADMIN.role,
                isActive: true
            });
            console.log('✅ Default Super Admin created: admin@lawconnect.com / Admin@123!');
        }

        const settings = await AppSettings.findOne();
        if (!settings) {
            await AppSettings.create({ emergencyHotlines: DEFAULT_HOTLINES });
            console.log('✅ Default AppSettings created with emergency hotlines');
        }
    } catch (err) {
        console.error('❌ Error seeding admin user:', err);
    }
}

module.exports = seedAdminUser;
