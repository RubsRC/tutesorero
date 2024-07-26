document.addEventListener("DOMContentLoaded", () => {
  const creditCardExpensesTable = document
    .getElementById("creditCardExpensesTable")
    .getElementsByTagName("tbody")[0];

  function updateCreditCardExpensesTable() {
    updateTable(
      creditCardExpensesTable,
      creditCardExpensesData,
      "Credit Card Expense"
    );
  }

  updateCreditCardExpensesTable();
});
