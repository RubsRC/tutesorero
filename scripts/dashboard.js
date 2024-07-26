document.addEventListener("DOMContentLoaded", () => {
  const movementForm = document.getElementById("movementForm");
  const formHeader = document.getElementById("formHeader");
  const submitButton = document.getElementById("submitButton");
  const movementTypeSelect = document.getElementById("movementType");
  const movementCategorySelect = document.getElementById("movementCategory");
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");
  const filterForm = document.getElementById("filterForm");

  let incomeSortOrder = "DESC";
  let creditCardExpensesSortOrder = "DESC";
  let debitCardExpensesSortOrder = "DESC";

  const allCategories = {
    Income: ["Full time", "Freelance"],
    "Credit Card Expense": [
      "Clothing",
      "Fun",
      "Health",
      "Home",
      "Insurance",
      "Others",
      "Payments",
      "Pets",
      "Restaurants",
      "Savings",
      "Supermarket",
      "Transportation",
      "Vanity",
      "Subscription",
    ],
    "Debit Card Expense": [
      "Clothing",
      "Fun",
      "Health",
      "Home",
      "Insurance",
      "Others",
      "Payments",
      "Pets",
      "Restaurants",
      "Savings",
      "Supermarket",
      "Transportation",
      "Vanity",
      "Subscription",
    ],
  };

  function updateCategoryOptions() {
    const selectedType = movementTypeSelect.value;
    const categories = allCategories[selectedType];
    movementCategorySelect.innerHTML = "";
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      movementCategorySelect.appendChild(option);
    });
  }

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
    updateCategoryOptions();
  }

  function setDefaultFilterDates() {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDay <= 15 ? 1 : 16
    );
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDay <= 15
        ? 15
        : new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            0
          ).getDate()
    );

    startDateInput.value = startDate.toISOString().slice(0, 10);
    endDateInput.value = endDate.toISOString().slice(0, 10);
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
            "Income",
            incomeSortOrder
          );
        } else if (type === "Credit Card Expense") {
          creditCardExpensesData[editingIndex] = movement;
          updateTable(
            document
              .getElementById("creditCardExpensesTable")
              .getElementsByTagName("tbody")[0],
            creditCardExpensesData,
            "Credit Card Expense",
            creditCardExpensesSortOrder
          );
        } else if (type === "Debit Card Expense") {
          debitCardExpensesData[editingIndex] = movement;
          updateTable(
            document
              .getElementById("debitCardExpensesTable")
              .getElementsByTagName("tbody")[0],
            debitCardExpensesData,
            "Debit Card Expense",
            debitCardExpensesSortOrder
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
            "Income",
            incomeSortOrder
          );
        } else if (editingType === "Credit Card Expense") {
          creditCardExpensesData.splice(editingIndex, 1);
          updateTable(
            document
              .getElementById("creditCardExpensesTable")
              .getElementsByTagName("tbody")[0],
            creditCardExpensesData,
            "Credit Card Expense",
            creditCardExpensesSortOrder
          );
        } else if (editingType === "Debit Card Expense") {
          debitCardExpensesData.splice(editingIndex, 1);
          updateTable(
            document
              .getElementById("debitCardExpensesTable")
              .getElementsByTagName("tbody")[0],
            debitCardExpensesData,
            "Debit Card Expense",
            debitCardExpensesSortOrder
          );
        }

        if (type === "Income") {
          incomeData.push(movement);
          updateTable(
            document
              .getElementById("incomeTable")
              .getElementsByTagName("tbody")[0],
            incomeData,
            "Income",
            incomeSortOrder
          );
        } else if (type === "Credit Card Expense") {
          creditCardExpensesData.push(movement);
          updateTable(
            document
              .getElementById("creditCardExpensesTable")
              .getElementsByTagName("tbody")[0],
            creditCardExpensesData,
            "Credit Card Expense",
            creditCardExpensesSortOrder
          );
        } else if (type === "Debit Card Expense") {
          debitCardExpensesData.push(movement);
          updateTable(
            document
              .getElementById("debitCardExpensesTable")
              .getElementsByTagName("tbody")[0],
            debitCardExpensesData,
            "Debit Card Expense",
            debitCardExpensesSortOrder
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
          "Income",
          incomeSortOrder
        );
      } else if (type === "Credit Card Expense") {
        creditCardExpensesData.push(movement);
        updateTable(
          document
            .getElementById("creditCardExpensesTable")
            .getElementsByTagName("tbody")[0],
          creditCardExpensesData,
          "Credit Card Expense",
          creditCardExpensesSortOrder
        );
      } else if (type === "Debit Card Expense") {
        debitCardExpensesData.push(movement);
        updateTable(
          document
            .getElementById("debitCardExpensesTable")
            .getElementsByTagName("tbody")[0],
          debitCardExpensesData,
          "Debit Card Expense",
          debitCardExpensesSortOrder
        );
      }
    }

    clearForm();
    saveData();
    calculateSummary();
    calculateDailyTransactions();
  });

  filterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    filterData(startDate, endDate);
  });

  movementTypeSelect.addEventListener("change", updateCategoryOptions);

  clearForm();
  setDefaultFilterDates();
  calculateSummary();
  // Submit the filter form on initial load to show the current filtered balance
  filterForm.dispatchEvent(new Event("submit"));
});
