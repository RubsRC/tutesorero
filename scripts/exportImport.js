document.addEventListener("DOMContentLoaded", () => {
  const exportButton = document.getElementById("exportButton");
  const importButton = document.getElementById("importButton");
  const importFileInput = document.getElementById("importFileInput");

  exportButton.addEventListener("click", () => {
    const data = {
      incomeData,
      creditCardExpensesData,
      debitCardExpensesData,
    };
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "finance_data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });

  importButton.addEventListener("click", () => {
    importFileInput.click();
  });

  importFileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = JSON.parse(e.target.result);
        incomeData = data.incomeData || [];
        creditCardExpensesData = data.creditCardExpensesData || [];
        debitCardExpensesData = data.debitCardExpensesData || [];
        saveData();
        calculateSummary();
        calculateDailyTransactions();
        updateTable(
          document
            .getElementById("incomeTable")
            .getElementsByTagName("tbody")[0],
          incomeData,
          "Income",
          "DESC"
        );
        updateTable(
          document
            .getElementById("creditCardExpensesTable")
            .getElementsByTagName("tbody")[0],
          creditCardExpensesData,
          "Credit Card Expense",
          "DESC"
        );
        updateTable(
          document
            .getElementById("debitCardExpensesTable")
            .getElementsByTagName("tbody")[0],
          debitCardExpensesData,
          "Debit Card Expense",
          "DESC"
        );
        alert("Data imported successfully!");
      };
      reader.readAsText(file);
    }
  });
});
