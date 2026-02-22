const Article = require('../models/Article');

const SEED_ARTICLES = [
    {
        title: 'Understanding Consumer Protection Act 2019: Your Complete Guide',
        excerpt: 'Learn about your rights as a consumer under the new Consumer Protection Act 2019. This comprehensive guide covers complaint procedures, compensation claims, and e-commerce regulations.',
        content: 'The Consumer Protection Act 2019 is a landmark legislation that replaced the earlier 1986 Act. It strengthens consumer rights significantly by introducing provisions for product liability, e-commerce rules, and unfair trade practices. Key highlights include: Central Consumer Protection Authority (CCPA) for class-action complaints, mediation as an alternative dispute resolution, strict penalties for misleading advertisements, and online dispute resolution for e-commerce purchases. How to file a complaint: 1. File online at consumerhelpline.gov.in or visit the nearest Consumer Commission. 2. Attach all supporting documents (purchase receipt, warranty card, communication records). 3. State the relief you seek — refund, replacement, or compensation. The Act covers goods, services, and even digital products, giving you comprehensive protection as a modern consumer.',
        category: 'Consumer Rights',
        categoryIcon: 'ShoppingCart',
        difficulty: 'beginner',
        readTime: 8,
        image: 'https://img.rocket.new/generatedImages/rocket_gen_img_15b10e24c-1764649836727.png',
        imageAlt: 'Professional lawyer reviewing consumer protection documents at modern office desk',
        isFeatured: true,
        tags: ['consumer', 'protection', 'act 2019', 'rights', 'complaint'],
        views: 2400,
        likes: 156,
        publishDate: new Date('2025-12-15')
    },
    {
        title: 'Property Registration Process in India: Step-by-Step Documentation',
        excerpt: 'Complete walkthrough of property registration requirements, stamp duty calculations, and documentation needed for hassle-free property transfer in India.',
        content: 'Property registration in India is governed by the Registration Act 1908. Here is a step-by-step guide: 1. Sale Deed Preparation — Draft the sale deed with help of a lawyer. 2. Stamp Duty Payment — Pay stamp duty at the designated bank based on the state\'s circle rate. 3. Book Appointment — Visit the Sub-Registrar\'s Office (SRO) with both parties and two witnesses. 4. Biometric Verification — Aadhaar-based fingerprint or iris scan. 5. Document Submission — Submit the deed, identity proofs, PAN cards, and encumbrance certificate. Documents required: Sale deed (on stamp paper), Khata certificate, Encumbrance certificate (15 years), Identity & address proof, PAN card, Passport-size photos. Stamp duty typically ranges from 5-8% of the property value depending on the state.',
        category: 'Property Law',
        categoryIcon: 'Home',
        difficulty: 'intermediate',
        readTime: 12,
        image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1d59c13d7-1766513857440.png',
        imageAlt: 'Modern residential property with keys and registration documents',
        isFeatured: false,
        tags: ['property', 'registration', 'stamp duty', 'sale deed', 'India'],
        views: 1800,
        likes: 98,
        publishDate: new Date('2025-12-10')
    },
    {
        title: 'Cyber Crime Reporting: How to File FIR for Online Fraud',
        excerpt: 'Essential guide to reporting cyber crimes including online fraud, identity theft, and digital harassment. Learn about cybercrime cells and evidence preservation.',
        content: 'India\'s cyber crime reporting has been streamlined through the National Cyber Crime Reporting Portal (cybercrime.gov.in). Steps to report: 1. Visit cybercrime.gov.in and click on "Report Cyber Crime". 2. Choose the category: Financial fraud, Social media crime, or Other cyber crimes. 3. Fill in the complaint form with incident details, time, screenshots, and transaction IDs. 4. You will receive a complaint number for tracking. Types of cyber crimes you can report: Online financial fraud, UPI scams, OTP fraud, Identity theft, Cyberbullying, Sextortion, Dark web crimes. Evidence to preserve: Screenshots of messages/transactions, Bank statements, Email headers, Device logs. For urgent financial fraud, call the national helpline 1930.',
        category: 'Cyber Crimes',
        categoryIcon: 'Shield',
        difficulty: 'beginner',
        readTime: 6,
        image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1997ee4ca-1764672412138.png',
        imageAlt: 'Digital security concept showing laptop with lock icon against cyber fraud',
        isFeatured: true,
        tags: ['cyber crime', 'FIR', 'online fraud', 'cybercrime.gov.in', 'reporting'],
        views: 3100,
        likes: 203,
        publishDate: new Date('2025-12-18')
    },
    {
        title: 'Divorce Proceedings in India: Legal Process and Documentation',
        excerpt: 'Comprehensive overview of divorce laws in India covering mutual consent divorce, contested divorce, alimony, and child custody arrangements under various personal laws.',
        content: 'Divorce law in India is governed by different personal laws depending on religion. Hindu Marriage Act 1955 (Hindus, Buddhists, Sikhs, Jains), Special Marriage Act 1954 (interfaith couples), Indian Christian Marriage Act 1872, and Dissolution of Muslim Marriages Act 1939. Types of divorce: 1. Mutual Consent Divorce — Both parties agree. File petition under Section 13B of Hindu Marriage Act. There is a mandatory 6-month cooling-off period (can be waived). 2. Contested Divorce — One party files on grounds like cruelty, adultery, desertion, mental disorder, or conversion. Process: File petition → Serve notice to other party → Mediation attempt → Evidence and arguments → Court decree. For alimony, courts consider: duration of marriage, income of both parties, standard of living, and custodial arrangements. Child custody follows the best interest of the child principle.',
        category: 'Family Law',
        categoryIcon: 'Users',
        difficulty: 'advanced',
        readTime: 15,
        image: 'https://img.rocket.new/generatedImages/rocket_gen_img_108e74940-1765883810330.png',
        imageAlt: 'Family law consultation showing lawyer discussing divorce documents with client',
        isFeatured: false,
        tags: ['divorce', 'family law', 'alimony', 'custody', 'Hindu Marriage Act'],
        views: 1500,
        likes: 87,
        publishDate: new Date('2025-12-05')
    },
    {
        title: 'Right to Information Act: Filing RTI Applications Effectively',
        excerpt: 'Master the RTI process with this detailed guide covering application format, fee structure, appeal procedures, and common mistakes to avoid when seeking government information.',
        content: 'The Right to Information Act 2005 is one of India\'s most powerful citizen empowerment tools. Any citizen can request information from any public authority. How to file an RTI: 1. Identify the Public Information Officer (PIO) of the department. 2. Write a clear, specific application addressing the PIO. 3. Attach a ₹10 postal order or court fee stamp (free for BPL citizens). 4. Send by registered post or submit in person at the office. 5. The PIO must respond within 30 days (48 hours for life-threatening matters). What information can you request: Government expenditure records, Project approvals, Minutes of meetings, Service records of public servants, Any record held by public authority. Appeals: First appeal to the Appellate Officer within 30 days. Second appeal to Central/State Information Commission within 90 days. Common mistakes: Asking for documents instead of information, Unclear or overly broad questions, Sending to wrong PIO.',
        category: 'Constitutional Rights',
        categoryIcon: 'Scale',
        difficulty: 'intermediate',
        readTime: 10,
        image: 'https://images.unsplash.com/photo-1672419596694-185c04f15c6e',
        imageAlt: 'Indian constitution book with gavel and scales of justice',
        isFeatured: false,
        tags: ['RTI', 'right to information', 'government', 'transparency', 'appeal'],
        views: 2200,
        likes: 134,
        publishDate: new Date('2025-12-12')
    },
    {
        title: 'Tenant Rights and Landlord Obligations Under Rent Control Act',
        excerpt: 'Know your rights as a tenant including rent control provisions, eviction protection, maintenance responsibilities, and dispute resolution mechanisms.',
        content: 'Tenant rights in India are protected under various State Rent Control Acts. Key tenant rights: 1. Protection against arbitrary eviction — landlord cannot evict without valid grounds (non-payment, damage, owner\'s own use). 2. Fair rent — tenants cannot be charged more than the standard rent fixed by the Rent Controller. 3. Maintenance — landlord must keep the premises in habitable condition. 4. Essential services — water, electricity and other essential services cannot be cut off as a means of eviction. Landlord obligations: Provide a written rent agreement registered with the local authority. Maintain structural integrity of the premises. Return security deposit within 30 days of vacating (with interest in some states). Tenant obligations: Pay rent on time. Use the property only for the agreed purpose. Not sublet without landlord permission. Dispute resolution: Rent Controller → District Court → High Court. Model Tenancy Act 2021: A new central model act encourages states to establish Rent Authorities and fast-track dispute resolution.',
        category: 'Property Law',
        categoryIcon: 'Home',
        difficulty: 'beginner',
        readTime: 7,
        image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1c1faee94-1766513859689.png',
        imageAlt: 'Rental property agreement signing with keys and contract documents on table',
        isFeatured: false,
        tags: ['tenant', 'landlord', 'rent control', 'eviction', 'property'],
        views: 1900,
        likes: 112,
        publishDate: new Date('2025-12-08')
    },
    {
        title: 'New E-Commerce Rules 2025: What Consumers Need to Know',
        excerpt: 'The latest e-commerce regulations bring stricter accountability for online marketplaces. Learn what changed and how you are protected.',
        content: 'The Consumer Protection (E-Commerce) Rules 2020 (amended 2025) impose significant obligations on e-commerce entities. Key changes: 1. Mandatory seller information — every product listing must display seller name, registered address, and customer care number. 2. No fake reviews — platforms cannot publish fabricated product reviews. 3. Price comparison ban — platforms cannot use algorithms to inflate prices. 4. Return and refund — must be honored within the stated policy period without extra charges. 5. Grievance Officer — every large platform must appoint a nodal officer for complaints. 6. Data localisation — customer data must be stored in India. For marketplace models, the platform and seller share liability for defective products. Consumer remedies remain available under Consumer Protection Act 2019.',
        category: 'Consumer Rights',
        categoryIcon: 'ShoppingCart',
        difficulty: 'beginner',
        readTime: 5,
        image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1eb7c1cb3-1764655134961.png',
        imageAlt: 'Online shopping on laptop showing e-commerce website with shopping cart',
        isFeatured: false,
        tags: ['e-commerce', 'online shopping', 'rules 2025', 'marketplace', 'consumer'],
        views: 4200,
        likes: 241,
        publishDate: new Date('2025-12-20')
    },
    {
        title: 'Digital Arrest Scams: How to Identify and Report',
        excerpt: 'A new wave of cyber fraud involves fake police officers threatening victims with digital arrest. Learn to identify these scams and protect yourself.',
        content: 'Digital arrest is a sophisticated social engineering fraud where criminals impersonate law enforcement (CBI, ED, Narcotics, Customs) and claim you are under "digital arrest" for some alleged crime. How it works: 1. You receive a WhatsApp/video call from someone showing a fake police uniform and an official-looking background. 2. They claim your Aadhaar, SIM, or bank account is linked to money laundering. 3. They demand you stay on call and transfer money to "clear your name". How to identify: Real agencies never contact you on WhatsApp for arrests. No law enforcement agency conducts "digital arrest". Official summons always arrive as written notice. What to do: End the call immediately. Report at cybercrime.gov.in or call 1930. Note down caller details and save screenshots. File an FIR at your local police station. Alert your bank if financial information was shared.',
        category: 'Cyber Crimes',
        categoryIcon: 'Shield',
        difficulty: 'beginner',
        readTime: 4,
        image: 'https://images.unsplash.com/photo-1610602517380-cce49794d0a8',
        imageAlt: 'Warning sign on smartphone screen showing cyber scam alert',
        isFeatured: false,
        tags: ['digital arrest', 'scam', 'cyber fraud', 'police impersonation', 'cybercrime'],
        views: 3800,
        likes: 289,
        publishDate: new Date('2025-12-22')
    },
    {
        title: 'Property Inheritance Laws: Understanding Succession Rights',
        excerpt: 'Navigate the complex world of property inheritance with this guide to succession rights under Hindu Succession Act, Muslim personal law, and Christian inheritance laws.',
        content: 'Inheritance of property in India is governed by religious-specific personal laws for most communities. Hindu Succession Act 1956 (as amended 2005): Daughters now have equal coparcenary rights as sons in ancestral property. Class I heirs include: sons, daughters, widow, mother. Self-acquired property can be willed to anyone. Muslim Succession: Governed by Sharia-based rules. Legal heirs receive fixed fractions (Quranic shares). Daughters receive half the share of sons. Bequests limited to 1/3rd of estate through will. Christian Succession: Indian Succession Act 1925 applies. Equal rights for sons and daughters. Testamentary succession (will) allows distribution as desired. Will preparation: A valid will must be in writing, signed by testator, attested by at least 2 witnesses. Probate may be required in certain jurisdictions. Intestate succession (no will): State-specific laws determine who inherits and in what proportion.',
        category: 'Property Law',
        categoryIcon: 'Home',
        difficulty: 'intermediate',
        readTime: 11,
        image: 'https://img.rocket.new/generatedImages/rocket_gen_img_16356c14c-1766335415684.png',
        imageAlt: 'Legal documents for property inheritance with family photos and will papers',
        isFeatured: false,
        tags: ['inheritance', 'succession', 'will', 'Hindu Succession Act', 'property'],
        views: 2900,
        likes: 167,
        publishDate: new Date('2025-12-14')
    },
    {
        title: 'Product Warranty Claims: Your Legal Rights',
        excerpt: 'How to assert your warranty rights effectively. This guide covers both express warranties and implied warranties under Indian consumer law.',
        content: 'Warranty rights in India are protected under both the Consumer Protection Act 2019 and the Sale of Goods Act 1930. Types of warranty: 1. Express Warranty — Explicitly stated by manufacturer (written guarantee, advertisement promises). 2. Implied Warranty — Implied by law: goods must be of merchantable quality and fit for purpose. How to claim warranty: 1. Check the warranty card for duration and coverage. 2. Contact the authorised service centre (not any third party). 3. Submit the product with proof of purchase (invoice, warranty card). 4. If claim is denied unjustly, file complaint with Consumer Forum. Manufacturing defect vs damage: If the defect existed at time of purchase, full repair or replacement is due even outside warranty. Consumer Forum can order: Replacement, Refund, Compensation for mental agony and legal costs.',
        category: 'Consumer Rights',
        categoryIcon: 'ShoppingCart',
        difficulty: 'beginner',
        readTime: 6,
        image: 'https://img.rocket.new/generatedImages/rocket_gen_img_162952322-1766513858532.png',
        imageAlt: 'Product warranty certificate with seal and guarantee documents',
        isFeatured: false,
        tags: ['warranty', 'consumer rights', 'product defect', 'replacement', 'claim'],
        views: 1600,
        likes: 93,
        publishDate: new Date('2025-12-03')
    },
    {
        title: 'Online Banking Fraud: Prevention and Recovery',
        excerpt: 'Protect yourself from UPI scams, phishing, and unauthorised transactions. Learn what to do immediately after fraud occurs.',
        content: 'Online banking fraud has surged in India. Common fraud types: 1. Phishing — Fake bank websites or SMS. 2. Vishing — Fake bank representatives calling for OTP. 3. UPI Collect Scams — Payment requests disguised as receiving money. 4. SIM Swap — Criminal ports your mobile number. Immediate action after fraud: 1. Call your bank\'s toll-free number immediately to block card/account. 2. Report at cybercrime.gov.in or call 1930 (national helpline). 3. File FIR at local police station. Legal remedies: RBI\'s Limited Liability policy: If you report fraudulent transaction within 3 working days, you are entitled to zero liability (if third-party breach). Banks must resolve complaints within 90 days. File a complaint with Banking Ombudsman if bank is unresponsive. Prevention tips: Never share OTP, CVV, PIN. Enable transaction alerts. Use UPI with trusted contacts only. Verify IFSC before transfers.',
        category: 'Cyber Crimes',
        categoryIcon: 'Shield',
        difficulty: 'intermediate',
        readTime: 8,
        image: 'https://img.rocket.new/generatedImages/rocket_gen_img_18f2ffab0-1766014959260.png',
        imageAlt: 'Secure online banking on mobile phone showing encrypted transaction',
        isFeatured: false,
        tags: ['banking fraud', 'UPI scam', 'phishing', 'cybercrime', 'recovery'],
        views: 2700,
        likes: 188,
        publishDate: new Date('2025-12-07')
    },
    {
        title: 'Filing Consumer Complaints Online: Complete Process',
        excerpt: 'Step-by-step guide to filing consumer complaints on the National Consumer Helpline, consumer forums, and INGRAM portal.',
        content: 'India provides multiple online channels for consumer complaints. 1. National Consumer Helpline (NCH): Call 1800-11-4000 (toll-free) or WhatsApp 8800001915. Register at consumerhelpline.gov.in. Track complaint status online. 2. INGRAM Portal (Integrated Nodal Grievance Redressal): For complaints against specific companies. Company is notified and must respond within 30 days. 3. eDaakhil for Consumer Forum: File cases electronically with Consumer District Forum, State Commission, or National Commission. Pay court fee online. Upload all supporting documents. Track hearing dates online. What to include in complaint: Your name and contact details, Name of the opposite party (company/seller), Date of purchase and transaction details, Nature of grievance, Relief sought, Copies of all supporting documents. Limitation period: Complaints must be filed within 2 years of the cause of action (can be condoned for sufficient reason).',
        category: 'Consumer Rights',
        categoryIcon: 'ShoppingCart',
        difficulty: 'beginner',
        readTime: 7,
        image: 'https://img.rocket.new/generatedImages/rocket_gen_img_162952322-1766513858532.png',
        imageAlt: 'Person filing consumer complaint online using laptop',
        isFeatured: false,
        tags: ['consumer complaint', 'NCH', 'eDaakhil', 'forum', 'online'],
        views: 2100,
        likes: 129,
        publishDate: new Date('2025-12-01')
    },
    {
        title: 'Domestic Violence Act: Protection and Legal Remedies',
        excerpt: 'The Protection of Women from Domestic Violence Act 2005 provides civil remedies including protection orders, residence rights, and monetary relief.',
        content: 'The Protection of Women from Domestic Violence Act 2005 (PWDVA) provides comprehensive protection to women in domestic relationships. Who is protected: Women in shared households — wives, live-in partners, mothers, sisters, daughters. Types of domestic violence covered: Physical, Sexual, Emotional/verbal, Economic. How to get help: 1. Contact the Protection Officer designated in your district (directory available at wcdhry.gov.in or equivalent state site). 2. The Protection Officer files a Domestic Incident Report (DIR). 3. Apply to Magistrate for: Protection Order (prohibiting contact), Residence Order (right to stay in shared house), Monetary Relief (maintenance, medical expenses), Custody Orders. Emergency relief: Protection Orders can be passed ex-parte (without opposing party) in urgent cases. The Act also covers dowry-related violence alongside IPC Section 498A. Penalties for breach: Violation of a Protection Order is punishable by 1 year imprisonment or ₹20,000 fine or both.',
        category: 'Family Law',
        categoryIcon: 'Users',
        difficulty: 'intermediate',
        readTime: 9,
        image: 'https://img.rocket.new/generatedImages/rocket_gen_img_108e74940-1765883810330.png',
        imageAlt: 'Family law concept showing protection and legal remedies for domestic violence',
        isFeatured: false,
        tags: ['domestic violence', 'PWDVA', 'protection order', 'women rights', 'family law'],
        views: 1700,
        likes: 108,
        publishDate: new Date('2025-11-28')
    }
];

async function seedArticles() {
    try {
        const count = await Article.countDocuments();
        if (count > 0) {
            console.log(`ℹ  Articles collection already has ${count} documents — skipping seed.`);
            return;
        }
        await Article.insertMany(SEED_ARTICLES);
        console.log(`✅ Seeded ${SEED_ARTICLES.length} articles into MongoDB.`);
    } catch (err) {
        console.error('❌ Error seeding articles:', err.message);
    }
}

module.exports = seedArticles;
