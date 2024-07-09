'use strict';

document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('search-input');
  const loader = document.getElementById('loader');
  const errorMessage = document.getElementById('error-message');
  const resultsBody = document.getElementById('results-body');
  const noResultsMessage = document.getElementById('no-results');

  let timeout = null;

  document.addEventListener('keyup', function (event) {
    if (event.key === 'Escape') {
      clearSearch();
    }
  });

  function clearSearch() {
    searchInput.value = '';
    resultsBody.innerHTML = '';
    noResultsMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    loader.style.display = 'none';
  }

  searchInput.addEventListener('input', function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const searchTerm = searchInput.value.trim();

      if (searchTerm) {
        fetchResults(searchTerm);
      } else {
        resultsBody.innerHTML = '';
        noResultsMessage.style.display = 'block';
      }
    }, 300);
  });

  async function fetchResults(term) {
    loader.style.display = 'block';
    errorMessage.style.display = 'none';
    noResultsMessage.style.display = 'none';
    resultsBody.innerHTML = '';

    const url = `https://itunes.apple.com/search?term=${term}&entity=song`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.results.length > 0) {
        data.results.forEach((result) => {
          const row = document.createElement('tr');
          const songCell = document.createElement('td');
          const artistCell = document.createElement('td');

          songCell.textContent = result.trackName;
          artistCell.textContent = result.artistName;

          row.appendChild(songCell);
          row.appendChild(artistCell);
          resultsBody.appendChild(row);
        });
      } else {
        noResultsMessage.style.display = 'block';
      }
    } catch (error) {
      errorMessage.textContent = 'An error occurred while fetching the data.';
      errorMessage.style.display = 'block';
    } finally {
      loader.style.display = 'none';
    }
  }
});
