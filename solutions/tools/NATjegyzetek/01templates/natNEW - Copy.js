// === Általános dropdown nézetváltó logika mindkét szekcióhoz ===
document.addEventListener('DOMContentLoaded', function() {
    // --- Szekciók beállítása ---
    const sections = [
        {
            id: 'docs',
            iframeRow: document.querySelector('.iframe-row'),
            rightHalf: document.querySelector('.iframe-half-right'),
            leftHalf: document.querySelector('.iframe-half-left'),
            frameId: 'docs-frame02',
            navUrl: 'JEGYZET/OEBPS/Text/nav.xhtml',
            dropdownContainer: null,
            dropdownSelect: null
        },
        {
            id: 'drive',
            iframeRow: document.querySelectorAll('.iframe-row')[1],
            rightHalf: document.querySelectorAll('.iframe-half-right')[1],
            leftHalf: document.querySelectorAll('.iframe-half-left')[1],
            frameId: 'drive-frame02',
            navUrl: null, // dinamikusan választjuk ki
            dropdownContainer: null,
            dropdownSelect: null,
            sourceSelect: null // tankönyv/munkafüzet/atlasz választó
        }
    ];

    // --- Források az alsó szekcióhoz ---
    const driveSources = [
        {
            label: 'Tankönyv',
            navUrl: 'TK/OEBPS/navigation.xhtml'
        },
        {
            label: 'Munkafüzet',
            navUrl: 'MF/OEBPS/navigation.xhtml'
        },
        // Történelem esetén atlasz is
        {
            label: 'Atlasz',
            navUrl: 'AT/OEBPS/navigation.xhtml'
        }
    ];

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

    // --- Dropdown generálása nav.xhtml alapján ---
    function createDropdownFromNav(section, navUrl, targetFrameId) {
        // Ha már létezik, ne generáljuk újra
        if (section.dropdownContainer) return;
        section.dropdownContainer = document.createElement('div');
        section.dropdownContainer.className = 'toc-dropdown-container';
        const label = document.createElement('span');
        label.className = 'toc-dropdown-label';
        label.textContent = 'Tartalomjegyzék:';
        section.dropdownSelect = document.createElement('select');
        section.dropdownSelect.className = 'toc-dropdown';
        section.dropdownSelect.innerHTML = '<option value="">Válassz fejezetet...</option>';
        // Meghatározzuk az alap útvonalat a nav.xhtml alapján
        const basePath = navUrl.replace(/[^\/]+$/, '');
        fetch(navUrl)
            .then(resp => resp.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const links = doc.querySelectorAll('nav[epub\\:type="toc"] li a');
                links.forEach(link => {
                    const option = document.createElement('option');
                    let href = link.getAttribute('href');
                    if (href && !/^([a-z]+:|\/)/i.test(href)) {
                        href = basePath + href;
                    }
                    option.value = href;
                    option.textContent = link.textContent;
                    if (link.style && link.style.color === 'grey') {
                        option.disabled = true;
                        option.style.color = '#aaa';
                    }
                    section.dropdownSelect.appendChild(option);
                });
            });
        section.dropdownSelect.addEventListener('change', function() {
            if (this.value) {
                const frame = document.getElementById(targetFrameId);
                if (frame) frame.src = this.value;
            }
        });
        section.dropdownContainer.appendChild(label);
        section.dropdownContainer.appendChild(section.dropdownSelect);
        if (section.rightHalf) section.rightHalf.insertBefore(section.dropdownContainer, section.rightHalf.firstChild);
    }

    // --- Forrásválasztó dropdown az alsó szekcióhoz ---
    function createSourceSelector(section) {
        if (section.sourceSelect) return;
        section.sourceSelect = document.createElement('select');
        section.sourceSelect.className = 'toc-dropdown';
        section.sourceSelect.style.marginRight = '10px';
        section.sourceSelect.innerHTML = '<option value="">Válassz forrást...</option>';
        driveSources.forEach(src => {
            const option = document.createElement('option');
            option.value = src.navUrl;
            option.textContent = src.label;
            section.sourceSelect.appendChild(option);
        });
        section.sourceSelect.addEventListener('change', function() {
            // Előző fejezet dropdown törlése
            if (section.dropdownContainer && section.dropdownContainer.parentNode) {
                section.dropdownContainer.parentNode.removeChild(section.dropdownContainer);
                section.dropdownContainer = null;
                section.dropdownSelect = null;
            }
            if (this.value) {
                createDropdownFromNav(section, this.value, section.frameId);
            }
        });
        // A jobb oldali frame tetejére tesszük
        if (section.rightHalf) section.rightHalf.insertBefore(section.sourceSelect, section.rightHalf.firstChild);
    }

    // --- Nézetváltás mindkét szekcióban ---
    function setDropdownMode(enable) {
        dropdownMode = enable;
        sections.forEach(section => {
            if (section.iframeRow) {
                if (enable) {
                    section.iframeRow.classList.add('dropdown-mode');
                    if (section.id === 'docs') {
                        createDropdownFromNav(section, section.navUrl, section.frameId);
                        if (section.dropdownContainer) section.dropdownContainer.style.display = 'flex';
                    } else if (section.id === 'drive') {
                        createSourceSelector(section);
                        if (section.sourceSelect) section.sourceSelect.style.display = 'inline-block';
                    }
                } else {
                    section.iframeRow.classList.remove('dropdown-mode');
                    if (section.dropdownContainer) section.dropdownContainer.style.display = 'none';
                    if (section.sourceSelect) section.sourceSelect.style.display = 'none';
                }
            }
        });
    }

    // --- Gomb esemény ---
    if (dropdownBtn) {
        dropdownBtn.addEventListener('click', function() {
            setDropdownMode(!dropdownMode);
            const icon = document.getElementById('dropdown-switcher-icon');
            if (icon) icon.textContent = dropdownMode ? '📃' : '📑';
        });
    }
    setDropdownMode(false);
});
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
