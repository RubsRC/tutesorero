document.addEventListener("DOMContentLoaded", () => {
  const movementForm = document.getElementById("movementForm");
  const filterForm = document.getElementById("filterForm");
  const formHeader = document.getElementById("formHeader");
  const submitButton = document.getElementById("submitButton");
  const exportButton = document.getElementById("exportButton");
  const importButton = document.getElementById("importButton");
  const importFile = document.getElementById("importFile");

  const incomeTable = document
    .getElementById("incomeTable")
    .getElementsByTagName("tbody")[0];
  const fixedExpensesTable = document
    .getElementById("fixedExpensesTable")
    .getElementsByTagName("tbody")[0];
  const creditCardExpensesTable = document
    .getElementById("creditCardExpensesTable")
    .getElementsByTagName("tbody")[0];
  const debitCardExpensesTable = document
    .getElementById("debitCardExpensesTable")
    .getElementsByTagName("tbody")[0];
  const summaryTable = document
    .getElementById("summaryTable")
    .getElementsByTagName("tbody")[0];
  const dailyTransactionsTable = document
    .getElementById("dailyTransactionsTable")
    .getElementsByTagName("tbody")[0];
  const filteredBalanceElement = document.getElementById("filteredBalance");

  let incomeData = JSON.parse(localStorage.getItem("incomeData")) || [];
  let fixedExpensesData =
    JSON.parse(localStorage.getItem("fixedExpensesData")) || [];
  let creditCardExpensesData =
    JSON.parse(localStorage.getItem("creditCardExpensesData")) || [];
  let debitCardExpensesData =
    JSON.parse(localStorage.getItem("debitCardExpensesData")) || [];
  let editingIndex = null;
  let editingType = null;

  function formatAmount(amount) {
    return parseFloat(amount).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function clearForm() {
    document.getElementById("movementDate").value = "";
    document.getElementById("movementType").value = "Income";
    document.getElementById("movementDescription").value = "";
    document.getElementById("movementAmount").value = "";
    document.getElementById("movementCategory").value = "Supermarket";
    editingIndex = null;
    editingType = null;
    formHeader.textContent = "Add Movement";
    submitButton.textContent = "Add Movement";
  }

  function updateTable(table, data, type) {
    table.innerHTML = "";
    data.forEach((row, index) => {
      const newRow = table.insertRow();
      row.forEach((cell, cellIndex) => {
        const newCell = newRow.insertCell();
        newCell.textContent = cell;
        if (cellIndex === 2) {
          // amount column
          newCell.classList.add("amount");
          newCell.textContent = formatAmount(cell);
        }
      });
      const actionsCell = newRow.insertCell();
      actionsCell.classList.add("actions");
      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.addEventListener("click", () => editEntry(type, index));
      actionsCell.appendChild(editButton);

      const removeButton = document.createElement("button");
      removeButton.textContent = "Remove";
      removeButton.addEventListener("click", () => removeEntry(type, index));
      actionsCell.appendChild(removeButton);
    });
  }

  function saveData() {
    localStorage.setItem("incomeData", JSON.stringify(incomeData));
    localStorage.setItem(
      "fixedExpensesData",
      JSON.stringify(fixedExpensesData)
    );
    localStorage.setItem(
      "creditCardExpensesData",
      JSON.stringify(creditCardExpensesData)
    );
    localStorage.setItem(
      "debitCardExpensesData",
      JSON.stringify(debitCardExpensesData)
    );
  }

  function calculateSummary() {
    const summary = {};

    function addToSummary(date, amount, type) {
      const month = date.slice(0, 7);
      if (!summary[month]) {
        summary[month] = {
          income: 0,
          fixedExpenses: 0,
          creditCardExpenses: 0,
          debitCardExpenses: 0,
        };
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
    debitCardExpensesData.forEach(([date, , amount]) =>
      addToSummary(date, amount, "debitCardExpenses")
    );

    summaryTable.innerHTML = "";
    Object.keys(summary).forEach((month) => {
      const { income, fixedExpenses, creditCardExpenses, debitCardExpenses } =
        summary[month];
      const balance =
        income - (fixedExpenses + creditCardExpenses + debitCardExpenses);
      const newRow = summaryTable.insertRow();
      [
        month,
        income,
        fixedExpenses,
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
    const filteredDebitCardExpenses = debitCardExpensesData.filter(
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
    const totalDebitCardExpenses = filteredDebitCardExpenses.reduce(
      (sum, [_, __, amount]) => sum + parseFloat(amount),
      0
    );

    const filteredBalance =
      totalIncome -
      (totalFixedExpenses + totalCreditCardExpenses + totalDebitCardExpenses);
    filteredBalanceElement.textContent = formatAmount(filteredBalance);
  }

  function calculateDailyTransactions() {
    const transactions = [
      ...incomeData.map((d) => [...d, "Income"]),
      ...fixedExpensesData.map((d) => [...d, "Fixed Expense"]),
      ...creditCardExpensesData.map((d) => [...d, "Credit Card Expense"]),
      ...debitCardExpensesData.map((d) => [...d, "Debit Card Expense"]),
    ];

    transactions.sort((a, b) => new Date(a[0]) - new Date(b[0]));

    let balance = 0;
    dailyTransactionsTable.innerHTML = "";
    transactions.forEach(([date, description, amount, type, category]) => {
      balance += (type === "Income" ? 1 : -1) * parseFloat(amount);
      const newRow = dailyTransactionsTable.insertRow();
      [
        date,
        description,
        formatAmount(amount),
        type,
        category,
        formatAmount(balance),
      ].forEach((cell, index) => {
        const newCell = newRow.insertCell();
        newCell.textContent = cell;
        if (index === 2 || index === 5) newCell.classList.add("amount");
      });
    });
  }

  function editEntry(type, index) {
    let data;
    if (type === "Income") {
      data = incomeData;
    } else if (type === "Fixed Expense") {
      data = fixedExpensesData;
    } else if (type === "Credit Card Expense") {
      data = creditCardExpensesData;
    } else if (type === "Debit Card Expense") {
      data = debitCardExpensesData;
    }

    const [date, description, amount, category] = data[index];
    document.getElementById("movementDate").value = date;
    document.getElementById("movementType").value = type;
    document.getElementById("movementDescription").value = description;
    document.getElementById("movementAmount").value = amount;
    document.getElementById("movementCategory").value = category;

    editingIndex = index;
    editingType = type;
    formHeader.textContent = "Edit Movement";
    submitButton.textContent = "Update Movement";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function removeEntry(type, index) {
    if (type === "Income") {
      incomeData.splice(index, 1);
      updateTable(incomeTable, incomeData, "Income");
    } else if (type === "Fixed Expense") {
      fixedExpensesData.splice(index, 1);
      updateTable(fixedExpensesTable, fixedExpensesData, "Fixed Expense");
    } else if (type === "Credit Card Expense") {
      creditCardExpensesData.splice(index, 1);
      updateTable(
        creditCardExpensesTable,
        creditCardExpensesData,
        "Credit Card Expense"
      );
    } else if (type === "Debit Card Expense") {
      debitCardExpensesData.splice(index, 1);
      updateTable(
        debitCardExpensesTable,
        debitCardExpensesData,
        "Debit Card Expense"
      );
    }

    saveData();
    calculateSummary();
    calculateDailyTransactions();
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
        // Update in the same type array
        if (type === "Income") {
          incomeData[editingIndex] = movement;
          updateTable(incomeTable, incomeData, "Income");
        } else if (type === "Fixed Expense") {
          fixedExpensesData[editingIndex] = movement;
          updateTable(fixedExpensesTable, fixedExpensesData, "Fixed Expense");
        } else if (type === "Credit Card Expense") {
          creditCardExpensesData[editingIndex] = movement;
          updateTable(
            creditCardExpensesTable,
            creditCardExpensesData,
            "Credit Card Expense"
          );
        } else if (type === "Debit Card Expense") {
          debitCardExpensesData[editingIndex] = movement;
          updateTable(
            debitCardExpensesTable,
            debitCardExpensesData,
            "Debit Card Expense"
          );
        }
      } else {
        // Remove from old type array and add to new type array
        if (editingType === "Income") {
          incomeData.splice(editingIndex, 1);
          updateTable(incomeTable, incomeData, "Income");
        } else if (editingType === "Fixed Expense") {
          fixedExpensesData.splice(editingIndex, 1);
          updateTable(fixedExpensesTable, fixedExpensesData, "Fixed Expense");
        } else if (editingType === "Credit Card Expense") {
          creditCardExpensesData.splice(editingIndex, 1);
          updateTable(
            creditCardExpensesTable,
            creditCardExpensesData,
            "Credit Card Expense"
          );
        } else if (editingType === "Debit Card Expense") {
          debitCardExpensesData.splice(editingIndex, 1);
          updateTable(
            debitCardExpensesTable,
            debitCardExpensesData,
            "Debit Card Expense"
          );
        }

        if (type === "Income") {
          incomeData.push(movement);
          updateTable(incomeTable, incomeData, "Income");
        } else if (type === "Fixed Expense") {
          fixedExpensesData.push(movement);
          updateTable(fixedExpensesTable, fixedExpensesData, "Fixed Expense");
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
      }
    } else {
      // Add new entry
      if (type === "Income") {
        incomeData.push(movement);
        updateTable(incomeTable, incomeData, "Income");
      } else if (type === "Fixed Expense") {
        fixedExpensesData.push(movement);
        updateTable(fixedExpensesTable, fixedExpensesData, "Fixed Expense");
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
    }

    clearForm();
    saveData();
    calculateSummary();
    calculateDailyTransactions();
  });

  filterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    filterData(startDate, endDate);
  });

  exportButton.addEventListener("click", () => {
    const data = {
      incomeData,
      fixedExpensesData,
      creditCardExpensesData,
      debitCardExpensesData,
    };
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "finance_data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  importButton.addEventListener("click", () => {
    importFile.click();
  });

  importFile.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = JSON.parse(event.target.result);
        incomeData = data.incomeData || [];
        fixedExpensesData = data.fixedExpensesData || [];
        creditCardExpensesData = data.creditCardExpensesData || [];
        debitCardExpensesData = data.debitCardExpensesData || [];
        saveData();
        updateTable(incomeTable, incomeData, "Income");
        updateTable(fixedExpensesTable, fixedExpensesData, "Fixed Expense");
        updateTable(
          creditCardExpensesTable,
          creditCardExpensesData,
          "Credit Card Expense"
        );
        updateTable(
          debitCardExpensesTable,
          debitCardExpensesData,
          "Debit Card Expense"
        );
        calculateSummary();
        calculateDailyTransactions();
      };
      reader.readAsText(file);
    }
  });

  // Initial load
  updateTable(incomeTable, incomeData, "Income");
  updateTable(fixedExpensesTable, fixedExpensesData, "Fixed Expense");
  updateTable(
    creditCardExpensesTable,
    creditCardExpensesData,
    "Credit Card Expense"
  );
  updateTable(
    debitCardExpensesTable,
    debitCardExpensesData,
    "Debit Card Expense"
  );
  calculateSummary();
  calculateDailyTransactions();
});
