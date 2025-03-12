function loadCSV() {
    const fileInput = document.getElementById('quiz_csv');
    const file = fileInput.files[0];
    
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = function(event) {
        const contents = event.target.result;
        const rows = contents.split('\n');
        const cardsContainer = document.querySelector('.wrap');
        
        // Clear any existing cards
        cardsContainer.innerHTML = '';
        
        // Loop through the rows in the CSV file
        rows.forEach(row => {
            const columns = row.split(',');

            // Ensure we have both A and B column data
            if (columns.length >= 2) {
                const frontText = columns[0].trim();  // A column
                const backText = columns[1].trim();   // B column
                
                // Create a new card for each row
                const card = document.createElement('div');
                card.classList.add('card');

                const front = document.createElement('div');
                front.classList.add('front');
                front.innerHTML = `<span>${frontText}</span>`;
                
                const back = document.createElement('div');
                back.classList.add('back');
                back.innerHTML = `<span>${backText}</span>`;

                // Append the front and back to the card
                card.appendChild(front);
                card.appendChild(back);

                // Append the card to the container
                cardsContainer.appendChild(card);
            }
        });
    };
    
    // Read the file as text
    reader.readAsText(file);
}
