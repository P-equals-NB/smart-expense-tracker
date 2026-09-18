const defaultTransactions = [
  { description: "Monthly Salary", category: "Salary", type: "income", amount: 80000 },
  { description: "Dinner", category: "Food", type: "expense", amount: 140 },
  { description: "Travel to Chennai", category: "Transport", type: "expense", amount: 1000 },
  { description: "Netflix Subscription", category: "Entertainment", type: "expense", amount: 899 },
  { description: "Electricity Bill", category: "Bills", type: "expense", amount: 506 },
  { description: "Water Bill", category: "Bills", type: "expense", amount: 403 },
  { description: "Gas bill", category: "Bills", type: "expense", amount: 800 },
  { description: "Dental Checkup", category: "Health", type: "expense", amount: 3000 },
  { description: "Groceries", category: "Shopping", type: "expense", amount: 800 }
];

let transactions = JSON.parse(localStorage.getItem("expenseTransactions"));
if (!Array.isArray(transactions) || transactions.length === 0) {
  transactions = defaultTransactions;
}

let savingsGoal = Number(localStorage.getItem("expenseSavingsGoal")) || 10000;
const budgetLimit = Number(localStorage.getItem("expenseBudget")) || 10000;

const categoryColors = {
  Food: "#f06292",
  Transport: "#42a5e8",
  Entertainment: "#ffd05a",
  Bills: "#4caf50",
  Health: "#9c27b0",
  Shopping: "#ff9800",
  Other: "#90a4ae"
};

const money = value => "₹" + Number(value).toFixed(2);

function saveData() {
  localStorage.setItem("expenseTransactions", JSON.stringify(transactions));
  localStorage.setItem("expenseSavingsGoal", savingsGoal);
}

function render() {
  const income = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expenseTransactions = transactions.filter(t => t.type === "expense");
  const expense = expenseTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
  const balance = income - expense;

  const prediction = expenseTransactions.length
    ? expenseTransactions.reduce((sum, t) => sum + Number(t.amount), 0) / expenseTransactions.length
    : 0;

  document.getElementById("incomeTotal").textContent = money(income);
  document.getElementById("expenseTotal").textContent = money(expense);
  document.getElementById("balanceTotal").textContent = money(balance);
  document.getElementById("predictionTotal").textContent = money(prediction);

  document.getElementById("reportIncome").textContent = money(income);
  document.getElementById("reportExpense").textContent = money(expense);
  document.getElementById("reportSavings").textContent = money(balance);

  document.getElementById("goal").value = savingsGoal || "";

  const progress = savingsGoal > 0 ? Math.max(0, Math.min(100, balance / savingsGoal * 100)) : 0;
  document.getElementById("progressText").textContent = progress.toFixed(2) + "%";
  document.getElementById("progressBar").style.width = progress + "%";

  const alert = document.getElementById("budgetAlert");
  if (expense > budgetLimit) {
    alert.className = "alert warn";
    alert.textContent = "⚠ Spending has exceeded the budget";
  } else {
    alert.className = "alert ok";
    alert.textContent = "☑ Spending is within budget";
  }

  const rows = document.getElementById("transactionRows");
  rows.innerHTML = "";
  transactions.forEach(t => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHTML(t.description)}</td>
      <td>${escapeHTML(t.category)}</td>
      <td>${t.type}</td>
      <td>${money(t.amount)}</td>
    `;
    rows.appendChild(tr);
  });

  renderChart(expenseTransactions);
}

function renderChart(expenses) {
  const totals = {};
  expenses.forEach(t => {
    totals[t.category] = (totals[t.category] || 0) + Number(t.amount);
  });

  const total = Object.values(totals).reduce((a, b) => a + b, 0);
  const categories = Object.keys(totals);

  const legend = document.getElementById("legend");
  legend.innerHTML = categories.map(category => `
    <span class="legend-item">
      <span class="dot" style="background:${categoryColors[category] || categoryColors.Other}"></span>
      ${escapeHTML(category)}
    </span>
  `).join("");

  if (!total) {
    document.getElementById("pieChart").style.background = "#e0e0e0";
    return;
  }

  let angle = 0;
  const stops = [];
  categories.forEach(category => {
    const start = angle;
    angle += totals[category] / total * 360;
    const color = categoryColors[category] || categoryColors.Other;
    stops.push(`${color} ${start}deg ${angle}deg`);
  });

  document.getElementById("pieChart").style.background =
    `conic-gradient(${stops.join(", ")})`;
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.getElementById("transactionForm").addEventListener("submit", event => {
  event.preventDefault();

  const description = document.getElementById("description").value.trim();
  const amount = Number(document.getElementById("amount").value);
  const type = document.getElementById("type").value;
  const category = document.getElementById("category").value;

  if (!description || !amount || amount <= 0) return;

  transactions.push({ description, amount, type, category });
  saveData();
  render();

  event.target.reset();
  document.getElementById("type").value = "expense";
  document.getElementById("category").value = "Other";
});

document.getElementById("goalBtn").addEventListener("click", () => {
  const value = Number(document.getElementById("goal").value);
  if (value > 0) {
    savingsGoal = value;
    saveData();
    render();
  }
});

document.getElementById("exportBtn").addEventListener("click", () => {
  window.print();
});

render();
