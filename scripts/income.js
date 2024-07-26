document.addEventListener("DOMContentLoaded", () => {
  const incomeTable = document
    .getElementById("incomeTable")
    .getElementsByTagName("tbody")[0];

  function updateIncomeTable() {
    updateTable(incomeTable, incomeData, "Income");
  }

  updateIncomeTable();
});
