/**
 * seedEvergreenArticles.js
 * ─────────────────────────────────────────────────────────────────
 * One-time script to populate the MongoDB Article collection with
 * 30+ foundational, curated Indian legal guides.
 *
 * Run from the /server directory:
 *   node seeds/seedEvergreenArticles.js
 * Or via npm script:
 *   npm run seed:evergreen
 *
 * The script is IDEMPOTENT — it skips any title that already exists.
 * ─────────────────────────────────────────────────────────────────
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Article = require('../models/Article');

const EVERGREEN_ARTICLES = [

    // ═══════════════════════════════════════════════
    //  CRIMINAL LAW — BNS (Bharatiya Nyaya Sanhita)
    // ═══════════════════════════════════════════════
    {
        title: 'Bharatiya Nyaya Sanhita (BNS) 2023: Complete Overview',
        excerpt: 'The BNS replaces the Indian Penal Code 1860. This guide covers its structure, key changes, new offences, and what it means for citizens and lawyers.',
        content: `The Bharatiya Nyaya Sanhita 2023 came into force on 1 July 2024, replacing the Indian Penal Code (IPC) 1860 after 163 years. Key structural changes: The BNS has 358 sections compared to the IPC's 511. Many sections have been renumbered; for example, IPC Section 302 (Murder) is now BNS Section 103. New offences introduced: Organised Crime (Section 111), Terrorism (Section 113), Petty organised crime (Section 112), and Hit-and-run by vehicles (Section 106(2)). Updated definitions: "Document" now includes digital records. Gender-neutral language is used for several offences. Community service introduced as a form of punishment for petty offences (first time in Indian criminal law). Notable renumbering: IPC 420 (Cheating) → BNS 318; IPC 376 (Rape) → BNS 64; IPC 498A (Cruelty by husband) → BNS 85. The BNS retains the structure of the IPC but attempts to align with modern realities including cybercrime, organised crime, and gender justice.`,
        category: 'Criminal Law',
        categoryIcon: 'Gavel',
        difficulty: 'intermediate',
        readTime: 12,
        image: 'https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=800',
        imageAlt: 'Indian court with gavel and law books representing the new BNS criminal code',
        isFeatured: true,
        isAiGenerated: false,
        tags: ['BNS', 'Bharatiya Nyaya Sanhita', 'IPC replacement', 'criminal law', 'bare-act'],
        views: 3200,
        likes: 210,
        publishDate: new Date('2024-07-01'),
    },
    {
        title: 'BNS Section 103: Murder — Punishment and Key Differences from IPC 302',
        excerpt: 'An explanation of the law on murder under the new BNS, how it differs from the old IPC Section 302, and what constitutes culpable homicide not amounting to murder.',
        content: `BNS Section 103 corresponds to the former IPC Section 302. Punishment for Murder: Death penalty or imprisonment for life, plus a fine. Culpable homicide vs. Murder (BNS Section 100 / old IPC 299-300): Culpable homicide is the genus; murder is the species. An act is murder when done with intention to cause death, or with knowledge that it will likely cause the death of a specific individual. Exceptions (when murder becomes culpable homicide not amounting to murder): Grave and sudden provocation (Exception 1). Private defence exceeding the right (Exception 2). Public servant exceeding powers in good faith (Exception 3). Sudden fight without premeditation (Exception 4). Consent of the victim if over 18 years old (Exception 5). Key case law: Bachan Singh v. State of Punjab (AIR 1980 SC 898) — confirmed death penalty as constitutional; reserved for the "rarest of rare" cases. Machhi Singh v. State of Punjab (1983) — laid down factors to determine "rarest of rare". The BNS does not change the substantive law on murder; it only renumbers the sections.`,
        category: 'Criminal Law',
        categoryIcon: 'Gavel',
        difficulty: 'advanced',
        readTime: 10,
        image: 'https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=800',
        imageAlt: 'Legal books and gavel on courtroom desk representing serious criminal offences',
        isFeatured: false,
        isAiGenerated: false,
        tags: ['BNS', 'Section 103', 'murder', 'IPC 302', 'bare-act', 'criminal law'],
        views: 1800,
        likes: 112,
        publishDate: new Date('2024-08-10'),
    },
    {
        title: 'BNS Section 111: Organised Crime — What It Means and Who It Targets',
        excerpt: 'A brand-new offence in Indian criminal law, Section 111 of the BNS introduces organised crime as a distinct category with severe punishments including death in certain cases.',
        content: `BNS Section 111 is an entirely new section with no equivalent under the IPC. It defines organised crime as any continuing unlawful activity carried out by a person, individually or as a member of an organised crime syndicate, by violence, threat of violence, intimidation, coercion, or by any other unlawful means. "Organised crime syndicate" means a group of two or more persons who, acting either singly or collectively, as a syndicate or gang indulge in activities of organised crime. Punishments: If the act results in death of a person: Death or imprisonment for life (minimum 10 years) + fine of ₹10 lakh. In other cases: Rigorous imprisonment not less than 5 years, extendable to life + fine of ₹5 lakh. Harbouring an organised crime offender: RI 3–10 years + fine of ₹5 lakh. Possessing property obtained through organised crime: RI 3–10 years + fine of ₹5 lakh. This section fills a critical gap previously addressed only by state-level laws like Maharashtra's MCOCA.`,
        category: 'Criminal Law',
        categoryIcon: 'Gavel',
        difficulty: 'advanced',
        readTime: 8,
        image: 'https://images.unsplash.com/photo-1555212697-194d092e3b8f?w=800',
        imageAlt: 'Security camera and handcuffs symbolizing organized crime law enforcement',
        isFeatured: false,
        isAiGenerated: false,
        tags: ['BNS', 'Section 111', 'organised crime', 'syndicate', 'bare-act'],
        views: 1200,
        likes: 78,
        publishDate: new Date('2024-08-20'),
    },
    {
        title: 'Your Rights When Arrested in India: BNS and BNSS Explained',
        excerpt: 'What you must know if you or someone you know is arrested — rights at the time of arrest, bail rights, legal aid, and the new 24-hour rule under the Bharatiya Nagarik Suraksha Sanhita.',
        content: `When arrested in India, you have the following fundamental rights: 1. Right to be informed of grounds of arrest (Article 22 of Constitution + BNSS Section 47): Police must inform you of the grounds at the time of arrest. 2. Right to legal representation (Article 22(1)): You have the right to consult a lawyer of your choice. Under BNSS Section 303, you can have your lawyer present during interrogation. 3. Right to be produced before Magistrate within 24 hours (BNSS Section 57 / old CrPC 57): Police cannot detain you beyond 24 hours without a Magistrate's authorisation. 4. Right to bail for bailable offences: Bail is a matter of right, not discretion. For non-bailable offences, you can apply to the Magistrate or Sessions Court. 5. Right to free legal aid: If you cannot afford a lawyer, the court must provide one at State expense (Section 304 BNSS / Legal Services Authorities Act). 6. Right against self-incrimination (Article 20(3)): You cannot be forced to be a witness against yourself. 7. Right to remain silent: You are not obligated to answer all police questions. 8. Right to medical examination (BNSS Section 53 for accused, Section 184 for victims). New under BNSS: You can nominate a person who must be informed of your arrest (BNSS Section 35). Handcuffing is now restricted to specific categories of offenders (BNSS Section 43(3)).`,
        category: 'Criminal Law',
        categoryIcon: 'Gavel',
        difficulty: 'beginner',
        readTime: 9,
        image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
        imageAlt: 'Person in handcuffs with a lawyer symbolizing legal rights on arrest',
        isFeatured: true,
        isAiGenerated: false,
        tags: ['arrest rights', 'BNSS', 'BNS', 'bail', 'legal aid', 'bare-act'],
        views: 4500,
        likes: 312,
        publishDate: new Date('2024-07-15'),
    },

    // ═══════════════════════════════════════════════
    //  CRIMINAL PROCEDURE — BNSS
    // ═══════════════════════════════════════════════
    {
        title: 'How to File an FIR: Step-by-Step Guide Under BNSS',
        excerpt: 'A First Information Report (FIR) is the starting point for any criminal case. Learn exactly how to file one, what to do if police refuse, and how the new BNSS has changed the process.',
        content: `An FIR (First Information Report) is a complaint filed with the police for a cognizable offence. Governed by BNSS Section 173 (formerly CrPC Section 154). Steps to file an FIR: 1. Go to the police station with jurisdiction over the area where the offence occurred. 2. Give your information orally or in writing. 3. The SHO (Station House Officer) must reduce it to writing and read it back to you. 4. Sign, or thumb-print, the statement. 5. Demand a free copy of the FIR — this is your right (BNSS Section 173(2)). 6. An e-FIR number will be generated and sent to your mobile. New under BNSS: e-FIR can be filed online at your State police portal (or email for certain offences). Police must register FIR within 3 days of receiving information online. If police refuse to file an FIR: 1. Send the complaint in writing to the Superintendent of Police (SP). Section 173(4): If SP is satisfied, they can direct an FIR to be registered. 2. File a private complaint before the Magistrate under BNSS Section 223. 3. File a Writ Petition in the High Court. Zero FIR: You can file an FIR at any police station regardless of jurisdiction; station must transfer it within 15 days. Important: FIR is not an accusation of guilt — it is the starting point of an investigation.`,
        category: 'Criminal Law',
        categoryIcon: 'Gavel',
        difficulty: 'beginner',
        readTime: 7,
        image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
        imageAlt: 'Person writing a formal complaint at a police station desk',
        isFeatured: false,
        isAiGenerated: false,
        tags: ['FIR', 'BNSS', 'police complaint', 'Zero FIR', 'bare-act', 'criminal law'],
        views: 5100,
        likes: 380,
        publishDate: new Date('2024-07-05'),
    },
    {
        title: 'Understanding Bail in India: Bailable vs Non-Bailable, Anticipatory Bail',
        excerpt: 'A complete guide to bail rights in India — when you get bail as a right, when it is discretionary, how to apply, and everything about anticipatory bail under the new BNSS.',
        content: `Bail is the temporary release of an accused person while their case is pending. Governed by BNSS Sections 478–483 (formerly CrPC Sections 436–439). Types of bail: 1. Regular Bail (BNSS Section 480): For bailable offences — you have a right to bail. Police or Magistrate must release you on furnishing surety. For non-bailable offences — bail is at Magistrate's or Court's discretion. Grounds for denying bail in non-bailable offences: Fear of fleeing justice, tampering with evidence, repeat offence risk, serious nature of offence. 2. Anticipatory Bail (BNSS Section 482 / old CrPC 438): Applied for before arrest when you apprehend arrest. Filed in Sessions Court or High Court. If granted, upon arrest you are immediately released on bail. BNSS change: Anticipatory bail now has a mandatory notice to the Public Prosecutor before grant. 3. Default Bail (BNSS Section 479): If police fails to file charge sheet within 60 days (non-bailable, magistrate court) or 90 days (offence punishable by death/life), you are entitled to bail automatically. 4. Interim Bail: Short-term bail granted pending hearing of full bail application. Bail conditions: Reporting to police station, surrendering passport, not leaving jurisdiction, not contacting witnesses. New BNSS provision: Undertrial prisoners who have served 1/3rd of maximum possible sentence can apply for bail.`,
        category: 'Criminal Law',
        categoryIcon: 'Gavel',
        difficulty: 'intermediate',
        readTime: 11,
        image: 'https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=800',
        imageAlt: 'Bail bond papers and gavel on a courtroom table',
        isFeatured: false,
        isAiGenerated: false,
        tags: ['bail', 'anticipatory bail', 'BNSS', 'non-bailable', 'default bail', 'bare-act'],
        views: 3700,
        likes: 245,
        publishDate: new Date('2024-07-20'),
    },

    // ═══════════════════════════════════════════════
    //  EMPLOYMENT LAW
    // ═══════════════════════════════════════════════
    {
        title: 'POSH Act 2013: Sexual Harassment at Workplace — Your Complete Guide',
        excerpt: 'The Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act 2013 mandates every employer to have an Internal Complaints Committee. Know your rights and the complaint process.',
        content: `The POSH Act 2013 is applicable to all workplaces — government, private, formal, and informal sectors — with one or more employee. Definition of sexual harassment: Unwelcome physical contact, demand for sexual favours, sexually coloured remarks, showing pornography, or any other unwelcome physical, verbal, or non-verbal conduct of a sexual nature. Key obligations of employers: 1. Constitute an Internal Complaints Committee (ICC) — mandatory for establishments with 10 or more employees. Chairperson must be a senior woman employee. At least 50% members must be women. At least one external NGO member. 2. Develop and display an anti-sexual harassment policy. 3. Conduct awareness programs. 4. Submit annual report to District Officer. For employers with fewer than 10 employees or for domestic workers: Local Complaints Committee (LCC) at district level. Complaint procedure: File written complaint to ICC/LCC within 3 months of incident (extendable). ICC must complete inquiry within 60 days. Conciliation (settlement) is possible at the request of the complainant. Penalties on employer for non-compliance: Fine up to ₹50,000 (doubled on repeat offence) + cancellation of business licence. False complaints: If malicious and deliberate, complainant can face action (but not accused alone). Key SC judgment: Vishakha v. State of Rajasthan (1997) — led to the mandatory guidelines that later became the POSH Act.`,
        category: 'Employment',
        categoryIcon: 'Briefcase',
        difficulty: 'intermediate',
        readTime: 10,
        image: 'https://images.unsplash.com/photo-1521737451536-033148a83e87?w=800',
        imageAlt: 'Professional office meeting environment representing workplace rights and POSH Act compliance',
        isFeatured: false,
        isAiGenerated: false,
        tags: ['POSH', 'sexual harassment', 'workplace', 'ICC', 'employment law'],
        views: 2900,
        likes: 198,
        publishDate: new Date('2025-01-15'),
    },
    {
        title: 'Gratuity Act: When Are You Entitled and How to Calculate It?',
        excerpt: 'Learn who qualifies for gratuity under the Payment of Gratuity Act 1972, how the amount is calculated, when the employer must pay, and what to do if they refuse.',
        content: `Gratuity is a lump-sum retirement benefit paid by an employer out of gratitude for the employee's continuous service. Governed by the Payment of Gratuity Act 1972. Eligibility: You must have completed 5 years of continuous service with the same employer. Exception: In case of death or disablement, gratuity is payable even without 5 years. Applicable to: All establishments employing 10 or more persons. Formula: Gratuity = (Last drawn salary × 15/26) × Number of years of service. "Salary" here means basic pay + dearness allowance only. 15/26 represents 15 days of wages out of 26 working days per month. Maximum limit: ₹20 lakh (as per 2018 amendment). Government employees may get higher amounts under separate rules. When to pay: Employer must pay within 30 days of the employee becoming eligible. Delayed payment attracts interest. If employer refuses: 1. File an application before the Controlling Authority (usually a Labour Commissioner) within 90 days. 2. The authority will issue a payment direction. 3. If not complied with, the employer is liable for fine up to ₹1 lakh and/or imprisonment up to 2 years. Tax exemption: Gratuity up to ₹20 lakh is tax-free for private sector employees.`,
        category: 'Employment',
        categoryIcon: 'Briefcase',
        difficulty: 'beginner',
        readTime: 8,
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
        imageAlt: 'Employee handing over retirement paperwork at an office desk with calculator',
        isFeatured: false,
        isAiGenerated: false,
        tags: ['gratuity', 'retirement benefit', 'employment law', 'Payment of Gratuity Act', 'salary'],
        views: 2200,
        likes: 142,
        publishDate: new Date('2025-01-20'),
    },
    {
        title: 'Provident Fund (PF) and ESI: Your Rights as an Employee',
        excerpt: 'EPF and ESIC are mandatory contributions that create a social security net for you. Know your PF balance, UAN, withdrawal rules, and how to raise a claim against an employer who defaults.',
        content: `Employees' Provident Fund (EPF): Governed by EPF & MP Act 1952. Applicable to organisations with 20 or more employees. Contributions: Employee: 12% of basic pay + DA. Employer: 12% of basic pay + DA (split: 8.33% to EPS — Pension Scheme, 3.67% to EPF). Universal Account Number (UAN): Your portable EPF account number. Remains the same across employers. Check balance at epfindia.gov.in or UMANG app. Withdrawal rules: Partial withdrawal allowed for: house purchase, marriage, education, illness. Full withdrawal on retirement (58 years), or after 2 months of unemployment. Employer defaults: If PF is deducted from salary but not remitted to EPFO, file a complaint at the regional EPFO office or at the unified portal (unifiedportal-mem.epfindia.gov.in). Employer is liable for damages + interest. Employees' State Insurance (ESI): Governed by ESI Act 1948. Applicable where 10+ employees earn below ₹21,000/month. Benefits: Medical care (free at ESI hospitals), Sickness benefit (70% of wages), Maternity benefit, Disablement benefit, Dependants' benefit on death. Contributions: Employee: 0.75% of gross wages; Employer: 3.25%. ESIC grievances: Call 1800-11-2526 (toll-free) or file at esic.in.`,
        category: 'Employment',
        categoryIcon: 'Briefcase',
        difficulty: 'beginner',
        readTime: 9,
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
        imageAlt: 'Employee benefit documents showing PF and ESI contributions',
        isFeatured: false,
        isAiGenerated: false,
        tags: ['PF', 'EPF', 'ESI', 'provident fund', 'employment law', 'UAN'],
        views: 3100,
        likes: 215,
        publishDate: new Date('2025-02-01'),
    },
    {
        title: 'Wrongful Termination: Your Legal Remedies in India',
        excerpt: 'Were you fired without notice or valid reason? Understand retrenchment rules, standing orders, and how to challenge illegal termination before the Labour Court.',
        content: `Wrongful or illegal termination occurs when an employer fires an employee in violation of law or contract. Key laws: Industrial Disputes Act 1947, Industrial Employment (Standing Orders) Act 1946, Payment of Wages Act 1936. Types of employees and protection: Workmen (defined in IDA 1947): Strongest protections. Non-workmen (mainly managerial/supervisory): Governed by employment contract. Retrenchment rules for workmen in establishments with 100+ employees: Prior government permission required. Retrenchment compensation: 15 days average pay per completed year of service. One month written notice or wages in lieu. Last-in-first-out principle (with exceptions). Illegal termination remedies: 1. Conciliation: File complaint with Labour Conciliation Officer (within 3 years). 2. Labour Court / Industrial Tribunal: If conciliation fails, refer to Labour Court. Workers can get reinstatement + back wages if termination is found illegal. 3. Civil Court: For non-workman employees whose contracts have been violated. High Court (Writ Petition) is available if a public sector employer is involved. Notice period: Minimum required by law: 1 month for workmen in establishments with 100+. Standing Orders/Contract may specify longer notice. Employer cannot waive notice in lieu without paying full notice pay. New Labour Codes: The Industrial Relations Code 2020 (not yet fully notified) will increase the threshold for requiring government permission from 100 to 300 employees.`,
        category: 'Employment',
        categoryIcon: 'Briefcase',
        difficulty: 'intermediate',
        readTime: 11,
        image: 'https://images.unsplash.com/photo-1521737451536-033148a83e87?w=800',
        imageAlt: 'Dismissed employee clearing desk while holding termination letter',
        isFeatured: false,
        isAiGenerated: false,
        tags: ['wrongful termination', 'retrenchment', 'labour law', 'Industrial Disputes Act', 'employment'],
        views: 1900,
        likes: 127,
        publishDate: new Date('2025-02-05'),
    },

    // ═══════════════════════════════════════════════
    //  PROPERTY LAW — RERA & Flat Buyers
    // ═══════════════════════════════════════════════
    {
        title: 'RERA 2016: Flat Buyer Rights Against Builders',
        excerpt: 'The Real Estate (Regulation and Development) Act 2016 is the most powerful tool a home buyer has. Learn how to file a complaint against a builder for delay, defects, or misrepresentation.',
        content: `The RERA Act 2016 aims to bring transparency and accountability to the real estate sector. Key rights for homebuyers: 1. Builder must register the project with the State RERA Authority before marketing or selling. 2. Builder must deposit 70% of collected amount in a separate escrow account — to be used only for construction. 3. Builder must give possession on the date committed. Delay entitles buyer to: Interest at SBI PLR + 2% for each month of delay, or Right to withdraw with full refund + interest. 4. You must receive all original documents — sale agreement, approved plan, completion certificate. 5. Structural defects discovered within 5 years of possession must be rectified by the builder free of cost within 30 days. How to file a RERA complaint: 1. Gather documents: booking letter, allotment letter, builder-buyer agreement, payment receipts. 2. File complaint on the State RERA portal online (e.g., MahaRERA, RERA UP, RERA Karnataka). 3. Pay nominal filing fee (typically ₹1,000–₹5,000). 4. The RERA Authority issues notice to the builder and conducts hearings. 5. Orders can be passed within 60 days. Appeal: Against RERA order → RERA Appellate Tribunal → High Court. Timelines: Project completion certificate must be submitted; project cannot be modified without buyer majority consent.`,
        category: 'Property Law',
        categoryIcon: 'Home',
        difficulty: 'intermediate',
        readTime: 12,
        image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1d59c13d7-1766513857440.png',
        imageAlt: 'Model house and keys on table with RERA complaint form for homebuyer rights',
        isFeatured: true,
        isAiGenerated: false,
        tags: ['RERA', 'flat buyer', 'builder delay', 'real estate', 'property law'],
        views: 4200,
        likes: 298,
        publishDate: new Date('2025-01-10'),
    },
    {
        title: 'NRI Property Rights in India: Acquisition, Inheritance, and Dispute Resolution',
        excerpt: 'Non-Resident Indians face unique challenges buying, inheriting, and selling property in India. This guide covers FEMA rules, power of attorney, and how to fight illegal encroachment from abroad.',
        content: `NRIs (Non-Resident Indians) and OCIs (Overseas Citizens of India) can buy property in India with certain restrictions. What NRIs can buy: Residential and commercial property — any number. What NRIs cannot buy: Agricultural land, plantation property, farmhouses (without special RBI permission). FEMA Rules: Purchase must be through Inward Remittance (foreign currency through banking channels) or NRE/NRO/FCNR bank accounts. Repatriation of sale proceeds: Up to 2 residential properties. Sale proceeds must go through NRO account. Subject to TDS of 20% + surcharge + cess (buyer must deduct before paying). Inheritance: NRI can inherit any property in India from a resident or NRI relative. No restriction on immovable property received by inheritance. Power of Attorney (PoA): NRI can execute a PoA for a trusted person in India to manage property transactions. PoA must be notarised in the country of residence and apostilled/consularised. Must be registered in India for valid property transactions. Dispute resolution for NRIs: Real estate: File on State RERA portal (can be done online). Illegal encroachment: File civil suit in the District Court where property is located; you can appear through PoA. Inheritance disputes: Probate or succession certificate from civil court. General: Lok Adalat, NRI commissions (several states have them, e.g., Punjab).`,
        category: 'Property Law',
        categoryIcon: 'Home',
        difficulty: 'advanced',
        readTime: 13,
        image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1d59c13d7-1766513857440.png',
        imageAlt: 'NRI holding property documents with Indian cityscape in background',
        isFeatured: false,
        isAiGenerated: false,
        tags: ['NRI', 'property law', 'FEMA', 'power of attorney', 'inheritance', 'OCI'],
        views: 1600,
        likes: 105,
        publishDate: new Date('2025-01-25'),
    },

    // ═══════════════════════════════════════════════
    //  FAMILY LAW
    // ═══════════════════════════════════════════════
    {
        title: 'Child Custody Laws in India: What Courts Consider',
        excerpt: 'Whether you are going through a divorce or a separation, understanding how Indian courts decide child custody — legal custody, physical custody, and visitation rights — is essential.',
        content: `Indian courts decide child custody based on the paramount principle: the best interest and welfare of the child. Key laws: Guardians and Wards Act 1890 (applies to all religions), Hindu Minority and Guardianship Act 1956 (Hindus), Personal laws for Muslim, Christian, Parsi communities. Types of custody: 1. Physical custody: Who the child lives with day-to-day. 2. Legal custody: Who makes decisions about education, health, religion. 3. Joint custody: Both parents share physical/legal custody — courts increasingly favour this. 4. Sole custody: One parent given full custody; other gets visitation. Factors courts consider: Age of child (children below 5 generally with mother, unless exceptional circumstances). Child's wishes (if old enough to form an opinion). Financial stability of each parent. Quality of relationship with each parent. School stability and social environment. History of abuse, addiction, or neglect. Interim custody: In urgent cases, courts grant interim custody within days pending final hearing. Visitation: Non-custodial parent has a legal right to visit. Courts set specific schedules. Contempt of court for violation. International child abduction: India is not yet a signatory to the Hague Convention; however, courts can pass orders restraining removal of child from jurisdiction under section 12 of Guardians and Wards Act.`,
        category: 'Family Law',
        categoryIcon: 'Users',
        difficulty: 'intermediate',
        readTime: 10,
        image: 'https://img.rocket.new/generatedImages/rocket_gen_img_108e74940-1765883810330.png',
        imageAlt: 'Parents with child at family court symbolizing custody proceedings',
        isFeatured: false,
        isAiGenerated: false,
        tags: ['child custody', 'visitation', 'divorce', 'family law', 'Guardians and Wards Act'],
        views: 2400,
        likes: 165,
        publishDate: new Date('2025-01-15'),
    },
    {
        title: 'Maintenance Rights Under Section 125 CrPC / BNSS Section 144',
        excerpt: 'Any wife, minor child, or parent unable to maintain themselves can claim maintenance from a husband or adult child. Here is how the process works and how much you can claim.',
        content: `Section 125 of the old CrPC (now Section 144 of BNSS) provides a quick, affordable remedy for maintenance — bypassing the long civil court route. Who can claim: Wife (including divorced wife who has not remarried), Minor children (legitimate and illegitimate), Major children unable to maintain themselves due to physical/mental abnormality, Parents unable to maintain themselves. Who is liable: Husband, for wife and children. Adult children, for parents. Eligibility for wife: Husband must have "sufficient means". Wife must not be able to maintain herself. Courts have held that a working wife can still claim maintenance if income is insufficient to maintain standard of living enjoyed during marriage. Amount: No fixed formula. Courts consider: Husband's income, standard of living, wife's income, needs of child. Supreme Court has issued guidelines (Rajnesh v. Neha, 2020) for filing affidavits of assets to determine amounts. Interim Maintenance: Can be claimed immediately; usually granted within 60 days of filing. Enforcement: Police can be directed to recover maintenance as if it were a fine. Husband can be imprisoned if maintenance remains unpaid for 1 month.`,
        category: 'Family Law',
        categoryIcon: 'Users',
        difficulty: 'beginner',
        readTime: 8,
        image: 'https://img.rocket.new/generatedImages/rocket_gen_img_108e74940-1765883810330.png',
        imageAlt: 'Family court maintenance claim documents with scales of justice',
        isFeatured: false,
        isAiGenerated: false,
        tags: ['maintenance', 'Section 125', 'BNSS 144', 'wife', 'family law', 'alimony'],
        views: 3300,
        likes: 228,
        publishDate: new Date('2025-02-01'),
    },

    // ═══════════════════════════════════════════════
    //  CONSUMER RIGHTS
    // ═══════════════════════════════════════════════
    {
        title: 'Insurance Claim Rejected? Your Rights and What To Do Next',
        excerpt: 'Insurance companies frequently reject valid claims citing technicalities. Know your rights under the Insurance Ombudsman scheme, IRDA grievance portal, and consumer forum to fight back.',
        content: `A rejected insurance claim is not necessarily the end. You have multiple legal avenues to challenge it. Step 1: Read the rejection letter — the insurer must give specific reasons. Common illegitimate reasons: Non-disclosure (if insurer accepted premium knowing medical history, they cannot reject for pre-existing illness later). Claim filed late due to genuine reason. Vague terms like "policy excluded the condition" without clear clause. Step 2: File internal grievance: Write to the insurer's Grievance Redressal Officer (GRO). They must respond within 15 days. Step 3: Insurance Ombudsman: If not resolved or response unsatisfactory, approach the Ombudsman in your region (bimabharosa.nfis.org.in). Free process. Must be filed within 1 year of insurer's final reply. Up to ₹30 lakh can be awarded for life insurance. Up to ₹50 lakh for general/health insurance. Step 4: IRDAI Bima Bharosa Portal: File at bimabharosa.nfis.org.in or call 155255. Step 5: Consumer Forum: File complaint at District Consumer Commission. Compensation + legal costs can be awarded. Step 6: Civil Court: For amounts above Consumer Forum jurisdiction (₹1 crore+). Key court ruling: LIC of India v. Consumer Education & Research Centre — insurer must prove suppression of material fact, not merely claim it.`,
        category: 'Consumer Rights',
        categoryIcon: 'ShoppingCart',
        difficulty: 'intermediate',
        readTime: 9,
        image: 'https://img.rocket.new/generatedImages/rocket_gen_img_15b10e24c-1764649836727.png',
        imageAlt: 'Person reviewing rejected insurance claim document with angry expression',
        isFeatured: false,
        isAiGenerated: false,
        tags: ['insurance', 'claim rejection', 'ombudsman', 'IRDAI', 'consumer rights'],
        views: 2800,
        likes: 192,
        publishDate: new Date('2025-01-28'),
    },
    {
        title: 'airline Passenger Rights in India: Delays, Cancellations, and Lost Baggage',
        excerpt: 'DGCA regulations give you clear rights when flights are delayed or cancelled. Know the compensation you are entitled to and how to claim it from the airline.',
        content: `Airline passengers in India are protected by DGCA Civil Aviation Requirements (CAR) Section 3, Series M, Part IV. Your rights on flight delays: Delay of 2+ hours: Free meals and refreshments. Delay of 6+ hours on domestic flights: Option of full refund or rebooking. Compensation: ₹5,000 or booked ticket charge (whichever is lower) if informed less than 24 hours before departure and delay is 6+ hours. Your rights on cancellations: If airline cancels: Full refund within 7 business days, or alternate flight. If informed less than 2 weeks before departure: Compensation of ₹5,000–₹10,000 depending on notice period. Your rights on denied boarding (overbooking): Same flight arranged within 1 hour: No compensation. Arranged next day: ₹5,000 (flight under 1 hour) to ₹10,000 (flight over 2.5 hours). Baggage: Domestic: Up to ₹350 per kg for lost checked baggage. International: Governed by Montreal Convention — SDR 1,288 (approximately ₹1.4 lakh). How to claim: 1. At airport: Immediately file a Property Irregularity Report (PIR) for lost baggage. 2. Online: Airline's grievance portal. 3. If refused: DGCA complaints portal at dgca.gov.in or AirSewa app. 4. Consumer forum: For unresolved claims and mental agony.`,
        category: 'Consumer Rights',
        categoryIcon: 'ShoppingCart',
        difficulty: 'beginner',
        readTime: 7,
        image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1eb7c1cb3-1764655134961.png',
        imageAlt: 'Passengers at an airport terminal with flight delay board in background',
        isFeatured: false,
        isAiGenerated: false,
        tags: ['airline rights', 'flight delay', 'cancellation', 'DGCA', 'consumer rights', 'baggage'],
        views: 1900,
        likes: 138,
        publishDate: new Date('2025-02-08'),
    },

    // ═══════════════════════════════════════════════
    //  CONSTITUTIONAL RIGHTS
    // ═══════════════════════════════════════════════
    {
        title: 'How to File a Public Interest Litigation (PIL) in India',
        excerpt: 'A PIL is a powerful tool for citizens to seek justice for public causes. Learn who can file, in which court, at what cost, and what issues PILs succeed on.',
        content: `A Public Interest Litigation (PIL) allows any citizen to petition the Supreme Court (under Article 32) or a High Court (under Article 226) for the enforcement of Fundamental Rights on behalf of the public. Who can file a PIL: Any citizen of India, or a social activist, NGO, or even a court on its own (suo motu). No need to be the aggrieved party. Cost: Supreme Court filing fee: ₹50 (extremely low). High Court fees vary but are nominal. What PILs succeed on: Environmental protection (pollution, deforestation). Rights of prisoners, labour exploitation. Government inaction or corruption. Electoral malpractice. Child rights violations, bonded labour. How to file a PIL in High Court: Draft a petition addressing the Chief Justice. Include: Facts, constitutional provisions violated, relief sought. File in the HC Registry; it is listed before a division bench. The court issues notice to the respondents (usually government). How to file in Supreme Court: Use Supreme Court's Online Filing System (SCOFS) at sci.gov.in. Address to the Chief Justice of India. Required documents: Petition, affidavit, vakalatnama (if through lawyer), annexures. Tips: Focus on a specific, well-defined public issue. Attach news reports, RTI responses, or official data as evidence. PILs are not for private disputes disguised as public causes — courts impose costs for frivolous PILs.`,
        category: 'Constitutional Rights',
        categoryIcon: 'Scale',
        difficulty: 'intermediate',
        readTime: 10,
        image: 'https://images.unsplash.com/photo-1672419596694-185c04f15c6e?w=800',
        imageAlt: 'Indian Supreme Court building with Constitution of India book in foreground',
        isFeatured: false,
        isAiGenerated: false,
        tags: ['PIL', 'public interest litigation', 'Supreme Court', 'High Court', 'constitutional rights'],
        views: 2100,
        likes: 149,
        publishDate: new Date('2025-01-18'),
    },
    {
        title: 'Habeas Corpus Explained: The Writ That Protects Against Illegal Detention',
        excerpt: 'Habeas Corpus is the most fundamental writ in the Indian Constitution. Understand when to file it, how quickly courts act, and how it has protected citizens from illegal imprisonment.',
        content: `Habeas Corpus (Latin: "You shall have the body") is a writ under Article 32 (Supreme Court) and Article 226 (High Courts) commanding a person or authority to bring a detained individual before the court and justify the detention. When to file: When a person is illegally detained by police without valid grounds. When a person is in custody beyond the legally permissible period. When a person is detained by a private individual or institution. In cases of illegal police remand or judicial remand without jurisdiction. How it works: 1. A petition is filed by the detained person, a family member, or any concerned person. 2. The court issues a Rule, asking the detaining authority to justify the detention. 3. If no valid justification is given, the court orders immediate release. Timeline: Courts treat Habeas Corpus with utmost urgency — hearings can happen within 24–48 hours. Landmark cases: A.D.M. Jabalpur v. Shiv Kant Shukla (1976) — controversial ruling that suspended Habeas Corpus during Emergency. Maneka Gandhi v. Union of India (1978) — expanded the scope of personal liberty under Article 21. DK Basu v. State of West Bengal (1997) — laid down guidelines for arrest and detention to prevent custodial torture. Does not apply: Where detention is under a valid judicial order of a court. Limitations during National Emergency (Article 359).`,
        category: 'Constitutional Rights',
        categoryIcon: 'Scale',
        difficulty: 'advanced',
        readTime: 9,
        image: 'https://images.unsplash.com/photo-1672419596694-185c04f15c6e?w=800',
        imageAlt: 'High court courtroom with legal books representing habeas corpus writ petition',
        isFeatured: false,
        isAiGenerated: false,
        tags: ['habeas corpus', 'writ', 'illegal detention', 'Article 32', 'constitutional rights'],
        views: 1400,
        likes: 96,
        publishDate: new Date('2025-02-10'),
    },
    {
        title: 'Fundamental Rights Under the Indian Constitution: A Citizen\'s Guide',
        excerpt: 'Articles 12–35 of the Indian Constitution guarantee six Fundamental Rights to all citizens. Know which rights you have, their limits, and how to enforce them.',
        content: `The Indian Constitution guarantees the following Fundamental Rights: 1. Right to Equality (Articles 14–18): Equality before law and equal protection. No discrimination on grounds of religion, race, caste, sex, or place of birth. Equality of opportunity in public employment. Abolition of untouchability. Abolition of titles. 2. Right to Freedom (Articles 19–22): Freedom of speech, assembly, association, movement, residence, and profession. Protection against arrest without information of grounds. Right to legal counsel. Right against double jeopardy and self-incrimination. 3. Right against Exploitation (Articles 23–24): Prohibition of human trafficking and forced labour. No child labour in factories, mines, hazardous employment. 4. Right to Freedom of Religion (Articles 25–28): Freedom of conscience and religion. Freedom to manage religious affairs. 5. Cultural and Educational Rights (Articles 29–30): Protection of interests of minorities. Right of minorities to establish educational institutions. 6. Right to Constitutional Remedies (Articles 32–35): The right to move the Supreme Court for enforcement — Dr. Ambedkar called this "the heart and soul of the constitution." Limitations: Rights can be suspended during National Emergency (except Articles 20 and 21). Reasonable restrictions apply (e.g., free speech does not protect sedition, defamation). Enforcement: File a Writ Petition under Article 32 (SC) or 226 (HC) for violation.`,
        category: 'Constitutional Rights',
        categoryIcon: 'Scale',
        difficulty: 'beginner',
        readTime: 11,
        image: 'https://images.unsplash.com/photo-1672419596694-185c04f15c6e?w=800',
        imageAlt: 'Pages of the Indian Constitution showing fundamental rights with a gavel beside it',
        isFeatured: true,
        isAiGenerated: false,
        tags: ['fundamental rights', 'constitution', 'Article 19', 'Article 21', 'Article 32'],
        views: 5400,
        likes: 389,
        publishDate: new Date('2024-12-28'),
    },

    // ═══════════════════════════════════════════════
    //  CYBER CRIMES (additional)
    // ═══════════════════════════════════════════════
    {
        title: 'IT Act 2000 and its 2008 Amendments: Key Offences and Penalties',
        excerpt: 'The Information Technology Act 2000 is the primary law governing cybercrime in India. Know what is illegal online, which section applies, and the punishments.',
        content: `The IT Act 2000 (amended in 2008) is India's main legislation for cybercrime and digital communications. Key offences and sections: Section 43: Unauthorised access to computer, downloading data, introducing virus — compensation to victim (civil). Section 65: Tampering with computer source documents — Imprisonment up to 3 years or fine up to ₹2 lakh. Section 66: Computer related offences (dishonest/fraudulent intent) — Imprisonment up to 3 years + fine up to ₹5 lakh. Section 66A: (STRUCK DOWN by SC in Shreya Singhal case, 2015) — previously punished "offensive" online messages. Section 66C: Identity theft (using another's digital signature or password) — Imprisonment up to 3 years + fine up to ₹1 lakh. Section 66D: Cheating by personation using computer resource — Imprisonment up to 3 years + fine up to ₹1 lakh. Section 66E: Violation of privacy (capturing, transmitting private images without consent) — Imprisonment up to 3 years or fine up to ₹2 lakh. Section 66F: Cyber terrorism — Imprisonment up to life. Section 67: Publishing obscene material in electronic form — Imprisonment up to 3 years + fine up to ₹5 lakh. Section 67A: Publishing sexually explicit material — Imprisonment up to 5 years + fine up to ₹10 lakh. Section 67B: Child pornography — Imprisonment up to 5 years + fine up to ₹10 lakh. Section 72: Breach of confidentiality and privacy by service provider — Imprisonment up to 2 years or fine up to ₹1 lakh. Police: Cyber Cells exist in all states for investigation of IT Act offences.`,
        category: 'Cyber Crimes',
        categoryIcon: 'Shield',
        difficulty: 'intermediate',
        readTime: 11,
        image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1997ee4ca-1764672412138.png',
        imageAlt: 'Cyber security concept with padlock on digital circuit representing IT Act provisions',
        isFeatured: false,
        isAiGenerated: false,
        tags: ['IT Act', 'cybercrime', 'Section 66', 'identity theft', 'cyber law'],
        views: 2600,
        likes: 176,
        publishDate: new Date('2025-01-05'),
    },
    {
        title: 'Sextortion and Revenge Porn: Legal Remedies in India',
        excerpt: 'If someone is threatening to publish your intimate images, or already has, you have urgent legal remedies under the IT Act, BNS, and POCSO. Act fast — here is what to do.',
        content: `Sextortion is the threat to distribute intimate images (real or morphed) to extort money or sexual favours. Revenge porn is the non-consensual distribution of intimate images. Applicable laws: IT Act Section 66E: Publication of intimate images without consent — up to 3 years imprisonment. BNS Section 77 (formerly IPC 354C): Voyeurism — up to 7 years on second offence. BNS Section 79 (formerly IPC 504/506): Criminal intimidation — up to 2 years. IT Act Section 67/ 67A: Publishing obscene content — up to 5 years. POCSO Act: If the victim is a minor — far stricter penalties. What to do immediately: 1. Do NOT pay the extortionist — payment escalates demands. 2. Block the person on all platforms. 3. Screenshot / preserve all communications (screenshots of threats). 4. Request content removal from the platform (Facebook, Instagram, WhatsApp, X — all have urgent reporting processes). 5. Report to National Cyber Crime Reporting Portal (cybercrime.gov.in) — there is a dedicated category for this. 6. Call Cyber Crime helpline 1930. 7. File FIR at local police station. Victim identity protection: Courts treat victims of sexual offences with identity protection; police cannot disclose your name publicly. Where to get help: iCall (iitb.ac.in), Aalap, Cyber Peace Foundation — provide support and legal aid.`,
        category: 'Cyber Crimes',
        categoryIcon: 'Shield',
        difficulty: 'beginner',
        readTime: 7,
        image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1997ee4ca-1764672412138.png',
        imageAlt: 'Smartphone with warning sign symbolizing online harassment and digital threats',
        isFeatured: false,
        isAiGenerated: false,
        tags: ['sextortion', 'revenge porn', 'IT Act 66E', 'cyber crime', 'online harassment'],
        views: 3400,
        likes: 267,
        publishDate: new Date('2025-01-30'),
    },
];

async function seedEvergreenArticles() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        let inserted = 0;
        let skipped = 0;

        for (const art of EVERGREEN_ARTICLES) {
            const exists = await Article.findOne({ title: art.title }).lean();
            if (exists) {
                console.log(`  ⏭  Skipping (already exists): "${art.title}"`);
                skipped++;
            } else {
                await Article.create(art);
                console.log(`  ✅ Inserted: "${art.title}"`);
                inserted++;
            }
        }

        console.log(`\n─────────────────────────────────────────`);
        console.log(`  Inserted : ${inserted}`);
        console.log(`  Skipped  : ${skipped}`);
        console.log(`  Total    : ${EVERGREEN_ARTICLES.length}`);
        console.log(`─────────────────────────────────────────`);
    } catch (err) {
        console.error('❌ Seed error:', err.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

seedEvergreenArticles();
