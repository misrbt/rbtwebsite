// Loan calculator + currency converter. Pure client-side math — the
// converter uses a small static illustrative rate table (clearly labeled
// as such in the UI) rather than calling any live/third-party rates API,
// since no such integration was set up or authorized for this site.

function formatCurrency(value, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(value);
}

function initTabs() {
  const tabs = document.querySelectorAll(".calculator__tab");
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.setAttribute("aria-selected", "false"));
      tab.setAttribute("aria-selected", "true");

      document.querySelectorAll("[data-calculator], [data-converter]").forEach((panel) => {
        panel.hidden = panel.id !== tab.dataset.tabTarget;
      });
    });
  });
}

function initLoanCalculator() {
  const amount = document.getElementById("loan-amount");
  const rate = document.getElementById("loan-rate");
  const term = document.getElementById("loan-term");
  if (!amount || !rate || !term) return;

  function recalculate() {
    const principal = Number(amount.value);
    const annualRate = Number(rate.value);
    const months = Number(term.value);
    const monthlyRate = annualRate / 100 / 12;

    const monthlyPayment =
      monthlyRate === 0
        ? principal / months
        : (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);

    const total = monthlyPayment * months;
    const interest = total - principal;

    document.getElementById("loan-amount-output").textContent = formatCurrency(principal);
    document.getElementById("loan-rate-output").textContent = `${annualRate.toFixed(1)}%`;
    document.getElementById("loan-term-output").textContent = `${months} months`;
    document.getElementById("loan-monthly").textContent = formatCurrency(monthlyPayment);
    document.getElementById("loan-principal").textContent = formatCurrency(principal);
    document.getElementById("loan-interest").textContent = formatCurrency(interest);
    document.getElementById("loan-total").textContent = formatCurrency(total);
  }

  [amount, rate, term].forEach((input) => input.addEventListener("input", recalculate));
  recalculate();
}

function initCurrencyConverter() {
  const amountEl = document.getElementById("converter-amount");
  const fromEl = document.getElementById("converter-from");
  const toEl = document.getElementById("converter-to");
  const swapBtn = document.querySelector("[data-converter-swap]");
  if (!amountEl || !fromEl || !toEl) return;

  // Illustrative rates only (relative to 1 USD) — see the note in the UI.
  const RATES = { USD: 1, EUR: 0.92, GBP: 0.79, JPY: 151.5, CAD: 1.36 };

  function recalculate() {
    const amount = Number(amountEl.value) || 0;
    const from = fromEl.value;
    const to = toEl.value;

    const usd = amount / RATES[from];
    const converted = usd * RATES[to];
    const unitRate = RATES[to] / RATES[from];

    document.getElementById("converter-result").textContent = formatCurrency(converted, to);
    document.getElementById("converter-rate").textContent = `1 ${from} = ${unitRate.toFixed(4)} ${to}`;
  }

  [amountEl, fromEl, toEl].forEach((el) => el.addEventListener("input", recalculate));

  if (swapBtn) {
    swapBtn.addEventListener("click", () => {
      const temp = fromEl.value;
      fromEl.value = toEl.value;
      toEl.value = temp;
      recalculate();
    });
  }

  recalculate();
}

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initLoanCalculator();
  initCurrencyConverter();
});
