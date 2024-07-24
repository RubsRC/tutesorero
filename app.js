document.addEventListener("DOMContentLoaded", () => {
  const incomeForm = document.getElementById("incomeForm");
  const fixedExpensesForm = document.getElementById("fixedExpensesForm");
  const creditCardExpensesForm = document.getElementById(
    "creditCardExpensesForm"
  );
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
  const summaryTable = document
    .getElementById("summaryTable")
    .getElementsByTagName("tbody")[0];
  const dailyTransactionsTable = document
    .getElementById("dailyTransactionsTable")
    .getElementsByTagName("tbody")[0];
  const filteredBalanceElement = document.getElementById("filteredBalance");

  let incomeData = [];
  let fixedExpensesData = [];
  let creditCardExpensesData = [];

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

  function calculateSummary() {
    const summary = {};

    function addToSummary(date, amount, type) {
      const month = date.slice(0, 7);
      if (!summary[month]) {
        summary[month] = { income: 0, fixedExpenses: 0, creditCardExpenses: 0 };
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

    summaryTable.innerHTML = "";
    Object.keys(summary).forEach((month) => {
      const { income, fixedExpenses, creditCardExpenses } = summary[month];
      const balance = income - (fixedExpenses + creditCardExpenses);
      const newRow = summaryTable.insertRow();
      [month, income, fixedExpenses, creditCardExpenses, balance].forEach(
        (cell) => {
          const newCell = newRow.insertCell();
          newCell.textContent = cell;
        }
      );
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

    const filteredBalance =
      totalIncome - (totalFixedExpenses + totalCreditCardExpenses);
    filteredBalanceElement.textContent = filteredBalance.toFixed(2);
  }

  function calculateDailyTransactions() {
    console.log(incomeData);

    const transactions = [
      ...incomeData.map((d) => [...d, "Income"]),
      ...fixedExpensesData.map((d) => [...d, "Fixed Expense"]),
      ...creditCardExpensesData.map((d) => [...d, "Credit Card Expense"]),
    ];

    transactions.sort((a, b) => new Date(a[0]) - new Date(b[0]));

    console.log(transactions);

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

  incomeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const date = document.getElementById("incomeDate").value;
    const source = document.getElementById("incomeSource").value;
    const amount = document.getElementById("incomeAmount").value;
    incomeData.push([date, source, amount]);
    updateTable(incomeTable, incomeData);
    calculateSummary();
    calculateDailyTransactions();
  });

  fixedExpensesForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const date = document.getElementById("fixedExpensesDate").value;
    const description = document.getElementById(
      "fixedExpensesDescription"
    ).value;
    const amount = document.getElementById("fixedExpensesAmount").value;
    fixedExpensesData.push([date, description, amount]);
    updateTable(fixedExpensesTable, fixedExpensesData);
    calculateSummary();
    calculateDailyTransactions();
  });

  creditCardExpensesForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const date = document.getElementById("creditCardExpensesDate").value;
    const description = document.getElementById(
      "creditCardExpensesDescription"
    ).value;
    const amount = document.getElementById("creditCardExpensesAmount").value;
    creditCardExpensesData.push([date, description, amount]);
    updateTable(creditCardExpensesTable, creditCardExpensesData);
    calculateSummary();
    calculateDailyTransactions();
  });

  filterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    filterData(startDate, endDate);
  });
});
