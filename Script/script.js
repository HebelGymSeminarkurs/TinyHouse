const body = document.querySelector("body"),
      nav = document.querySelector("nav"),
      modeToggle = document.querySelector(".dark-light"),
      searchToggle = document.querySelector(".searchToggle"),
      sidebarOpen = document.querySelector(".sidebarOpen"),
      siderbarClose = document.querySelector(".siderbarClose");

// Dark/Light Mode Handling
let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark-mode") {
    body.classList.add("dark");
}

modeToggle.addEventListener("click", () => {
    modeToggle.classList.toggle("active");
    body.classList.toggle("dark");
    localStorage.setItem("mode", body.classList.contains("dark") ? "dark-mode" : "light-mode");
});

// Sidebar Handling
sidebarOpen.addEventListener("click", () => {
    nav.classList.add("active");
});

body.addEventListener("click", (e) => {
    if (!e.target.classList.contains("sidebarOpen") && !e.target.classList.contains("menu")) {
        nav.classList.remove("active");
    }
});

// PDF Button Handling
fetch('./Config/TinyHouse.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const fortschrittButtons = document.getElementById('fortschritt-buttons');
        
        if (!fortschrittButtons) {
            console.error("Could not find #fortschritt-buttons element");
            return;
        }

        // Clear any existing buttons
        fortschrittButtons.innerHTML = '';

        // Create buttons for each TinyHouse
        for (const [key, pdfPath] of Object.entries(data)) {
            const button = document.createElement('button');
            button.textContent = key;
            
            button.addEventListener('click', () => {
                console.log(`Attempting to open PDF: ${pdfPath}`);
                
                try {
                    if (!pdfPath) {
                        throw new Error(`No PDF path specified for ${key}`);
                    }
                    
                    // Create temporary anchor tag for more reliable PDF opening
                    const a = document.createElement('a');
                    a.href = pdfPath;
                    a.target = '_blank';
                    a.rel = 'noopener noreferrer';
                    
                    // Some mobile browsers need this to be in the DOM
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    
                } catch (error) {
                    console.error(`Error opening PDF for ${key}:`, error);
                    alert(`Could not open PDF for ${key}. Please try again later.`);
                }
            });
            
            fortschrittButtons.appendChild(button);
        }
    })
    .catch(error => {
        console.error('Error loading TinyHouse data:', error);
        // Display user-friendly error message
        const fortschrittButtons = document.getElementById('fortschritt-buttons');
        if (fortschrittButtons) {
            fortschrittButtons.innerHTML = '<p class="error-message">Failed to load project data. Please try again later.</p>';
        }
    });