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
    editingIndex = null;
    editingType = null;
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

    if (editingIndex !== null) {
      if (editingType === type) {
        if (type === "Income") {
          incomeData[editingIndex] = movement;
          updateTable(
            document
              .getElementById("incomeTable")
              .getElementsByTagName("tbody")[0],
            incomeData,
            "Income"
          );
        } else if (type === "Credit Card Expense") {
          creditCardExpensesData[editingIndex] = movement;
          updateTable(
            document
              .getElementById("creditCardExpensesTable")
              .getElementsByTagName("tbody")[0],
            creditCardExpensesData,
            "Credit Card Expense"
          );
        } else if (type === "Debit Card Expense") {
          debitCardExpensesData[editingIndex] = movement;
          updateTable(
            document
              .getElementById("debitCardExpensesTable")
              .getElementsByTagName("tbody")[0],
            debitCardExpensesData,
            "Debit Card Expense"
          );
        }
      } else {
        if (editingType === "Income") {
          incomeData.splice(editingIndex, 1);
          updateTable(
            document
              .getElementById("incomeTable")
              .getElementsByTagName("tbody")[0],
            incomeData,
            "Income"
          );
        } else if (editingType === "Credit Card Expense") {
          creditCardExpensesData.splice(editingIndex, 1);
          updateTable(
            document
              .getElementById("creditCardExpensesTable")
              .getElementsByTagName("tbody")[0],
            creditCardExpensesData,
            "Credit Card Expense"
          );
        } else if (editingType === "Debit Card Expense") {
          debitCardExpensesData.splice(editingIndex, 1);
          updateTable(
            document
              .getElementById("debitCardExpensesTable")
              .getElementsByTagName("tbody")[0],
            debitCardExpensesData,
            "Debit Card Expense"
          );
        }

        if (type === "Income") {
          incomeData.push(movement);
          updateTable(
            document
              .getElementById("incomeTable")
              .getElementsByTagName("tbody")[0],
            incomeData,
            "Income"
          );
        } else if (type === "Credit Card Expense") {
          creditCardExpensesData.push(movement);
          updateTable(
            document
              .getElementById("creditCardExpensesTable")
              .getElementsByTagName("tbody")[0],
            creditCardExpensesData,
            "Credit Card Expense"
          );
        } else if (type === "Debit Card Expense") {
          debitCardExpensesData.push(movement);
          updateTable(
            document
              .getElementById("debitCardExpensesTable")
              .getElementsByTagName("tbody")[0],
            debitCardExpensesData,
            "Debit Card Expense"
          );
        }
      }
    } else {
      if (type === "Income") {
        incomeData.push(movement);
        updateTable(
          document
            .getElementById("incomeTable")
            .getElementsByTagName("tbody")[0],
          incomeData,
          "Income"
        );
      } else if (type === "Credit Card Expense") {
        creditCardExpensesData.push(movement);
        updateTable(
          document
            .getElementById("creditCardExpensesTable")
            .getElementsByTagName("tbody")[0],
          creditCardExpensesData,
          "Credit Card Expense"
        );
      } else if (type === "Debit Card Expense") {
        debitCardExpensesData.push(movement);
        updateTable(
          document
            .getElementById("debitCardExpensesTable")
            .getElementsByTagName("tbody")[0],
          debitCardExpensesData,
          "Debit Card Expense"
        );
      }
    }

    clearForm();
    saveData();
    calculateSummary();
    calculateDailyTransactions();
  });

  clearForm();
  calculateSummary();
});
