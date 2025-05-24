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
fetch('./Config/TinyHouse.json') // Replace with the correct path to your JSON file
    .then(response => response.json())
    .then(data => {
        const fortschrittButtons = document.getElementById('fortschritt-buttons');
        const sliderModal = document.getElementById('slider-modal');
        const sliderImage = document.getElementById('slider-image');
        const prevButton = document.getElementById('prev-button');
        const nextButton = document.getElementById('next-button');
        const closeButton = document.querySelector('.close');

        let currentImages = [];
        let currentIndex = 0;

        // Create buttons for each TinyHouse
        for (const key in data) {
            const button = document.createElement('button');
            button.textContent = key;
            button.addEventListener('click', () => openSlider(data[key]));
            fortschrittButtons.appendChild(button);
        }

        function openSlider(images) {
            currentImages = Object.values(images);
            currentIndex = 0;
            sliderImage.src = currentImages[currentIndex];
            sliderModal.style.display = 'block';
        }

        closeButton.addEventListener('click', () => {
            sliderModal.style.display = 'none';
        });

        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                sliderImage.src = currentImages[currentIndex];
            }
        });

        nextButton.addEventListener('click', () => {
            if (currentIndex < currentImages.length - 1) {
                currentIndex++;
                sliderImage.src = currentImages[currentIndex];
            }
        });

        window.addEventListener('click', (event) => {
            if (event.target === sliderModal) {
                sliderModal.style.display = 'none';
            }
        });
    })
    .catch(error => console.error('Error fetching JSON:', error));