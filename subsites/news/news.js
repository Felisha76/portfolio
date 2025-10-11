// Import and parse the CSV file dynamically
fetch('news.csv')
  .then(response => response.text())
  .then(csvText => {
    const parsedData = Papa.parse(csvText, { header: false }).data;

    // Log parsed data for debugging
    console.log('Parsed CSV Data:', parsedData);

    // Filter out empty rows
    const newsData = parsedData
      .filter(row => row[0] && row[1]) // Ensure both title and content are present
      .map(row => ({
        title: row[0],
        content: row[1]
      }));

    // Log filtered data for debugging
    console.log('Filtered News Data:', newsData);

    const blogContainer = document.getElementById('blog');
    blogContainer.innerHTML = ''; // Clear existing content

    newsData.forEach(news => {
      const newsItem = document.createElement('div');
      newsItem.classList.add('news-item');

      const newsTitle = document.createElement('h2');
      newsTitle.textContent = news.title;

      const newsContent = document.createElement('p');
      newsContent.innerHTML = news.content; // Allow HTML content
      newsContent.setAttribute('data-full-text', news.content); // Add full text for tooltip

      newsItem.appendChild(newsTitle);
      newsItem.appendChild(newsContent);
      blogContainer.appendChild(newsItem);
    });

    // Log final DOM structure for debugging
    console.log('Final Blog Container:', blogContainer.innerHTML);
  })
  .catch(error => console.error('Error loading CSV:', error));