// === Dropdown/List nézetváltó logika ===
// Általánosítható, hogy drive-frame-re is működjön majd
document.addEventListener('DOMContentLoaded', function() {
    // --- Beállítások ---
    const sectionId = 'docs'; // vagy 'drive' a második szekcióhoz
    const iframeRow = document.querySelector('.iframe-row');
    const rightHalf = document.querySelector('.iframe-half-right');
    const leftHalf = document.querySelector('.iframe-half-left');
    const frameId = sectionId + '-frame02';
    const navFrameId = sectionId + '-frame01';
    // --- Gomb hozzáadása ---
    const header = document.querySelector('.header');
    if (header && !document.getElementById('dropdown-switcher')) {
        const btn = document.createElement('button');
        btn.id = 'dropdown-switcher';
        btn.title = 'Váltás lista/legördülő menü nézet között';
        btn.innerHTML = '<span id="dropdown-switcher-icon">📑</span>';
        btn.style.marginRight = '10px';
        header.appendChild(btn);
    }
    const dropdownBtn = document.getElementById('dropdown-switcher');
    let dropdownMode = false;
    let dropdownContainer = null;
    let dropdownSelect = null;

    // --- Dropdown generálása nav.xhtml alapján ---
    function createDropdownFromNav(navUrl, targetFrameId) {
        // Ha már létezik, ne generáljuk újra
        if (dropdownContainer) return;
        dropdownContainer = document.createElement('div');
        dropdownContainer.className = 'toc-dropdown-container';
        const label = document.createElement('span');
        label.className = 'toc-dropdown-label';
        label.textContent = 'Tartalomjegyzék:';
        dropdownSelect = document.createElement('select');
        dropdownSelect.className = 'toc-dropdown';
        dropdownSelect.innerHTML = '<option value="">Válassz fejezetet...</option>';
        // Meghatározzuk az alap útvonalat a nav.xhtml alapján
        const basePath = navUrl.replace(/[^\/]+$/, ''); // pl. 'JEGYZET/OEBPS/Text/'
        fetch(navUrl)
            .then(resp => resp.text())
            .then(html => {
                // DOMParser-rel feldolgozzuk
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const links = doc.querySelectorAll('nav[epub\\:type="toc"] li a');
                links.forEach(link => {
                    const option = document.createElement('option');
                    let href = link.getAttribute('href');
                    // Ha relatív, egészítsük ki az alap útvonallal
                    if (href && !/^([a-z]+:|\/)/i.test(href)) {
                        href = basePath + href;
                    }
                    option.value = href;
                    option.textContent = link.textContent;
                    if (link.style && link.style.color === 'grey') {
                        option.disabled = true;
                        option.style.color = '#aaa';
                    }
                    dropdownSelect.appendChild(option);
                });
            });
        dropdownSelect.addEventListener('change', function() {
            if (this.value) {
                // Betöltjük a kiválasztott oldalt a jobb oldali frame-be
                const frame = document.getElementById(targetFrameId);
                if (frame) frame.src = this.value;
            }
        });
        dropdownContainer.appendChild(label);
        dropdownContainer.appendChild(dropdownSelect);
        // A jobb oldali frame tetejére tesszük
        if (rightHalf) rightHalf.insertBefore(dropdownContainer, rightHalf.firstChild);
    }

    // --- Nézetváltás ---
    function setDropdownMode(enable) {
        dropdownMode = enable;
        if (iframeRow) {
            if (enable) {
                iframeRow.classList.add('dropdown-mode');
                createDropdownFromNav('JEGYZET/OEBPS/Text/nav.xhtml', frameId);
                if (dropdownContainer) dropdownContainer.style.display = 'flex';
            } else {
                iframeRow.classList.remove('dropdown-mode');
                if (dropdownContainer) dropdownContainer.style.display = 'none';
            }
        }
    }

    // --- Gomb esemény ---
    if (dropdownBtn) {
        dropdownBtn.addEventListener('click', function() {
            setDropdownMode(!dropdownMode);
            // Ikon váltás
            const icon = document.getElementById('dropdown-switcher-icon');
            if (icon) icon.textContent = dropdownMode ? '📃' : '📑';
        });
    }
    // Alapértelmezett: lista nézet
    setDropdownMode(false);
});
// Betöltési overlay elrejtése
        function hideLoading(loadingId) {
            const loadingElement = document.getElementById(loadingId);
            if (loadingElement) {
                setTimeout(() => {
                    loadingElement.style.opacity = '0';
                    setTimeout(() => {
                        loadingElement.style.display = 'none';
                    }, 300);
                }, 500);
            }
        }

        // Hiba üzenet megjelenítése
        function showError(errorId) {
            const errorElement = document.getElementById(errorId);
            if (errorElement) {
                errorElement.style.display = 'block';
            }
        }

        // Iframe frissítése
        function refreshFrame(frameId) {
            const frame = document.getElementById(frameId);
            if (frame) {
                const src = frame.src;
                frame.src = '';
                // Loading overlay megjelenítése
                let loadingId = '';
                if (frameId.startsWith('docs-frame')) {
                    loadingId = frameId.replace('docs-frame', 'docs-loading');
                } else if (frameId.startsWith('drive-frame')) {
                    loadingId = frameId.replace('drive-frame', 'drive-loading');
                }
                const loadingElement = document.getElementById(loadingId);
                if (loadingElement) {
                    loadingElement.style.display = 'flex';
                    loadingElement.style.opacity = '1';
                }
                setTimeout(() => {
                    frame.src = src;
                }, 100);
            }
        }

        // Automatikus betöltési timeout
        setTimeout(() => {
            const loadingElements = document.querySelectorAll('.loading-overlay');
            loadingElements.forEach(element => {
                if (element.style.display !== 'none') {
                    element.style.display = 'none';
                    // Hiba üzenet megjelenítése, ha a betöltés túl sokáig tart
                    const frameId = element.id.includes('docs') ? 'docs-error' : 'drive-error';
                    showError(frameId);
                }
            });
        }, 15000); // 15 másodperc timeout

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


        		// Flex switcher gomb működése
		const switcherBtn = document.getElementById('flex-switcher');
		const switcherIcon = document.getElementById('flex-switcher-icon');
		let flexIsRow = true;
		switcherBtn.addEventListener('click', function() {
			document.querySelectorAll('.iframe-row').forEach(row => {
				if (flexIsRow) {
					row.style.flexDirection = 'column';
				} else {
					row.style.flexDirection = 'row';
				}
			});
			flexIsRow = !flexIsRow;
			switcherIcon.textContent = flexIsRow ? '🔀' : '↕️';
		});

        // Add event listener for orientation changes
        window.addEventListener('resize', handleOrientationChange);
        window.addEventListener('load', handleOrientationChange);

        // Kezdeti beállítás
        adjustIframeHeight();

        // Konzol üzenet
        console.log('📚 Google Dokumentumok Megjelenítő betöltve');
        console.log('🔗 Docs link: https://docs.google.com/document/d/1x6brP_3EOoj85gPqCmhnlI4VYzOp5uhXqanKUydOQXE/preview');
        console.log('� PDF link: ../tankonyvek/TERMÉSZETTUDOMÁNY_TK_OH-TER06TA__teljes.pdf');
