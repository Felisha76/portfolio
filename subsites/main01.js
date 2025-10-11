// main_script.js BCK


// loading nav links to the main content section
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.profile-info a, .side-nav-links a'); // Navigációs linkek a felső sávban
    const mainContent = document.querySelector('.main'); // target area for the content
  
    links.forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault(); // prevent default link activity
  
        if (link.classList.contains('simpleLink')) {
            // if the link class="simpleLink", it shows the hre's content
            const targetUrl = link.getAttribute('href');
            mainContent.innerHTML = `
              <iframe src="${targetUrl}" name="mainFrame" style="width: 100%; height: 100%; border: none;"></iframe>
            `;
            return;
          }

        const targetUrl = link.getAttribute('href'); // getting url
  
        // loading content from csv
        fetch(targetUrl)
          .then(response => {
            if (!response.ok) throw new Error('Failed to load the page');
            return response.text();
          })
          .then(html => {
            mainContent.innerHTML = html; // showing csv content in the html
          })
          .catch(error => {
            mainContent.innerHTML = `<p>Error loading content: ${error.message}</p>`;
          });
      });
    });

    // Navigációs linkek iframe-be töltése
    links.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault(); // Alapértelmezett link viselkedés megakadályozása
            const targetUrl = link.getAttribute('href');
            iframe.src = targetUrl; // Az iframe tartalmának frissítése
        });
    });
  });


