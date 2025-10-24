

        // Hiba üzenet megjelenítése
        function showError(errorId) {
            const errorElement = document.getElementById(errorId);
            if (errorElement) {
                errorElement.style.display = 'block';
            }
        }


        // Responsive iframe magasság beállítása
        function adjustIframeHeight() {
            const iframes = document.querySelectorAll('.iframe-container');
            const viewportHeight = window.innerHeight;
            
            if (viewportHeight < 600) {
                iframes.forEach(container => {
                    container.style.height = '400px';
                });
            } else if (viewportHeight < 800) {
                iframes.forEach(container => {
                    container.style.height = '500px';
                });
            } else {
                iframes.forEach(container => {
                    container.style.height = '600px';
                });
            }
        }

        // Ablak átméretezésére reagálás
        window.addEventListener('resize', adjustIframeHeight);
        window.addEventListener('load', adjustIframeHeight);

        // Portrait orientation warning
        function handleOrientationChange() {
            const warningElement = document.querySelector('.portrait-warning');
            if (window.matchMedia('(orientation: portrait)').matches) {
                warningElement.style.display = 'flex';
            } else {
                warningElement.style.display = 'none';
            }
        }



        // Add event listener for orientation changes
        window.addEventListener('resize', handleOrientationChange);
        window.addEventListener('load', handleOrientationChange);

        // Kezdeti beállítás
        adjustIframeHeight();

