document.addEventListener("DOMContentLoaded", () => {
  const filterForm = document.getElementById("filterForm");
  const filteredBalanceElement = document.getElementById("filteredBalance");
  const summaryTable = document
    .getElementById("summaryTable")
    .getElementsByTagName("tbody")[0];

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

  filterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    filterData(startDate, endDate);
  });

  calculateSummary();
});
