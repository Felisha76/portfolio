// main_script.js - Tisztított verzió

document.addEventListener('DOMContentLoaded', () => {
    // Navigációs linkek kezelése
    const links = document.querySelectorAll('a[data-target]');
    const mainContent = document.getElementById('main-content');

    if (!mainContent) {
        console.error('Error: The element with id "main-content" was not found.');
        return; // Ha nincs ilyen elem, ne folytassuk a kód futását
    }

    links.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Az alapértelmezett link viselkedés megakadályozása
            const target = link.getAttribute('data-target');

            console.log(`Loading content from: ${target}`); // Naplózás a konzolba

            // Tartalom betöltése
            fetch(target)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(html => {
                    console.log(`Content loaded successfully from: ${target}`); // Sikeres betöltés naplózása
                    mainContent.innerHTML = html;
                })
                .catch(error => {
                    console.error('Error loading content:', error);
                    mainContent.innerHTML = `<p>Error loading content from ${target}. Please try again later.</p>`;
                });
        });
    });
});



