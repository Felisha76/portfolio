function processCSVContent(contents) {
    const rows = contents.split('\n');
    const cardsContainer = document.querySelector('.wrap');
    const columns = 5; // <--- ha változik a grid-template-columns, ezt szinkronban kell tartani!

    cardsContainer.innerHTML = '';
    
    rows.forEach((row, index) => {
        if (!row.trim()) return;
        
        const cols = row.split(',');
        if (cols.length >= 2) {
            const frontText = cols[0].trim();
            const backText = cols[1].trim();
            
            const card = document.createElement('div');
            card.classList.add('card');

            // Szélső osztályok hozzáadása
            const positionInRow = index % columns;
            if (positionInRow === 0) {
                card.classList.add('left-edge');
            } else if (positionInRow === columns - 1) {
                card.classList.add('right-edge');
            }

            const front = document.createElement('div');
            front.classList.add('front');
            front.innerHTML = `<span>${frontText}</span>`;

            const back = document.createElement('div');
            back.classList.add('back');
            back.innerHTML = `<span>${backText}</span>`;

            card.appendChild(front);
            card.appendChild(back);
            cardsContainer.appendChild(card);
        }
    });
}
