// Import and parse the CSV file dynamically
fetch('news.csv')
  .then(response => response.text())
  .then(csvText => {
    const parsedData = Papa.parse(csvText, { header: false }).data;

    // Filter out empty rows
    const newsData = parsedData
      .filter(row => row[0] && row[1]) // Ensure both title and content are present
      .map(row => ({
        title: row[0],
        content: row[1]
      }));

    const blogContainer = document.getElementById('blog');
    blogContainer.innerHTML = ''; // Clear existing content

    newsData.forEach(news => {
      const newsItem = document.createElement('div');
      newsItem.classList.add('news-item');

      const newsTitle = document.createElement('h2');
      newsTitle.textContent = news.title;

      const newsContent = document.createElement('p');
      newsContent.textContent = news.content;

      newsItem.appendChild(newsTitle);
      newsItem.appendChild(newsContent);
      blogContainer.appendChild(newsItem);
    });
  })
  .catch(error => console.error('Error loading CSV:', error));