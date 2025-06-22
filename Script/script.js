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

    fetch('./Data/Sponsoren/data.json')
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    })
    .then(data => {
        const container = document.getElementById('sponsoren-daten');
        if (!container) {
            console.error("#sponsoren-daten not found");
            return;
        }

        // Überschrift mit Icon
        const heading = document.createElement('h2');
        heading.innerHTML = `<i class="fas fa-hands-helping" style="margin-right: 0.5rem;"></i>Unsere Sponsoren`;
        heading.style.gridColumn = '1 / -1';
        container.appendChild(heading);

        // Sponsorenkarten erzeugen
        if (Array.isArray(data.sponsors)) {
            data.sponsors.forEach(name => {
                const card = document.createElement('div');
                card.className = 'sponsor-card';
                card.textContent = name;
                container.appendChild(card);
            });
        }

        // Spendenkonto als sponsor-card mit echtem Button + Icon
        if (data.donation_info) {
            const cardWrapper = document.createElement('div');
            cardWrapper.className = 'sponsor-card';

            const button = document.createElement('button');
            button.innerHTML = `<i class="fas fa-hand-point-up" style="margin-right: 0.5rem;"></i> Spenden Sie heute – für eine bessere Zukunft`;

            // Style (inline oder via CSS-Klasse)
            button.style.all = 'unset';
            button.style.cursor = 'pointer';
            button.style.display = 'flex';
            button.style.alignItems = 'center';
            button.style.justifyContent = 'center';
            button.style.width = '100%';
            button.style.fontSize = '1rem';
            button.style.fontWeight = '600';
            button.style.padding = '0.5rem 1rem';
            button.style.gap = '0.5rem';
            button.setAttribute('tabindex', '0');

            button.addEventListener('click', () => {
                Swal.fire({
                    title: 'Spendenkonto',
                    html: `
                        <p><strong>Kontoinhaber:</strong> ${data.donation_info.account_holder}</p>
                        <p><strong>IBAN:</strong> ${data.donation_info.iban}</p>
                    `,
                    icon: 'info',
                    confirmButtonText: 'Schließen',
                    confirmButtonColor: '#4fb8e6',
                    background: getComputedStyle(document.body).getPropertyValue('--body-color'),
                    color: getComputedStyle(document.body).getPropertyValue('--text-dark')
                });
            });

            button.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    button.click();
                }
            });

            cardWrapper.appendChild(button);
            container.appendChild(cardWrapper);
        }
    })
    .catch(error => {
        console.error('Fehler beim Laden der Sponsorendaten:', error);
        const container = document.getElementById('sponsoren-daten');
        if (container) {
            container.innerHTML = '<p class="error-message">Fehler beim Laden der Sponsorendaten.</p>';
        }
    });
