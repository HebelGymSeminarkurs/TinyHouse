const body = document.querySelector("body"),
      nav = document.querySelector("nav"),
      modeToggle = document.querySelector(".dark-light"),
      searchToggle = document.querySelector(".searchToggle"),
      sidebarOpen = document.querySelector(".sidebarOpen"),
      siderbarClose = document.querySelector(".siderbarClose");

let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark-mode") {
    body.classList.add("dark");
}

// Toggle dark and light mode
modeToggle.addEventListener("click", () => {
    modeToggle.classList.toggle("active");
    body.classList.toggle("dark");

    // Save user's mode preference in localStorage
    if (!body.classList.contains("dark")) {
        localStorage.setItem("mode", "light-mode");
    } else {
        localStorage.setItem("mode", "dark-mode");
    }
});

// Toggle sidebar
sidebarOpen.addEventListener("click", () => {
    nav.classList.add("active");
});

body.addEventListener("click", (e) => {
    let clickedElm = e.target;

    if (!clickedElm.classList.contains("sidebarOpen") && !clickedElm.classList.contains("menu")) {
        nav.classList.remove("active");
    }
});
// Fetch JSON data and create buttons
fetch('./Config/TinyHouse.json')
    .then(response => response.json())
    .then(data => {
        const fortschrittButtons = document.getElementById('fortschritt-buttons');

        // Create buttons for each TinyHouse
        for (const key in data) {
            const button = document.createElement('button');
            button.textContent = key;
            button.addEventListener('click', () => {
                // Open the PDF in a new tab
                window.open(data[key], '_blank');
            });
            fortschrittButtons.appendChild(button);
        }
    })
    .catch(error => console.error('Error fetching JSON:', error));