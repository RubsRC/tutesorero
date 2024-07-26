document.addEventListener("DOMContentLoaded", () => {
  const dailyTransactionsTable = document
    .getElementById("dailyTransactionsTable")
    .getElementsByTagName("tbody")[0];

  function calculateDailyTransactions() {
    const transactions = [
      ...incomeData.map((d) => [...d, "Income"]),
      ...creditCardExpensesData.map((d) => [...d, "Credit Card Expense"]),
      ...debitCardExpensesData.map((d) => [...d, "Debit Card Expense"]),
    ];

    transactions.sort((a, b) => new Date(a[0]) - new Date(b[0]));

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

  calculateDailyTransactions();
});
