document.addEventListener('DOMContentLoaded', function() {
    const fileSelect = document.getElementById('fileSelect');
    const searchInput = document.getElementById('searchInput');
    const tableBody = document.getElementById('tableBody');
    const loadingIndicator = document.getElementById('loadingIndicator');    
    // GitHub repository information
    const GITHUB_RAW_BASE_URL = 'https://raw.githubusercontent.com/Felisha76/portfolio/main/cs_templates/';
    const GITHUB_API_URL = 'https://api.github.com/repos/Felisha76/portfolio/contents/cs_templates';

    // Current data
    let currentData = [];
    
    // Initialize the page
    init();
    
    // Function to initialize the page
    async function init() {
        await loadNoteFiles();
        
        // Add event listeners
        fileSelect.addEventListener('change', loadSelectedFile);
        searchInput.addEventListener('input', filterNotes);
    }
    
    // Function to load available note files from GitHub
    async function loadNoteFiles() {
        try {
            const response = await fetch(GITHUB_API_URL);
            
            if (!response.ok) {
                throw new Error('Failed to fetch file list from GitHub');
            }
            
            const data = await response.json();
            
            // Filter only files that start with "notes_" and end with ".csv"
            const noteFiles = data.filter(file => 
                file.name.startsWith('notes_') && 
                file.name.endsWith('.csv')
            );
            
            // Clear the select options
            fileSelect.innerHTML = '';
            
            // Add a default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Select a file...';
            fileSelect.appendChild(defaultOption);
            
            // Add options for each note file
            noteFiles.forEach(file => {
                const option = document.createElement('option');
                option.value = file.name;
                // Display a more readable name (remove "notes_" prefix and ".csv" suffix)
                option.textContent = file.name.replace('notes_', '').replace('.csv', '');
                fileSelect.appendChild(option);
            });
            
            // Hide loading indicator if there are files
            if (noteFiles.length > 0) {
                loadingIndicator.style.display = 'none';
            } else {
                loadingIndicator.textContent = 'No note files found.';
            }
            
            console.log('Found note files:', noteFiles.map(f => f.name)); // Debug log
            
        } catch (error) {
            console.error('Error loading note files:', error);
            loadingIndicator.textContent = 'Error loading files. Please try again later.';
        }
    }
    
    // Function to load the selected CSV file
    async function loadSelectedFile() {
        const selectedFile = fileSelect.value;
        
        if (!selectedFile) {
            tableBody.innerHTML = '';
            loadingIndicator.textContent = 'Please select a file.';
            loadingIndicator.style.display = 'block';
            return;
        }
        
        try {
            loadingIndicator.textContent = 'Loading file...';
            loadingIndicator.style.display = 'block';
            
            const fileUrl = GITHUB_RAW_BASE_URL + selectedFile;
            const response = await fetch(fileUrl);
            
            if (!response.ok) {
                throw new Error('Failed to fetch file content');
            }
            
            const csvText = await response.text();
            
            // Parse CSV and display data
            parseCSV(csvText);
            
            // Apply any existing search filter
            filterNotes();
            
            loadingIndicator.style.display = 'none';
            
        } catch (error) {
            console.error('Error loading file:', error);
            loadingIndicator.textContent = 'Error loading file. Please try again.';
        }
    }
    
    // Function to parse CSV data
    function parseCSV(csvText) {
        // Split by lines
        const lines = csvText.split('\n');
        
        // Clear current data
        currentData = [];
        
        // Process each line
        for (let i = 1; i < lines.length; i++) { // Skip header row
            if (!lines[i].trim()) continue; // Skip empty lines
            
            // Parse the CSV line, handling commas within quoted fields
            const row = parseCSVLine(lines[i]);
            
            // We need columns B, C, D, E (indices 1, 2, 3, 4)
            if (row.length > 1 && row[1].trim()) { // Only include rows where column B has content
                currentData.push({
                    topic: row[1] || '',
                    description: row[2] || '',
                    example: row[3] || '',
                    notes: row[4] || ''
                });
            }
        }
        
        // Display the data
        displayData(currentData);
    }
    
    // Function to parse a CSV line properly (handling quotes and commas)
    function parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                // Toggle the inQuotes flag
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                // End of field
                result.push(current);
                current = '';
            } else {
                // Add character to current field
                current += char;
            }
        }
        
        // Add the last field
        result.push(current);
        
        return result;
    }
    
    // Function to display data in the table
    function displayData(data) {
        tableBody.innerHTML = '';
        
        if (data.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 4;
            cell.textContent = 'No data to display.';
            cell.style.textAlign = 'center';
            row.appendChild(cell);
            tableBody.appendChild(row);
            return;
        }
        
        data.forEach(item => {
            const row = document.createElement('tr');
            
            // Create cells for each column
            const topicCell = document.createElement('td');
            topicCell.textContent = item.topic;
            row.appendChild(topicCell);
            
            const descriptionCell = document.createElement('td');
            descriptionCell.textContent = item.description;
            row.appendChild(descriptionCell);
            
            const exampleCell = document.createElement('td');
            exampleCell.textContent = item.example;
            row.appendChild(exampleCell);
            
            const notesCell = document.createElement('td');
            notesCell.textContent = item.notes;
            row.appendChild(notesCell);
            
            tableBody.appendChild(row);
        });
    }
    
    // Function to filter notes based on search input
    function filterNotes() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (!searchTerm) {
            // If search is empty, show all data without highlighting
            displayData(currentData);
            return;
        }
        
        // Filter data that contains the search term in any field
        const filteredData = currentData.filter(item => 
            item.topic.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm) ||
            item.example.toLowerCase().includes(searchTerm) ||
            item.notes.toLowerCase().includes(searchTerm)
        );
        
        // Display filtered data with highlighting
        displayFilteredData(filteredData, searchTerm);
    }
    
    // Function to display filtered data with highlighted search terms
    function displayFilteredData(data, searchTerm) {
        tableBody.innerHTML = '';
        
        if (data.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 4;
            cell.textContent = 'No matching results found.';
            cell.style.textAlign = 'center';
            row.appendChild(cell);
            tableBody.appendChild(row);
            return;
        }
        
        data.forEach(item => {
            const row = document.createElement('tr');
            
            // Create cells for each column with highlighted search term
            const topicCell = document.createElement('td');
            topicCell.innerHTML = highlightText(item.topic, searchTerm);
            row.appendChild(topicCell);
            
            const descriptionCell = document.createElement('td');
            descriptionCell.innerHTML = highlightText(item.description, searchTerm);
            row.appendChild(descriptionCell);
            
            const exampleCell = document.createElement('td');
            exampleCell.innerHTML = highlightText(item.example, searchTerm);
            row.appendChild(exampleCell);
            
            const notesCell = document.createElement('td');
            notesCell.innerHTML = highlightText(item.notes, searchTerm);
            row.appendChild(notesCell);
            
            tableBody.appendChild(row);
        });
    }
    
    // Function to highlight search term in text
    function highlightText(text, searchTerm) {
        if (!text) return '';
        
        // Escape special characters in the search term for regex
        const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        // Create a regex that's case insensitive
        const regex = new RegExp(`(${escapedSearchTerm})`, 'gi');
        
        // Replace matches with highlighted version
        return text.replace(regex, '<span class="highlight">$1</span>');
    }});