document.addEventListener("DOMContentLoaded", () => {
  const dailyTransactionsTable = document
    .getElementById("dailyTransactionsTable")
    .getElementsByTagName("tbody")[0];
  let transactions = [];
  let currentSortOrder = "DESC";

  function calculateDailyTransactions(sortOrder = "DESC") {
    transactions = [
      ...incomeData.map((d) => [...d, "Income"]),
      ...creditCardExpensesData.map((d) => [...d, "Credit Card Expense"]),
      ...debitCardExpensesData.map((d) => [...d, "Debit Card Expense"]),
    ];

    transactions.sort((a, b) => {
      const dateA = new Date(a[0]);
      const dateB = new Date(b[0]);
      return sortOrder === "DESC" ? dateB - dateA : dateA - dateB;
    });

    let balance = 0;
    dailyTransactionsTable.innerHTML = "";
    transactions.forEach(([date, description, amount, category, type]) => {
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

  function updateSortIcon() {
    const sortIcon = document.getElementById("dateSortIcon");
    sortIcon.textContent = currentSortOrder === "DESC" ? "▼" : "▲";
  }

  document
    .getElementById("dailyTransactionsTableHeader")
    .addEventListener("click", (event) => {
      if (
        event.target.tagName === "TH" &&
        event.target.textContent.includes("Date")
      ) {
        currentSortOrder = currentSortOrder === "DESC" ? "ASC" : "DESC";
        calculateDailyTransactions(currentSortOrder);
        updateSortIcon();
      }
    });

  calculateDailyTransactions();
  updateSortIcon();
});
