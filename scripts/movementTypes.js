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
  let incomeSortOrder = "DESC";
  let creditCardExpensesSortOrder = "DESC";
  let debitCardExpensesSortOrder = "DESC";

  function updateSortIcon(tableId, sortOrder) {
    const sortIcon = document.getElementById(`${tableId}DateSortIcon`);
    sortIcon.textContent = sortOrder === "DESC" ? "▼" : "▲";
  }

  function sortTableData(data, sortOrder) {
    return data.sort((a, b) => {
      const dateA = new Date(a[0]);
      const dateB = new Date(b[0]);
      return sortOrder === "DESC" ? dateB - dateA : dateA - dateB;
    });
  }

  function updateTable(table, data, type, sortOrder) {
    data = sortTableData(data, sortOrder);
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

  function updateIncomeTable() {
    updateTable(incomeTable, incomeData, "Income", incomeSortOrder);
  }

  function updateCreditCardExpensesTable() {
    updateTable(
      creditCardExpensesTable,
      creditCardExpensesData,
      "Credit Card Expense",
      creditCardExpensesSortOrder
    );
  }

  function updateDebitCardExpensesTable() {
    updateTable(
      debitCardExpensesTable,
      debitCardExpensesData,
      "Debit Card Expense",
      debitCardExpensesSortOrder
    );
  }

  document
    .getElementById("incomeTableHeader")
    .addEventListener("click", (event) => {
      if (
        event.target.tagName === "TH" &&
        event.target.textContent.includes("Date")
      ) {
        incomeSortOrder = incomeSortOrder === "DESC" ? "ASC" : "DESC";
        updateIncomeTable();
        updateSortIcon("incomeTable", incomeSortOrder);
      }
    });

  document
    .getElementById("creditCardExpensesTableHeader")
    .addEventListener("click", (event) => {
      if (
        event.target.tagName === "TH" &&
        event.target.textContent.includes("Date")
      ) {
        creditCardExpensesSortOrder =
          creditCardExpensesSortOrder === "DESC" ? "ASC" : "DESC";
        updateCreditCardExpensesTable();
        updateSortIcon("creditCardExpensesTable", creditCardExpensesSortOrder);
      }
    });

  document
    .getElementById("debitCardExpensesTableHeader")
    .addEventListener("click", (event) => {
      if (
        event.target.tagName === "TH" &&
        event.target.textContent.includes("Date")
      ) {
        debitCardExpensesSortOrder =
          debitCardExpensesSortOrder === "DESC" ? "ASC" : "DESC";
        updateDebitCardExpensesTable();
        updateSortIcon("debitCardExpensesTable", debitCardExpensesSortOrder);
      }
    });

  updateIncomeTable();
  updateCreditCardExpensesTable();
  updateDebitCardExpensesTable();
  updateSortIcon("incomeTable", incomeSortOrder);
  updateSortIcon("creditCardExpensesTable", creditCardExpensesSortOrder);
  updateSortIcon("debitCardExpensesTable", debitCardExpensesSortOrder);
});
