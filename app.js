document.addEventListener("DOMContentLoaded", () => {
  const incomeForm = document.getElementById("incomeForm");
  const fixedExpensesForm = document.getElementById("fixedExpensesForm");
  const creditCardExpensesForm = document.getElementById(
    "creditCardExpensesForm"
  );

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

  incomeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const date = document.getElementById("incomeDate").value;
    const source = document.getElementById("incomeSource").value;
    const amount = document.getElementById("incomeAmount").value;
    incomeData.push([date, source, amount]);
    updateTable(incomeTable, incomeData);
    calculateSummary();
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
  });
});
