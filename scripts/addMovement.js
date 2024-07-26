document.addEventListener("DOMContentLoaded", () => {
  const movementForm = document.getElementById("movementForm");
  const formHeader = document.getElementById("formHeader");
  const submitButton = document.getElementById("submitButton");

  function clearForm() {
    document.getElementById("movementDate").value = new Date()
      .toISOString()
      .slice(0, 10);
    document.getElementById("movementType").value = "Credit Card Expense";
    document.getElementById("movementDescription").value = "";
    document.getElementById("movementAmount").value = "";
    document.getElementById("movementCategory").value = "Supermarket";
    formHeader.textContent = "Add Movement";
    submitButton.textContent = "Add Movement";
  }

  movementForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const date = document.getElementById("movementDate").value;
    const type = document.getElementById("movementType").value;
    const description = document.getElementById("movementDescription").value;
    const amount = document.getElementById("movementAmount").value;
    const category = document.getElementById("movementCategory").value;

    const movement = [date, description, amount, category];

    // Add to the appropriate data array based on type
    if (type === "Income") {
      incomeData.push(movement);
      updateTable(incomeTable, incomeData, "Income");
    } else if (type === "Credit Card Expense") {
      creditCardExpensesData.push(movement);
      updateTable(
        creditCardExpensesTable,
        creditCardExpensesData,
        "Credit Card Expense"
      );
    } else if (type === "Debit Card Expense") {
      debitCardExpensesData.push(movement);
      updateTable(
        debitCardExpensesTable,
        debitCardExpensesData,
        "Debit Card Expense"
      );
    }

    clearForm();
    saveData();
    calculateSummary();
    calculateDailyTransactions();
  });

  clearForm();
});
