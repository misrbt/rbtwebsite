// Rule-based FAQ chatbot — no backend, no API key, no external requests.
// Answers are matched by keyword against a fixed knowledge base built only
// from facts already published elsewhere on this site (see the FAQ section
// and footer). It never claims to be a human agent and never asks for or
// stores account numbers, passwords, or other sensitive info.

const RBT_CHATBOT_KB = [
  {
    keywords: ["hour", "open", "close", "time", "schedule", "weekend"],
    answer:
      "Our branches are open 9:00 AM to 3:00 PM, Monday through Friday. We're closed on weekends and public holidays.",
  },
  {
    keywords: ["safe", "secure", "insur", "pdic", "trust", "regulat", "bsp"],
    answer:
      "Yes. RBT Bank Inc. is regulated by the Bangko Sentral ng Pilipinas, and all deposits are insured by the PDIC up to ₱1,000,000 per depositor.",
  },
  {
    keywords: ["branch", "location", "near", "where", "address"],
    answer:
      "We have 13 locations: Main Office (Talisayan), Jasaan, Salay, CDO, and Maramag branches, plus Lite branches in Gingoog, Camiguin, Butuan, Manolo Fortich, Claveria, CDO, Iligan, and Kibawe. Visit our Contact page for the full directory, addresses, and map.",
    link: { href: "contact.html#branches", label: "View Branches" },
  },
  {
    keywords: ["saving", "deposit", "time deposit", "open an account"],
    answer:
      "Our deposit products are Savings Deposit (safe, convenient savings for everyday needs) and Time Deposit (higher returns for longer-term savings) — both insured up to ₱1,000,000 per depositor by PDIC. Visit any branch during banking hours with a valid ID to open an account.",
    link: { href: "products-services.html#deposit-products", label: "See Deposit Products" },
  },
  {
    keywords: ["agricultural loan", "agri loan", "farmer loan", "farming loan"],
    answer:
      "Our Agricultural Loan provides assistance for farmers and agri-businesses. Visit a branch to apply.",
    link: { href: "products-services.html#loan-products", label: "See Loan Products" },
  },
  {
    keywords: ["sme loan", "commercial loan", "business loan", "small business", "working capital"],
    answer:
      "Our SME/Commercial Loan offers working capital and financing for small and medium enterprises.",
    link: { href: "products-services.html#loan-products", label: "See Loan Products" },
  },
  {
    keywords: ["microfinance"],
    answer:
      "Our Microfinance Loan offers small loans designed to make a big difference for micro-entrepreneurs.",
    link: { href: "products-services.html#loan-products", label: "See Loan Products" },
  },
  {
    keywords: ["pensioner", "pension loan", "senior citizen loan", "retiree loan"],
    answer:
      "Our Pensioner's Loan is a special loan program for our senior clients.",
    link: { href: "products-services.html#loan-products", label: "See Loan Products" },
  },
  {
    keywords: ["salary loan", "payroll loan"],
    answer:
      "Our Salary Loan offers fast and convenient loans for regular employees.",
    link: { href: "products-services.html#loan-products", label: "See Loan Products" },
  },
  {
    keywords: ["loan", "borrow", "apply"],
    answer:
      "We offer 5 loan products: Agricultural, SME/Commercial, Microfinance, Pensioner's, and Salary loans. Visit a branch with a valid ID and the required documents, or start an application online first.",
    link: { href: "products-services.html#loan-products", label: "See Loan Products" },
  },
  {
    keywords: ["apply online", "qr code", "goodloan", "loan origination"],
    answer:
      "You can start a loan application anytime online through our digital loan origination partner (goodloan.com.ph) — you'll still need to visit a branch afterward to complete requirements and release the loan.",
    link: { href: "index.html#apply-online", label: "Apply for a Loan Online" },
  },
  {
    keywords: ["online bank", "mobile bank", "banking app", "atm", "internet bank"],
    answer:
      "We don't offer full online/mobile banking yet, and we don't have an ATM network. Loan applications can start online through our digital partner, but deposit transactions are still handled in person at a branch.",
  },
  {
    keywords: ["gcash", "maya", "cash in", "cash out", "e-wallet", "digital service"],
    answer:
      "You can cash in and cash out for GCash and Maya at our branches.",
    link: { href: "products-services.html#digital-services", label: "See Digital Services" },
  },
  {
    keywords: ["remit", "send money", "receive money", "pesonet", "transfer", "western union", "padala"],
    answer:
      "We offer remittance services so you can receive money from loved ones anytime, anywhere, available at our branches.",
    link: { href: "products-services.html#remittance", label: "See Remittance" },
  },
  {
    keywords: ["moresco"],
    answer:
      "MORESCO II bill payments can be made at our Main Office (Talisayan) and Salay Branch only.",
    link: { href: "products-services.html#other-services", label: "See Other Services" },
  },
  {
    keywords: ["pos", "point of sale", "bills payment", "pay bills"],
    answer:
      "Through our POS services you can pay bills, cash in, cash out, and more at our branches.",
    link: { href: "products-services.html#other-services", label: "See Other Services" },
  },
  {
    keywords: ["other service", "insurance", "mba"],
    answer:
      "Other services include bill payment (e.g. MORESCO II), loan origination, POS, and micro-insurance through the RBT-MBA. Ask a branch staff member for details.",
    link: { href: "products-services.html#other-services", label: "See Other Services" },
  },
  {
    keywords: ["property", "properties", "foreclosed", "real estate", "lot for sale", "acquired asset"],
    answer:
      "We have acquired properties for sale — agricultural, agri-residential, and residential lots across Misamis Oriental, Bukidnon, and Valencia City, ranging from about ₱80,000 up to several million pesos.",
    link: { href: "properties.html", label: "See Properties for Sale" },
  },
  {
    keywords: ["event", "anniversary", "csr", "mangrove", "medical mission", "clinic", "kibawe"],
    answer:
      "Recent highlights include our 60th Anniversary Celebration, a mangrove planting activity in Talisayan, a free Medical and Dental Clinic for the community, and the opening of our Branch Lite in Kibawe, Bukidnon.",
    link: { href: "index.html#events", label: "See Events & Highlights" },
  },
  {
    keywords: ["contact", "phone", "email", "reach", "call"],
    answer:
      "You can reach us at (088) 557-5115 / 09178951326, or headoffice@rbtbank.com. Our Head Office is on Rizal Street, Poblacion, Talisayan, Misamis Oriental.",
    link: { href: "contact.html", label: "Contact Us" },
  },
  {
    keywords: ["about", "history", "since", "year", "1966", "founded", "old"],
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
  {
    keywords: ["career", "job", "hiring", "work for", "employ", "vacancy", "position"],
    answer:
      "We currently have 4 open positions: Account Officer, Office Associate, MIS Assistant, and Business Development Officer. To apply, submit an application letter, resume, 2×2 ID photo, and transcript of records to our HR Department in Talisayan.",
    link: { href: "careers.html", label: "Careers" },
  },
  {
    keywords: ["hello", "hi", "hey", "good morning", "good afternoon"],
    answer: "Hello! How can I help you with RBT bank today?",
  },
  {
    keywords: ["thank", "thanks", "salamat"],
    answer: "You're welcome! Let me know if there's anything else I can help with.",
  },
  {
    keywords: ["bye", "goodbye"],
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
function rbtChatbotKeywordScore(input, keyword) {
  const words = keyword.split(/\s+/);
  if (words.length === 1) {
    return input.includes(keyword) ? 1 : 0;
  }
  const escaped = words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
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
      (max, kw) => Math.max(max, rbtChatbotKeywordScore(input, kw)),
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
