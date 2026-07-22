// Rule-based FAQ chatbot — no backend, no API key, no external requests.
// Answers are matched by keyword against a fixed knowledge base built only
// from facts already published elsewhere on this site (see the FAQ section
// and footer) or supplied by the bank. It never claims to be a human agent
// and never asks for or stores account numbers, passwords, or other
// sensitive info.
//
// ORDERING MATTERS. rbtChatbotFindAnswer keeps the FIRST entry that reaches
// the top score, so specific entries must come before general ones — the
// Teachers' Loan entry has to be seen before the catch-all "loan" entry, or
// "teachers loan requirements" would get the generic loan answer.

// Repeated verbatim across most loan products; kept in one place so the
// wording can't drift between answers.
const RBT_COMMON_REQS =
  "\n• Other common requirements — your branch will give you the full checklist.";

const RBT_CHATBOT_KB = [
  /* ── Deposit products ─────────────────────────────────────────────────── */
  {
    keywords: [
      "deposit requirement",
      "savings requirement",
      "open an account",
      "open account",
      "requirements for savings",
      "requirements to open",
    ],
    answer:
      "To open a Regular Savings or Time Deposit account, bring:\n" +
      "• Two (2) recent 1×1 ID pictures\n" +
      "• Latest Community Tax Certificate (cedula)\n" +
      "• Any valid ID\n\n" +
      "Deposits are insured by the PDIC up to ₱1 Million per depositor.",
    link: { href: "products-services.html#deposit-products", label: "See Deposit Products" },
  },
  {
    keywords: ["time deposit", "regular savings", "saving", "deposit"],
    answer:
      "We offer two deposit products:\n" +
      "• Regular Savings — safe, convenient savings for everyday needs\n" +
      "• Time Deposit — higher returns for longer-term savings\n\n" +
      "Both are insured by the PDIC up to ₱1 Million per depositor. To open one, bring two 1×1 ID pictures, your latest Community Tax Certificate, and any valid ID to a branch.",
    link: { href: "products-services.html#deposit-products", label: "See Deposit Products" },
  },

  /* ── Individual loan products (before the catch-all "loan" entry) ─────── */
  {
    keywords: ["smile", "sblaf", "entrepreneur loan", "medium industry"],
    answer:
      "SMILE (Small and Medium Industry Loans to Entrepreneur) is financial assistance for small and medium scale businesses, aimed at their liquidity or working capital needs.\n\n" +
      "Requirements:\n" +
      "• Acceptable collateral —\n" +
      "   REM: land title, tax declaration, sketch plan, latest tax receipts/clearance, and affidavit of non-tenancy (for agricultural land)\n" +
      "   CHM: registration of the property (OR/CR), insurance, certificate of ownership\n" +
      "• Passbook, for assignment of deposits\n" +
      "• Audited financial statements for the last 3 years\n" +
      "• Photocopy of bank statements (3 months)\n" +
      "• PDC (post-dated cheques)\n" +
      "• Standard Business Loan Application Form (SBLAF) — a separate form for Individual/Single Proprietorship and for Corporation/Cooperative/Partnership. Download it, fill it out, and submit it to your nearest RBT Bank branch." +
      RBT_COMMON_REQS,
    link: { href: "products-services.html#loan-products", label: "See Loan Products" },
  },
  {
    keywords: ["teacher loan", "teachers loan", "deped loan", "guro", "prc"],
    answer:
      "The Teachers' Loan is designed exclusively for teachers whose salaries are credited to their ATM cards.\n\n" +
      "Requirements:\n" +
      "• Photocopies of IDs: PRC, DepEd, GSIS, CSC or GURO certificate\n" +
      "• Appointment (permanent for 1 year)\n" +
      "• Photocopy of payslips — principal borrower and co-makers\n" +
      "• Latest Income Tax Return (ITR)\n" +
      "• Certificate of Good Standing signed by the Principal/Supervisor (the bank provides the form)\n" +
      "• The ATM card the salary is credited to — this must be surrendered to the bank\n" +
      "• Statement of account, if buying out a loan from another lending institution or individual" +
      RBT_COMMON_REQS,
    link: { href: "products-services.html#loan-products", label: "See Loan Products" },
  },
  {
    keywords: ["pensioner", "pension loan", "senior citizen loan", "retiree loan", "gsis", "pvao"],
    answer:
      "The Pensioners' Loan is for pensioners of GSIS, SSS, PVAO and others who regularly receive a pension.\n\n" +
      "Requirements:\n" +
      "• ATM card or passbook where the pension is credited\n" +
      "• Medical certificate, for pensioners above 60 years old\n" +
      "• Bank statement, for pensions credited to an ATM" +
      RBT_COMMON_REQS,
    link: { href: "products-services.html#loan-products", label: "See Loan Products" },
  },
  {
    keywords: ["salary loan", "payroll loan", "employee loan"],
    answer:
      "The Salary Loan is for salaried employees of government offices/agencies and private organisations. Both are paid via ATM or salary deduction, under a MOA.\n\n" +
      "Government employees:\n" +
      "• Photocopy of LGU/Brgy. ID and GSIS ID\n" +
      "• Appointment letter\n" +
      "• Photocopy of latest payslip\n" +
      "• Latest financial statement for the last 2 years\n\n" +
      "Private employees:\n" +
      "• Photocopy of Company ID and SSS ID\n" +
      "• Appointment letter\n" +
      "• Photocopy of latest payslip" +
      RBT_COMMON_REQS,
    link: { href: "products-services.html#loan-products", label: "See Loan Products" },
  },
  {
    keywords: ["agricultural loan", "agri loan", "farmer loan", "farming loan", "livestock", "poultry", "aquaculture"],
    answer:
      "The Agricultural Loan covers farming — labour for land preparation, farm materials and inputs, and farm machinery and equipment — plus hog, goat, cow and poultry raising, aquaculture, and other agriculture-related activities.\n\n" +
      "Requirements:\n" +
      "• Land title (OCT, TCT or Free Patent issued more than 5 years ago)\n" +
      "• Latest tax declaration\n" +
      "• Sketch plan\n" +
      "• Certificate of non-tenancy\n" +
      "• Tax clearance and latest tax receipts" +
      RBT_COMMON_REQS,
    link: { href: "products-services.html#loan-products", label: "See Loan Products" },
  },
  {
    keywords: ["wash loan", "water loan", "reservoir"],
    answer:
      "The WASH Loan is designed primarily for financing water repairs and enhancements, and for building water reservoirs.\n\n" +
      "Requirements:\n" +
      "• Cash-flow based assessment" +
      RBT_COMMON_REQS,
    link: { href: "products-services.html#loan-products", label: "See Loan Products" },
  },
  {
    keywords: ["kasaka", "kauban sa kalamboan", "startup capital", "start a small business"],
    answer:
      "The KASAKA Loan (Kauban sa Kalamboan) helps micro-entrepreneurs with their small business, and provides startup capital for those who want to begin one.\n\n" +
      "Requirements:\n" +
      "• Cash-flow based assessment" +
      RBT_COMMON_REQS,
    link: { href: "products-services.html#loan-products", label: "See Loan Products" },
  },
  {
    keywords: ["jewelry", "jewellery", "pawn", "sanla", "collateral jewelry"],
    answer:
      "The Micro-Jewelry (Pawn) Loan addresses immediate financial needs using jewellery and other acceptable items as collateral.\n\n" +
      "Requirement:\n" +
      "• Valuable jewellery only",
    link: { href: "products-services.html#loan-products", label: "See Loan Products" },
  },
  {
    keywords: ["home loan", "housing loan", "house loan", "home repair", "lot acquisition"],
    answer:
      "HOME (Housing Loan Opportunities for Micro & Medium Entrepreneurs) is for home repairs and improvements, new home construction, lot acquisition, and eventually loan assumption.\n\n" +
      "Requirements:\n" +
      "• Acceptable collateral — OCT/TCT, chattel, assignment of deposit, and serialised assets" +
      RBT_COMMON_REQS,
    link: { href: "products-services.html#loan-products", label: "See Loan Products" },
  },
  {
    keywords: ["microfinance", "micro finance", "micro loan"],
    answer:
      "Our Microfinance Loan offers small loans for micro-entrepreneurs, payable in weekly, semi-monthly or monthly instalments.",
    link: { href: "products-services.html#loan-products", label: "See Loan Products" },
  },
  {
    keywords: ["sme loan", "commercial loan", "business loan", "small business", "working capital"],
    answer:
      "For business financing we offer SMILE (Small and Medium Industry Loans to Entrepreneur) for small and medium scale businesses, and KASAKA for micro-entrepreneurs and startups. Ask me about either one for its requirements.",
    link: { href: "products-services.html#loan-products", label: "See Loan Products" },
  },
  {
    keywords: ["mri", "loan insurance", "fees and charges", "truth in lending", "disclosure statement", "interest rate"],
    answer:
      "All loans are subject to other fees and charges as provided by the Truth in Lending Act, and these are set out in the disclosure statement you receive. All loans are also insured under MRI (Mortgage Redemption Insurance).",
    link: { href: "products-services.html#loan-products", label: "See Loan Products" },
  },
  {
    keywords: ["common requirement", "other common requirements"],
    answer:
      "Most of our loans list \"other common requirements\" on top of the documents specific to that product. The exact checklist depends on the loan and your circumstances, so the branch handling your application will give it to you in full. Please contact or visit a branch and our staff will walk you through it.",
    link: { href: "contact.html", label: "Contact a Branch" },
  },

  /* ── General loan / requirements catch-alls ───────────────────────────── */
  {
    keywords: [
      "loan requirement",
      "requirements for loan",
      "requirements for applying",
      "requirements to apply",
      "what are the requirements",
      "requirement",
      "requirements",
      "documents needed",
      "what do i need",
    ],
    answer:
      "Requirements depend on which product you want.\n\n" +
      "• Deposit accounts — two 1×1 ID pictures, latest Community Tax Certificate, any valid ID\n" +
      "• Special services (remittance, e-wallet, POS) — 2 valid IDs and a transaction form from the office\n" +
      "• Loans — each product has its own list\n\n" +
      "Tell me which one you're interested in and I'll give you the full list: SMILE, Salary, Agricultural, Microfinance, WASH, KASAKA, Micro-Jewelry (Pawn), HOME, Teachers', or Pensioners' loan.",
    link: { href: "products-services.html", label: "Products & Services" },
  },
  {
    keywords: ["loan", "borrow", "utang", "hulam"],
    answer:
      "We offer flexible terms and rates, fast processing and approval, and personalised service. Our loan products are:\n" +
      "• SMILE — small and medium businesses\n" +
      "• Salary Loan — government and private employees\n" +
      "• Agricultural Loan — farming, livestock, aquaculture\n" +
      "• Microfinance Loan — weekly/semi-monthly/monthly instalments\n" +
      "• WASH Loan — water repairs and reservoirs\n" +
      "• KASAKA Loan — micro-entrepreneurs and startup capital\n" +
      "• Micro-Jewelry (Pawn) Loan\n" +
      "• HOME — housing repairs, construction, lot acquisition\n" +
      "• Teachers' Loan\n" +
      "• Pensioners' Loan\n\n" +
      "Ask me about any one of these for its requirements.",
    link: { href: "products-services.html#loan-products", label: "See Loan Products" },
  },
  {
    keywords: ["apply online", "qr code", "goodloan", "loan origination", "online application"],
    answer:
      "You can start a loan application anytime online through our digital loan origination partner (goodloan.com.ph) — you'll still need to visit a branch afterward to complete the requirements and release the loan.",
    link: { href: "index.html#apply-online", label: "Apply for a Loan Online" },
  },

  /* ── Special services ─────────────────────────────────────────────────── */
  {
    keywords: ["petnet", "western union", "cebuana", "lhuillier", "dragon pay", "dragonpay", "coins.ph"],
    answer:
      "We're an outlet for PETNET/Western Union, Cebuana Lhuillier remittances and other services, Dragon Pay (cash out), and Coins (cash in).\n\n" +
      "Requirements:\n" +
      "• 2 valid ID cards\n" +
      "• Transaction form, available at the office",
    link: { href: "products-services.html#remittance", label: "See Remittance" },
  },
  {
    keywords: ["gcash", "g-cash", "maya", "paymaya", "e-wallet", "ewallet", "cash in", "cash out"],
    answer:
      "You can cash in and cash out for G-Cash and PayMaya at our branches. We also handle Dragon Pay (cash out) and Coins (cash in).\n\n" +
      "Requirements:\n" +
      "• 2 valid ID cards\n" +
      "• Transaction form, available at the office",
    link: { href: "products-services.html#digital-services", label: "See Digital Services" },
  },
  {
    // "special" on its own, because the two-word "special service" scores
    // only 0.5 against the plural "special services" — \bservice\b won't
    // match inside "services" — and the general products entry then wins.
    keywords: ["special", "special service", "money transfer", "remit", "send money", "receive money", "transfer", "padala"],
    answer:
      "Our special services cover money transfer, e-wallet cash in/cash out, and remittances:\n" +
      "• PETNET/Western Union\n" +
      "• Point of Sale (POS)\n" +
      "• G-Cash — cash in and cash out\n" +
      "• Cebuana Lhuillier remittances and other services\n" +
      "• PayMaya — cash in and cash out\n" +
      "• Dragon Pay — cash out\n" +
      "• Coins — cash in\n\n" +
      "Requirements: 2 valid ID cards and a transaction form, available at the office.",
    link: { href: "products-services.html#remittance", label: "See Remittance" },
  },
  {
    keywords: ["moresco"],
    answer:
      "MORESCO II bill payments can be made at our Main Office (Talisayan) and Salay Branch only.",
    link: { href: "products-services.html#other-services", label: "See Other Services" },
  },
  {
    keywords: ["pos", "point of sale", "bills payment", "pay bills", "bayad"],
    answer:
      "Through our POS services you can pay bills, cash in, cash out, and more at our branches. MORESCO II bills specifically are accepted at the Main Office (Talisayan) and Salay Branch.\n\n" +
      "Requirements: 2 valid ID cards and a transaction form, available at the office.",
    link: { href: "products-services.html#other-services", label: "See Other Services" },
  },
  {
    keywords: ["other service", "insurance", "mba", "micro-insurance"],
    answer:
      "Other services include bill payment (e.g. MORESCO II), loan origination, POS, and micro-insurance through the RBT-MBA. Ask a branch staff member for details.",
    link: { href: "products-services.html#other-services", label: "See Other Services" },
  },
  {
    keywords: ["product", "service", "what do you offer", "offer"],
    answer:
      "We offer:\n" +
      "• Deposits — Regular Savings and Time Deposit\n" +
      "• Loans — SMILE, Salary, Agricultural, Microfinance, WASH, KASAKA, Micro-Jewelry (Pawn), HOME, Teachers', and Pensioners'\n" +
      "• Special services — PETNET/Western Union, POS, G-Cash, Cebuana Lhuillier, PayMaya, Dragon Pay, Coins\n\n" +
      "Ask me about any of them and I'll give you the requirements.",
    link: { href: "products-services.html", label: "Products & Services" },
  },

  /* ── Branches, hours, contact ─────────────────────────────────────────── */
  {
    // Above the hours entry on purpose: "open" is a substring of "opening",
    // so "kibawe branch opening" would otherwise be answered with our
    // banking hours. Bare "opening" is deliberately not a keyword here —
    // that would steal "opening hours" back the other way.
    keywords: ["kibawe", "claveria", "branch lite", "blu", "new branch", "branch opening"],
    answer:
      "Two recent Branch Lite openings:\n" +
      "• BLU Kibawe — opened 19 January 2025, along Sayre Highway, Poblacion, West Kibawe, Bukidnon\n" +
      "• BLU Claveria — opened 3 October 2025, in Poblacion, Claveria, Misamis Oriental, offering salary loans, SME loans, agricultural loans, and savings deposits",
    link: { href: "events.html#highlights", label: "See Event Highlights" },
  },
  {
    keywords: ["hour", "open", "close", "time", "schedule", "weekend"],
    answer:
      "Our branches are open 9:00 AM to 3:00 PM, Monday through Friday. We're closed on weekends and public holidays.",
  },
  {
    keywords: ["branch", "location", "near", "where", "address"],
    answer:
      "We have 13 locations: Main Office (Talisayan), Jasaan, Salay, CDO, and Maramag branches, plus Lite branches in Gingoog, Camiguin, Butuan, Manolo Fortich, Claveria, CDO, Iligan, and Kibawe. Visit our Contact page for the full directory, addresses, and map.",
    link: { href: "contact.html#branches", label: "View Branches" },
  },
  {
    keywords: ["contact", "phone", "email", "reach", "call", "number"],
    answer:
      "You can reach us at (088) 557-5115 / 09178951326, or headoffice@rbtbank.com. Our Head Office is on Rizal Street, Poblacion, Talisayan, Misamis Oriental.",
    link: { href: "contact.html", label: "Contact Us" },
  },
  {
    keywords: ["safe", "secure", "insur", "pdic", "trust", "regulat", "bsp"],
    answer:
      "Yes. RBT Bank Inc. is regulated by the Bangko Sentral ng Pilipinas, and all deposits are insured by the PDIC up to ₱1,000,000 per depositor.",
  },
  {
    keywords: ["online bank", "mobile bank", "banking app", "atm", "internet bank"],
    answer:
      "We don't offer full online/mobile banking yet, and we don't have an ATM network. Loan applications can start online through our digital partner, but deposit transactions are still handled in person at a branch.",
  },

  /* ── Events ───────────────────────────────────────────────────────────── */
  {
    keywords: ["timeline", "travel", "trip", "japan", "singapore", "korea", "vietnam", "hong kong", "bohol", "incentive"],
    answer:
      "Our timeline of events records the trips the Bank has provided for its officers and employees:\n" +
      "• 2015 — Singapore\n" +
      "• 2017 — Hong Kong\n" +
      "• 2019 — South Korea\n" +
      "• 2023 — Japan, and Bohol\n" +
      "• 2024 — Da Nang, Vietnam\n" +
      "• 2025 — Account Officers' trip\n\n" +
      "You can browse the photo album for each year on our Events page.",
    link: { href: "events.html#timeline", label: "See Timeline of Events" },
  },
  {
    keywords: ["mangrove", "environment", "planting", "coastal"],
    answer:
      "RBT Bank supports mangrove planting in the coastal areas of Guiwanon and Tagbocboc, Talisayan. Mangroves act as natural barriers against storm surges, prevent coastal erosion, and provide habitat for marine life — and the activity raises environmental awareness among our employees and the community.",
    link: { href: "events.html#highlights", label: "See Event Highlights" },
  },
  {
    keywords: ["medical", "dental", "clinic", "health", "medical mission"],
    answer:
      "Our Free Medical and Dental Clinic is one of the Bank's flagship CSR programmes. In partnership with Dingcong Sanitarium Hospital and 4K MBA, we bring a medical team directly to the community for free check-ups, consultations, and essential medicines.",
    link: { href: "events.html#highlights", label: "See Event Highlights" },
  },
  {
    keywords: ["anniversary", "60th", "golden year", "diamond"],
    answer:
      "RBT Bank celebrated its 60th (golden year) anniversary on 12 March 2026, with a series of activities commemorating the Bank's founding and boosting its Corporate Social Responsibility programme.",
    link: { href: "events.html#highlights", label: "See Event Highlights" },
  },
  {
    keywords: ["event", "csr", "activity", "community", "highlight"],
    answer:
      "Our Event Highlights cover the 60th anniversary celebration, mangrove planting in Talisayan, the free Medical and Dental Clinic, and the Branch Lite openings in Kibawe and Claveria. The Events page also has a timeline of albums from our overseas and local trips since 2015.",
    link: { href: "events.html", label: "See Events" },
  },

  /* ── About the bank ───────────────────────────────────────────────────── */
  {
    keywords: ["about", "history", "since", "1966", "founded", "old"],
    answer:
      "RBT Bank Inc. (formerly Rural Bank of Talisayan) was established on March 10, 1966 by Col. Alejandro G. Beltran Sr. with the Beltran, Alcid, and Seriña families. Today we're 60 years strong, with 12 offices/branches and over ₱1 billion in assets.",
    link: { href: "about.html", label: "About RBT Bank" },
  },
  {
    keywords: ["mission", "vision", "goal", "purpose"],
    answer:
      "Our mission is to provide excellent service to clients, fair returns to investors, and to be a partner in our communities' socio-economic development. Our vision is to be a strong, leading bank that helps every Filipino achieve financial stability and growth.",
    link: { href: "about.html", label: "About RBT Bank" },
  },
  {
    keywords: ["core value", "values"],
    answer:
      "Our 10 core values: God-fearing, Excellence, Accountability, Commitment, Integrity, Thrift, Professionalism, Teamwork, Creativity, and Responsiveness.",
    link: { href: "about.html", label: "About RBT Bank" },
  },
  {
    keywords: ["board of director", "chairman", "president", "ceo", "leadership", "who owns", "founder"],
    answer:
      "RBT Bank was founded by Col. Alejandro G. Beltran Sr. Our current Chairman is Christopher C. Beltran, and our President/CEO is Cesar G. Magallanes.",
    link: { href: "about.html", label: "About RBT Bank" },
  },

  /* ── Properties, careers, legal ───────────────────────────────────────── */
  {
    keywords: ["property", "properties", "foreclosed", "real estate", "lot for sale", "acquired asset", "house for sale"],
    answer:
      "We have acquired properties for sale — agricultural, agri-residential, and residential lots across Misamis Oriental, Bukidnon, and Valencia City, ranging from about ₱80,000 up to several million pesos. You can filter them by branch, classification, type, and price.",
    link: { href: "properties.html", label: "See Properties for Sale" },
  },
  {
    keywords: ["career", "job", "hiring", "work for", "employ", "vacancy", "position", "resume", "applicant"],
    answer:
      "We currently have 4 open positions: Account Officer, Office Associate, MIS Assistant, and Business Development Officer.\n\n" +
      "To apply, submit:\n" +
      "• Application letter\n" +
      "• Resume\n" +
      "• 2×2 ID photo\n" +
      "• Transcript of records\n\n" +
      "Send these to our HR Department in Talisayan.",
    link: { href: "careers.html#apply", label: "See Careers" },
  },
  {
    keywords: ["privacy", "data protection", "personal data", "dpo"],
    answer:
      "Our Privacy Policy explains how we collect, use, and protect your personal data. RBT Bank is also DPO/DPS registered with the National Privacy Commission.",
    link: { href: "privacy-policy.html", label: "Read Privacy Policy" },
  },
  {
    keywords: ["terms", "conditions", "legal"],
    answer: "You can read the full terms governing use of this website on our Terms & Conditions page.",
    link: { href: "terms-conditions.html", label: "Read Terms & Conditions" },
  },
  {
    keywords: ["sitemap", "site map", "all pages"],
    answer: "Our sitemap lists every page on this website in one place.",
    link: { href: "sitemap.html", label: "View Sitemap" },
  },
  {
    keywords: ["facebook", "social media", "follow"],
    answer:
      "You can follow RBT BANK INC., A Rural Bank on Facebook for the latest news and announcements.",
    link: { href: "contact.html", label: "Contact Us" },
  },

  /* ── Conversational (last: their keywords are short and match loosely) ── */
  {
    // whole:true — "hi" would otherwise match inside "this", "which", "hiring".
    whole: true,
    keywords: ["hello", "hi", "hey", "kumusta", "good morning", "good afternoon"],
    answer: "Hello! How can I help you with RBT Bank today?",
  },
  {
    whole: true,
    keywords: ["thank", "thanks", "salamat"],
    answer: "You're welcome! Let me know if there's anything else I can help with.",
  },
  {
    whole: true,
    keywords: ["bye", "goodbye", "paalam"],
    answer: "Thanks for visiting RBT Bank! Have a great day.",
  },
];

