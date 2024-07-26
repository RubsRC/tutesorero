let incomeData = JSON.parse(localStorage.getItem("incomeData")) || [];
let creditCardExpensesData =
  JSON.parse(localStorage.getItem("creditCardExpensesData")) || [];
let debitCardExpensesData =
  JSON.parse(localStorage.getItem("debitCardExpensesData")) || [];
let editingIndex = null;
let editingType = null;

function saveData() {
  localStorage.setItem("incomeData", JSON.stringify(incomeData));
  localStorage.setItem(
    "creditCardExpensesData",
    JSON.stringify(creditCardExpensesData)
  );
  localStorage.setItem(
    "debitCardExpensesData",
    JSON.stringify(debitCardExpensesData)
  );
}

function formatAmount(amount) {
  return parseFloat(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function updateTable(table, data, type) {
  let total = 0;
  table.innerHTML = "";
  data.forEach((row, index) => {
    total += parseFloat(row[2]);
    const newRow = table.insertRow();
    row.forEach((cell, cellIndex) => {
      const newCell = newRow.insertCell();
      newCell.textContent = cell;
      if (cellIndex === 2) {
        // amount column
        newCell.classList.add("amount");
        newCell.textContent = formatAmount(cell);
      }
    });
    const actionsCell = newRow.insertCell();
    actionsCell.classList.add("actions");
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => editEntry(type, index));
    actionsCell.appendChild(editButton);

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.classList.add("remove-button");
    removeButton.addEventListener("click", () => {
      if (confirm("Are you sure you want to remove this entry?")) {
        removeEntry(type, index);
      }
    });
    actionsCell.appendChild(removeButton);
  });
  const totalRow = table.insertRow();
  totalRow.innerHTML = `
        <td colspan="2"><strong>Total</strong></td>
        <td class="amount"><strong>${formatAmount(total)}</strong></td>
        <td colspan="2"></td>
    `;
}

function calculateSummary() {
  const summary = {};

  function addToSummary(date, amount, type) {
    const month = date.slice(0, 7);
    if (!summary[month]) {
      summary[month] = {
        income: 0,
        creditCardExpenses: 0,
        debitCardExpenses: 0,
      };
    }
    summary[month][type] += parseFloat(amount);
  }

  incomeData.forEach(([date, , amount]) =>
    addToSummary(date, amount, "income")
  );
  creditCardExpensesData.forEach(([date, , amount]) =>
    addToSummary(date, amount, "creditCardExpenses")
  );
  debitCardExpensesData.forEach(([date, , amount]) =>
    addToSummary(date, amount, "debitCardExpenses")
  );

  const summaryTable = document
    .getElementById("summaryTable")
    .getElementsByTagName("tbody")[0];
  summaryTable.innerHTML = "";
  Object.keys(summary).forEach((month) => {
    const { income, creditCardExpenses, debitCardExpenses } = summary[month];
    const balance = income - (creditCardExpenses + debitCardExpenses);
    const newRow = summaryTable.insertRow();
    [
      new Date(month).toLocaleString("default", {
        month: "long",
        year: "numeric",
      }),
      income,
      creditCardExpenses,
      debitCardExpenses,
      balance,
    ].forEach((cell, index) => {
      const newCell = newRow.insertCell();
      newCell.textContent = index > 0 ? formatAmount(cell) : cell;
      if (index > 0) newCell.classList.add("amount");
    });
  });
}

function filterData(startDate, endDate) {
  const filteredIncome = incomeData.filter(
    ([date]) => date >= startDate && date <= endDate
  );
  const filteredCreditCardExpenses = creditCardExpensesData.filter(
    ([date]) => date >= startDate && date <= endDate
  );
  const filteredDebitCardExpenses = debitCardExpensesData.filter(
    ([date]) => date >= startDate && date <= endDate
  );

  const totalIncome = filteredIncome.reduce(
    (sum, [_, __, amount]) => sum + parseFloat(amount),
    0
  );
  const totalCreditCardExpenses = filteredCreditCardExpenses.reduce(
    (sum, [_, __, amount]) => sum + parseFloat(amount),
    0
  );
  const totalDebitCardExpenses = filteredDebitCardExpenses.reduce(
    (sum, [_, __, amount]) => sum + parseFloat(amount),
    0
  );

  const filteredBalance =
    totalIncome - (totalCreditCardExpenses + totalDebitCardExpenses);
  document.getElementById("filteredBalance").textContent =
    formatAmount(filteredBalance);
}

function editEntry(type, index) {
  let data;
  if (type === "Income") {
    data = incomeData;
  } else if (type === "Credit Card Expense") {
    data = creditCardExpensesData;
  } else if (type === "Debit Card Expense") {
    data = debitCardExpensesData;
  }

  const [date, description, amount, category] = data[index];
  document.getElementById("movementDate").value = date;
  document.getElementById("movementType").value = type;
  document.getElementById("movementDescription").value = description;
  document.getElementById("movementAmount").value = amount;
  document.getElementById("movementCategory").value = category;

  editingIndex = index;
  editingType = type;
  document.getElementById("formHeader").textContent = "Edit Movement";
  document.getElementById("submitButton").textContent = "Update Movement";
  showPage("dashboard"); // Show the dashboard page where the form is located
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function removeEntry(type, index) {
  if (type === "Income") {
    incomeData.splice(index, 1);
    updateTable(
      document.getElementById("incomeTable").getElementsByTagName("tbody")[0],
      incomeData,
      "Income"
    );
  } else if (type === "Credit Card Expense") {
    creditCardExpensesData.splice(index, 1);
    updateTable(
      document
        .getElementById("creditCardExpensesTable")
        .getElementsByTagName("tbody")[0],
      creditCardExpensesData,
      "Credit Card Expense"
    );
  } else if (type === "Debit Card Expense") {
    debitCardExpensesData.splice(index, 1);
    updateTable(
      document
        .getElementById("debitCardExpensesTable")
        .getElementsByTagName("tbody")[0],
      debitCardExpensesData,
      "Debit Card Expense"
    );
  }

  saveData();
  calculateSummary();
  calculateDailyTransactions();
}

function calculateDailyTransactions() {
  const transactions = [
    ...incomeData.map((d) => [...d, "Income"]),
    ...creditCardExpensesData.map((d) => [...d, "Credit Card Expense"]),
    ...debitCardExpensesData.map((d) => [...d, "Debit Card Expense"]),
  ];

  transactions.sort((a, b) => new Date(b[0]) - new Date(a[0]));

  let balance = 0;
  const dailyTransactionsTable = document
    .getElementById("dailyTransactionsTable")
    .getElementsByTagName("tbody")[0];
  dailyTransactionsTable.innerHTML = "";
  transactions.forEach(([date, description, amount, category, type]) => {
    balance += (type === "Income" ? 1 : -1) * parseFloat(amount);
    const newRow = dailyTransactionsTable.insertRow();
    [
      date,
      description,
      formatAmount(amount),
      type,
      category,
      formatAmount(balance),
    ].forEach((cell, index) => {
      const newCell = newRow.insertCell();
      newCell.textContent = cell;
      if (index === 2 || index === 5) newCell.classList.add("amount");
    });
  });
}

// Helper function to show the specified page
function showPage(pageId) {
  document.querySelectorAll(".page").forEach((page) => {
    page.style.display = page.id === pageId ? "block" : "none";
  });
}
