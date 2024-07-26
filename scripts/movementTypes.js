document.addEventListener("DOMContentLoaded", () => {
  const incomeTable = document
    .getElementById("incomeTable")
    .getElementsByTagName("tbody")[0];
  const creditCardExpensesTable = document
    .getElementById("creditCardExpensesTable")
    .getElementsByTagName("tbody")[0];
  const debitCardExpensesTable = document
    .getElementById("debitCardExpensesTable")
    .getElementsByTagName("tbody")[0];

  function updateIncomeTable() {
    updateTable(incomeTable, incomeData, "Income");
  }

  function updateCreditCardExpensesTable() {
    updateTable(
      creditCardExpensesTable,
      creditCardExpensesData,
      "Credit Card Expense"
    );
  }

  function updateDebitCardExpensesTable() {
    updateTable(
      debitCardExpensesTable,
      debitCardExpensesData,
      "Debit Card Expense"
    );
  }

  updateIncomeTable();
  updateCreditCardExpensesTable();
  updateDebitCardExpensesTable();
});
