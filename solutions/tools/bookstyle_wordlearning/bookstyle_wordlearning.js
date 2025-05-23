const GITHUB_RAW_BASE_URL = 'https://raw.githubusercontent.com/Felisha76/portfolio/main/cs_templates/';
const CATEGORIES = { 'en_hu_': 'English - Hungarian' };

let currentState = 1;
let maxState = 0;

// DOM references
const book = document.getElementById('book');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

prevBtn.addEventListener('click', goPrevious);
nextBtn.addEventListener('click', goNext);

function getCategoryForFile(fileName) {
    for (const prefix in CATEGORIES) {
        if (fileName.startsWith(prefix)) return CATEGORIES[prefix];
    }
    return 'Other';
}

async function fetchCSVFileList() {
    try {
        const apiUrl = 'https://api.github.com/repos/Felisha76/portfolio/contents/cs_templates';
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data
            .filter(file => file.name.endsWith('.csv') && !file.name.startsWith('notes_'))
            .map(file => ({
                name: file.name,
                displayName: file.name
                    .replace(/^en_hu_/, '')
                    .replace(/\.csv$/, '')
                    .replace(/_/g, ' ')
            }));
    } catch (e) {
        console.error('Error loading file list:', e);
        return [];
    }
}

async function populateFileDropdown() {
    const files = await fetchCSVFileList();
    const container = document.getElementById('csv-dropdown-container');
    container.innerHTML = '';

    const select = document.createElement('select');
    select.id = 'csv-select';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a CSV file';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    files.forEach(file => {
        const option = document.createElement('option');
        option.value = file.name;
        option.textContent = file.displayName;
        select.appendChild(option);
    });

    select.addEventListener('change', () => {
        loadCSVFromGitHub(select.value);
    });

    container.appendChild(select);
}

async function loadCSVFromGitHub(fileName) {
    try {
        const response = await fetch(GITHUB_RAW_BASE_URL + fileName);
        const csvText = await response.text();
        const rows = csvText.split('\n').filter(row => row.trim()).map(r => r.split(',').map(c => c.trim()));
        renderBookPages(rows);
    } catch (e) {
        alert('Failed to load CSV.');
    }
}

/*function renderBookPages(rows) {
    book.innerHTML = '';
    currentState = 1;
    maxState = rows.length;

    rows.forEach((cols, i) => {
        if (cols.length < 2) return;

        const paper = document.createElement('div');
        paper.className = 'paper';
        paper.id = `p${i + 1}`;

        // Front: Ai + linebreak + Bi
        const front = document.createElement('div');
        front.className = 'front';
        front.innerHTML = `<span>${cols[0]}<br>${cols[1]}</span>`;

        // Back: Ai+1 + linebreak + Bi+1 (or empty if last row)
        const back = document.createElement('div');
        back.className = 'back';
        if (rows[i + 1] && rows[i + 1].length >= 2) {
            back.innerHTML = `<span>${rows[i + 1][0]}<br>${rows[i + 1][1]}</span>`;
        } else {
            back.innerHTML = `<span></span>`;
        }

        paper.appendChild(front);
        paper.appendChild(back);
        book.appendChild(paper);
    });
} */

function renderBookPages(rows) { //2nd try
    // Clear the book and reset state
    book.innerHTML = '';
    currentState = 1;

    // Get the selected title from the dropdown
    const select = document.getElementById('csv-select');
    const title = select ? select.options[select.selectedIndex].textContent : 'Book';

    // Calculate total pages: 1 (title) + rows.length (A) + rows.length (B)
    maxState = 1 + rows.length + rows.length;

    let pageNum = 1;

    // First paper: front = title, back = A1
    const paper1 = document.createElement('div');
    paper1.className = 'paper';
    paper1.id = `p${pageNum++}`;

    const front1 = document.createElement('div');
    front1.className = 'front';
    front1.innerHTML = `<span class="book-title">${title}</span>`;

    const back1 = document.createElement('div');
    back1.className = 'back';
    back1.innerHTML = rows[0] && rows[0][0] ? `<span>${rows[0][0]}</span>` : `<span></span>`;

    paper1.appendChild(front1);
    paper1.appendChild(back1);
    book.appendChild(paper1);

    // Next: alternate A2, B1, A3, B2, ...
    let aIndex = 1; // Already used A1
    let bIndex = 0;
    let isFrontA = true;

    while (aIndex < rows.length || bIndex < rows.length) {
        const paper = document.createElement('div');
        paper.className = 'paper';
        paper.id = `p${pageNum++}`;

        const front = document.createElement('div');
        front.className = 'front';
        const back = document.createElement('div');
        back.className = 'back';

        if (isFrontA && aIndex < rows.length) {
            // Front: Ai+1, Back: Bi
            front.innerHTML = `<span>${rows[aIndex][0]}</span>`;
            if (bIndex < rows.length) {
                back.innerHTML = `<span>${rows[bIndex][1]}</span>`;
            } else {
                back.innerHTML = `<span></span>`;
            }
            aIndex++;
            bIndex++;
        } else if (!isFrontA && bIndex < rows.length) {
            // Front: Bi+1, Back: Ai+1
            front.innerHTML = `<span>${rows[bIndex][1]}</span>`;
            if (aIndex < rows.length) {
                back.innerHTML = `<span>${rows[aIndex][0]}</span>`;
            } else {
                back.innerHTML = `<span></span>`;
            }
            bIndex++;
            aIndex++;
        }

        paper.appendChild(front);
        paper.appendChild(back);
        book.appendChild(paper);

        isFrontA = !isFrontA;
    }
}

function goNext() {
    if (currentState < maxState) {
        const paper = document.getElementById(`p${currentState}`);
        if (paper) {
            paper.classList.add('flipped');
            paper.style.zIndex = currentState;
        }
        if (currentState === 1) openBook();
        if (currentState === maxState - 1) closeBook(false);
        currentState++;
    }
}

function goPrevious() {
    if (currentState > 1) {
        currentState--;
        const paper = document.getElementById(`p${currentState}`);
        if (paper) {
            paper.classList.remove('flipped');
            paper.style.zIndex = maxState - currentState;
        }
        if (currentState === 1) closeBook(true);
        if (currentState === maxState - 1) openBook();
    }
}

function openBook() {
    book.style.transform = "translateX(50%)";
    prevBtn.style.transform = "translateX(-180px)";
    nextBtn.style.transform = "translateX(180px)";
}

function closeBook(isFirstPage) {
    book.style.transform = isFirstPage ? "translateX(0%)" : "translateX(100%)";
    prevBtn.style.transform = "translateX(0px)";
    nextBtn.style.transform = "translateX(0px)";
}

document.addEventListener('DOMContentLoaded', populateFileDropdown);