const RBT_CHATBOT_FALLBACK = {
  answer:
    "I don't have an answer for that yet. For anything account-specific, please visit a branch near you or reach us through our Contact page — our staff will be happy to help.",
  link: { href: "contact.html", label: "Contact Us" },
};

// Scores one keyword against the user's input. Single-word keywords are an
// exact substring check (unchanged from before). Multi-word keywords (e.g.
// "agricultural loan") now give partial credit for however many of their
// words appear anywhere in the input, not just as one exact phrase — so
// "loan for agriculture" or "agri business loan" still match "agricultural
// loan" reasonably well instead of requiring that exact wording. This is
// still plain keyword scoring, not real language understanding, but it's
// far more forgiving of rephrasing than a strict substring match.
function rbtChatbotEscape(word) {
  return word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function rbtChatbotKeywordScore(input, keyword, whole) {
  const words = keyword.split(/\s+/);
  if (words.length === 1) {
    // `whole` entries require a standalone word. Without it "hi" matches
    // inside "this"/"which"/"hiring" and hijacks unrelated questions —
    // everything else still uses a substring so stems like "insur" keep
    // catching "insurance" and "insured".
    return whole
      ? new RegExp(`\\b${rbtChatbotEscape(keyword)}\\b`).test(input)
        ? 1
        : 0
      : input.includes(keyword)
        ? 1
        : 0;
  }
  const escaped = words.map(rbtChatbotEscape);
  const matched = escaped.filter((w) => new RegExp(`\\b${w}\\b`).test(input)).length;
  return matched / words.length;
}

// A minimum confidence floor — without it, a single weak partial-word match
// on an unrelated question could still "win" just for having the highest
// (if only) non-zero score, giving a confidently wrong answer instead of
// admitting it doesn't know.
const RBT_CHATBOT_MIN_CONFIDENCE = 0.5;

function rbtChatbotFindAnswer(rawInput) {
  const input = rawInput.toLowerCase();
  let best = null;
  let bestScore = 0;

  RBT_CHATBOT_KB.forEach((entry) => {
    const score = entry.keywords.reduce(
      (max, kw) => Math.max(max, rbtChatbotKeywordScore(input, kw, entry.whole)),
      0
    );
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  });

  return bestScore >= RBT_CHATBOT_MIN_CONFIDENCE ? best : RBT_CHATBOT_FALLBACK;
}

function initChatbot() {
  const root = document.querySelector("[data-chatbot]");
  if (!root) return;

  const toggle = root.querySelector("[data-chatbot-toggle]");
  const panel = root.querySelector("[data-chatbot-panel]");
  const closeBtn = root.querySelector("[data-chatbot-close]");
  const messages = root.querySelector("[data-chatbot-messages]");
  const form = root.querySelector("[data-chatbot-form]");
  const input = root.querySelector("[data-chatbot-input]");
  const chips = root.querySelectorAll("[data-chatbot-chip]");

  function scrollToEnd() {
    messages.scrollTop = messages.scrollHeight;
  }

  function addMessage(text, role, link) {
    const bubble = document.createElement("div");
    bubble.className = `chatbot__message chatbot__message--${role}`;

    const p = document.createElement("p");
    p.textContent = text;
    bubble.appendChild(p);

    if (link) {
      const a = document.createElement("a");
      a.href = link.href;
      a.className = "chatbot__message-link";
      a.textContent = link.label + " →";
      bubble.appendChild(a);
    }

    messages.appendChild(bubble);
    scrollToEnd();
  }

  function respondTo(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    addMessage(trimmed, "user");
    input.value = "";

    const { answer, link } = rbtChatbotFindAnswer(trimmed);

    // Small delay reads as "thinking" rather than an instant canned reply.
    window.setTimeout(() => {
      addMessage(answer, "bot", link);
    }, 350);
  }

  function setOpen(isOpen) {
    panel.setAttribute("data-open", String(isOpen));
    toggle.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) {
      input.focus();
      scrollToEnd();
    }
  }

  toggle.addEventListener("click", () => {
    setOpen(panel.getAttribute("data-open") !== "true");
  });

  closeBtn.addEventListener("click", () => setOpen(false));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.getAttribute("data-open") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    respondTo(input.value);
  });

  chips.forEach((chip) => {
    chip.addEventListener("click", () => respondTo(chip.textContent));
  });
}

document.addEventListener("DOMContentLoaded", initChatbot);
