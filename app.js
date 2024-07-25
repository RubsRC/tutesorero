document.addEventListener("DOMContentLoaded", () => {
  const movementForm = document.getElementById("movementForm");
  const filterForm = document.getElementById("filterForm");

  const incomeTable = document
    .getElementById("incomeTable")
    .getElementsByTagName("tbody")[0];
  const fixedExpensesTable = document
    .getElementById("fixedExpensesTable")
    .getElementsByTagName("tbody")[0];
  const creditCardExpensesTable = document
    .getElementById("creditCardExpensesTable")
    .getElementsByTagName("tbody")[0];
  const debitCardExpensesTable = document
    .getElementById("debitCardExpensesTable")
    .getElementsByTagName("tbody")[0];
  const summaryTable = document
    .getElementById("summaryTable")
    .getElementsByTagName("tbody")[0];
  const dailyTransactionsTable = document
    .getElementById("dailyTransactionsTable")
    .getElementsByTagName("tbody")[0];
  const filteredBalanceElement = document.getElementById("filteredBalance");

  let incomeData = JSON.parse(localStorage.getItem("incomeData")) || [];
  let fixedExpensesData =
    JSON.parse(localStorage.getItem("fixedExpensesData")) || [];
  let creditCardExpensesData =
    JSON.parse(localStorage.getItem("creditCardExpensesData")) || [];
  let debitCardExpensesData =
    JSON.parse(localStorage.getItem("debitCardExpensesData")) || [];

  function updateTable(table, data) {
    table.innerHTML = "";
    data.forEach((row) => {
      const newRow = table.insertRow();
      row.forEach((cell) => {
        const newCell = newRow.insertCell();
        newCell.textContent = cell;
      });
    });
  }

  function saveData() {
    localStorage.setItem("incomeData", JSON.stringify(incomeData));
    localStorage.setItem(
      "fixedExpensesData",
      JSON.stringify(fixedExpensesData)
    );
    localStorage.setItem(
      "creditCardExpensesData",
      JSON.stringify(creditCardExpensesData)
    );
    localStorage.setItem(
      "debitCardExpensesData",
      JSON.stringify(debitCardExpensesData)
    );
  }

  function calculateSummary() {
    const summary = {};

    function addToSummary(date, amount, type) {
      const month = date.slice(0, 7);
      if (!summary[month]) {
        summary[month] = {
          income: 0,
          fixedExpenses: 0,
          creditCardExpenses: 0,
          debitCardExpenses: 0,
        };
      }
      summary[month][type] += parseFloat(amount);
    }

    incomeData.forEach(([date, , amount]) =>
      addToSummary(date, amount, "income")
    );
    fixedExpensesData.forEach(([date, , amount]) =>
      addToSummary(date, amount, "fixedExpenses")
    );
    creditCardExpensesData.forEach(([date, , amount]) =>
      addToSummary(date, amount, "creditCardExpenses")
    );
    debitCardExpensesData.forEach(([date, , amount]) =>
      addToSummary(date, amount, "debitCardExpenses")
    );

    summaryTable.innerHTML = "";
    Object.keys(summary).forEach((month) => {
      const { income, fixedExpenses, creditCardExpenses, debitCardExpenses } =
        summary[month];
      const balance =
        income - (fixedExpenses + creditCardExpenses + debitCardExpenses);
      const newRow = summaryTable.insertRow();
      [
        month,
        income,
        fixedExpenses,
        creditCardExpenses,
        debitCardExpenses,
        balance,
      ].forEach((cell) => {
        const newCell = newRow.insertCell();
        newCell.textContent = cell;
      });
    });
  }

  function filterData(startDate, endDate) {
    const filteredIncome = incomeData.filter(
      ([date]) => date >= startDate && date <= endDate
    );
    const filteredFixedExpenses = fixedExpensesData.filter(
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
    const totalFixedExpenses = filteredFixedExpenses.reduce(
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
      totalIncome -
      (totalFixedExpenses + totalCreditCardExpenses + totalDebitCardExpenses);
    filteredBalanceElement.textContent = filteredBalance.toFixed(2);
  }

  function calculateDailyTransactions() {
    const transactions = [
      ...incomeData.map((d) => [...d, "Income"]),
      ...fixedExpensesData.map((d) => [...d, "Fixed Expense"]),
      ...creditCardExpensesData.map((d) => [...d, "Credit Card Expense"]),
      ...debitCardExpensesData.map((d) => [...d, "Debit Card Expense"]),
    ];

    transactions.sort((a, b) => new Date(a[0]) - new Date(b[0]));

    let balance = 0;
    dailyTransactionsTable.innerHTML = "";
    transactions.forEach(([date, description, amount, type]) => {
      balance += (type === "Income" ? 1 : -1) * parseFloat(amount);
      const newRow = dailyTransactionsTable.insertRow();
      [date, description, amount, type, balance.toFixed(2)].forEach((cell) => {
        const newCell = newRow.insertCell();
        newCell.textContent = cell;
      });
    });
  }

  movementForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const date = document.getElementById("movementDate").value;
    const type = document.getElementById("movementType").value;
    const description = document.getElementById("movementDescription").value;
    const amount = document.getElementById("movementAmount").value;

    if (type === "Income") {
      incomeData.push([date, description, amount]);
      updateTable(incomeTable, incomeData);
    } else if (type === "Fixed Expense") {
      fixedExpensesData.push([date, description, amount]);
      updateTable(fixedExpensesTable, fixedExpensesData);
    } else if (type === "Credit Card Expense") {
      creditCardExpensesData.push([date, description, amount]);
      updateTable(creditCardExpensesTable, creditCardExpensesData);
    } else if (type === "Debit Card Expense") {
      debitCardExpensesData.push([date, description, amount]);
      updateTable(debitCardExpensesTable, debitCardExpensesData);
    }

    saveData();
    calculateSummary();
    calculateDailyTransactions();
  });

  filterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    filterData(startDate, endDate);
  });

  // Initial load
  updateTable(incomeTable, incomeData);
  updateTable(fixedExpensesTable, fixedExpensesData);
  updateTable(creditCardExpensesTable, creditCardExpensesData);
  updateTable(debitCardExpensesTable, debitCardExpensesData);
  calculateSummary();
  calculateDailyTransactions();
});
