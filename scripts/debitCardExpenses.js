document.addEventListener("DOMContentLoaded", () => {
  const debitCardExpensesTable = document
    .getElementById("debitCardExpensesTable")
    .getElementsByTagName("tbody")[0];

  function updateDebitCardExpensesTable() {
    updateTable(
      debitCardExpensesTable,
      debitCardExpensesData,
      "Debit Card Expense"
    );
  }

  updateDebitCardExpensesTable();
});
