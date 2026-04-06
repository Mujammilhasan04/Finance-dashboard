let transactions = JSON.parse(localStorage.getItem("data")) || [
  { date: "2026-03-01", amount: 5000, category: "Salary", type: "income" },
  { date: "2026-03-02", amount: 200, category: "Food", type: "expense" }
];

let role = "viewer";

function saveData() {
  localStorage.setItem("data", JSON.stringify(transactions));
}

function renderDashboard() {
  let income = 0;
  let expense = 0;

  transactions.forEach(t => {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  });

  let balance = income - expense;

  document.getElementById("dashboard").innerHTML = `
    <div class="card-container">
      <div class="card">Balance <br> ₹${balance}</div>
      <div class="card income">Income <br> ₹${income}</div>
      <div class="card expense">Expense <br> ₹${expense}</div>
    </div>

    <h3>Spending Breakdown</h3>
    <div id="chart"></div>
  `;

  renderChart();
}

function renderChart() {
  let data = {};

  transactions.forEach(t => {
    if (t.type === "expense") {
      data[t.category] = (data[t.category] || 0) + t.amount;
    }
  });

  let html = "";

  for (let key in data) {
    html += `
      <div>
        ${key} (₹${data[key]})
        <div class="bar" style="width:${data[key] / 5}px;"></div>
      </div>
    `;
  }

  document.getElementById("chart").innerHTML =
    html || "<p>No expense data</p>";
}

function renderTransactions(search = "") {
  let filtered = transactions.filter(t =>
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  if (filtered.length === 0) {
    document.getElementById("transactions").innerHTML =
      "<p>No transactions found</p>";
    return;
  }

  let html = `
    <table>
      <tr>
        <th>Date</th>
        <th>Amount</th>
        <th>Category</th>
        <th>Type</th>
      </tr>
  `;

  filtered.forEach(t => {
    html += `
      <tr>
        <td>${t.date}</td>
        <td class="${t.type}">₹${t.amount}</td>
        <td>${t.category}</td>
        <td>${t.type}</td>
      </tr>
    `;
  });

  html += "</table>";

  document.getElementById("transactions").innerHTML = html;
}

function addTransaction() {
  let amount = document.getElementById("amount").value;
  let category = document.getElementById("category").value;
  let type = document.getElementById("type").value;

  if (!amount || !category) {
    alert("Please fill all fields");
    return;
  }

  transactions.push({
    date: new Date().toISOString().split("T")[0],
    amount: Number(amount),
    category,
    type
  });

  saveData();
  renderAll();
}

function sortByAmount() {
  transactions.sort((a, b) => b.amount - a.amount);
  renderTransactions();
}

function renderInsights() {
  let max = 0;
  let category = "";

  transactions.forEach(t => {
    if (t.type === "expense" && t.amount > max) {
      max = t.amount;
      category = t.category;
    }
  });

  document.getElementById("insights").innerHTML = `
    <h2>Insights</h2>
    <p>Highest spending: ${category || "No data"}</p>
  `;
}

document.getElementById("search").addEventListener("input", e => {
  renderTransactions(e.target.value);
});

document.getElementById("roleSelect").addEventListener("change", e => {
  role = e.target.value;

  document.getElementById("formSection").style.display =
    role === "admin" ? "block" : "none";
});

function renderAll() {
  renderDashboard();
  renderTransactions();
  renderInsights();
}

renderAll()


