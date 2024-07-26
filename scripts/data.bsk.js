let incomeData = JSON.parse(localStorage.getItem("incomeData")) || [];
let creditCardExpensesData =
  JSON.parse(localStorage.getItem("creditCardExpensesData")) || [];
let debitCardExpensesData =
  JSON.parse(localStorage.getItem("debitCardExpensesData")) || [];

function saveData() {
  localStorage.setItem("incomeData", JSON.stringify(incomeData));
  localStorage.setItem(
    "creditCardExpensesData",
    JSON.stringify(creditCardExpensesData)
  );
  localStorage.setItem(
    "debitCardExpensesData",
    JSON.stringify(debitCardExpensesData)
  );
}

function formatAmount(amount) {
  return parseFloat(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function updateTable(table, data, type) {
  let total = 0;
  table.innerHTML = "";
  data.forEach((row, index) => {
    total += parseFloat(row[2]);
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
    removeButton.classList.add("remove-button");
    removeButton.addEventListener("click", () => {
      if (confirm("Are you sure you want to remove this entry?")) {
        removeEntry(type, index);
      }
    });
    actionsCell.appendChild(removeButton);
  });
  const totalRow = table.insertRow();
  totalRow.innerHTML = `
        <td colspan="2"><strong>Total</strong></td>
        <td class="amount"><strong>${formatAmount(total)}</strong></td>
        <td colspan="2"></td>
    `;
}

function filterData(startDate, endDate) {
  const filteredIncome = incomeData.filter(
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
  const totalCreditCardExpenses = filteredCreditCardExpenses.reduce(
    (sum, [_, __, amount]) => sum + parseFloat(amount),
    0
  );
  const totalDebitCardExpenses = filteredDebitCardExpenses.reduce(
    (sum, [_, __, amount]) => sum + parseFloat(amount),
    0
  );

  const filteredBalance =
    totalIncome - (totalCreditCardExpenses + totalDebitCardExpenses);
  document.getElementById("filteredBalance").textContent =
    formatAmount(filteredBalance);
}

function editEntry(type, index) {
  let data;
  if (type === "Income") {
    data = incomeData;
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
