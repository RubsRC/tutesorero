document.addEventListener("DOMContentLoaded", () => {
  const creditCardExpensesChartCtx = document
    .getElementById("creditCardExpensesChart")
    .getContext("2d");
  const debitCardExpensesChartCtx = document
    .getElementById("debitCardExpensesChart")
    .getContext("2d");

  function getCurrentMonthData(data) {
    const currentMonth = new Date().toISOString().slice(0, 7);
    return data.filter(([date]) => date.startsWith(currentMonth));
  }

  function calculateCategorySums(data) {
    return data.reduce((acc, [_, __, amount, category]) => {
      acc[category] = (acc[category] || 0) + parseFloat(amount);
      return acc;
    }, {});
  }

  function renderChart(ctx, data, title) {
    const labels = Object.keys(data);
    const values = Object.values(data);

    new Chart(ctx, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            label: title,
            data: values,
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
              "rgba(199, 199, 199, 0.2)",
              "rgba(83, 102, 255, 0.2)",
              "rgba(255, 99, 71, 0.2)",
              "rgba(47, 79, 79, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
              "rgba(199, 199, 199, 1)",
              "rgba(83, 102, 255, 1)",
              "rgba(255, 99, 71, 1)",
              "rgba(47, 79, 79, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: title,
          },
        },
      },
    });
  }

  function renderCharts() {
    const currentMonthCreditCardExpenses = getCurrentMonthData(
      creditCardExpensesData
    );
    const currentMonthDebitCardExpenses = getCurrentMonthData(
      debitCardExpensesData
    );

    const creditCardCategorySums = calculateCategorySums(
      currentMonthCreditCardExpenses
    );
    const debitCardCategorySums = calculateCategorySums(
      currentMonthDebitCardExpenses
    );

    renderChart(
      creditCardExpensesChartCtx,
      creditCardCategorySums,
      "Credit Card Expenses by Category"
    );
    renderChart(
      debitCardExpensesChartCtx,
      debitCardCategorySums,
      "Debit Card Expenses by Category"
    );
  }

  renderCharts();
});
