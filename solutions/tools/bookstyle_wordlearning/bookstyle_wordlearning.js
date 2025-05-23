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

function renderBookPages(rows) {
    book.innerHTML = '';
    currentState = 1;

    const select = document.getElementById('csv-select');
    const title = select ? select.options[select.selectedIndex].textContent : 'Book';

    // Total pages: 1 (title) + rows.length (each row is a page, alternating front/back)
    maxState = 1 + rows.length;

    let pageNum = 1;

    // First paper: front = title, back = A1 + <br> + B1
    const paper1 = document.createElement('div');
    paper1.className = 'paper';
    paper1.id = `p${pageNum++}`;

    const front1 = document.createElement('div');
    front1.className = 'front';
    front1.innerHTML = `<span class="book-title">${title}</span>`;

    const back1 = document.createElement('div');
    back1.className = 'back';
    if (rows[0] && rows[0].length >= 2) {
        back1.innerHTML = `<span>${rows[0][0]}<br>${rows[0][1]}</span>`;
    } else {
        back1.innerHTML = `<span></span>`;
    }

    paper1.appendChild(front1);
    paper1.appendChild(back1);
    book.appendChild(paper1);

    // Next papers: front/back alternates, each with Ai+1 + <br> + Bi+1
    for (let i = 1; i < rows.length; i++) {
        const paper = document.createElement('div');
        paper.className = 'paper';
        paper.id = `p${pageNum++}`;

        const front = document.createElement('div');
        front.className = 'front';
        if (rows[i] && rows[i].length >= 2) {
            front.innerHTML = `<span>${rows[i][0]}<br>${rows[i][1]}</span>`;
        } else {
            front.innerHTML = `<span></span>`;
        }

        // Back is empty unless you want to continue the pattern
        const back = document.createElement('div');
        back.className = 'back';
        back.innerHTML = `<span></span>`;

        paper.appendChild(front);
        paper.appendChild(back);
        book.appendChild(paper);
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
