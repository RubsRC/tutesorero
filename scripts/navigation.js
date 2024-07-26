document.addEventListener("DOMContentLoaded", () => {
  function showPage(pageId) {
    document.querySelectorAll(".page").forEach((page) => {
      page.style.display = page.id === pageId ? "block" : "none";
    });
  }

  document.querySelectorAll("nav a").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const pageId = event.target.getAttribute("href").substring(1);
      showPage(pageId);
    });
  });

  // Show the default page
  showPage("dashboard");
});
