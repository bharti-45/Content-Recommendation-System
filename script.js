const apiUrl = 'https://ykono93nch.execute-api.us-east-1.amazonaws.com/prod/recommend';

const movieInput = document.getElementById('movieInput');
const getRecommendationsBtn = document.getElementById('getRecommendationsBtn');
const resultSection = document.getElementById('resultSection');
const selectedMovieName = document.getElementById('selectedMovieName');
const recommendationsList = document.getElementById('recommendationsList');
const loading = document.getElementById('loading');
const error = document.getElementById('error');

async function fetchMovies(movieTitle) {
  loading.classList.remove('hidden');
  error.classList.add('hidden');
  resultSection.classList.add('hidden');
  recommendationsList.innerHTML = '';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ movie_title: movieTitle })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const parsedData = data.body ? JSON.parse(data.body) : data;
    const movies = parsedData.recommended_movies || [];

    if (movies.length === 0) {
      error.textContent = 'No recommendations found. Please try another movie.';
      error.classList.remove('hidden');
    } else {
      selectedMovieName.textContent = movieTitle;
      movies.forEach(movie => {
        const li = document.createElement('li');
        li.textContent = typeof movie === 'string' ? movie : movie.title;
        recommendationsList.appendChild(li);
      });
      resultSection.classList.remove('hidden');
    }
  } catch (err) {
    error.textContent = 'Failed to fetch movie recommendations. Please try again later.';
    error.classList.remove('hidden');
    console.error('Error fetching movies:', err);
  } finally {
    loading.classList.add('hidden');
  }
}

// Event listener on button
getRecommendationsBtn.addEventListener('click', () => {
  const movieName = movieInput.value.trim();
  if (!movieName) {
    alert('Please enter a movie name.');
    return;
  }
  fetchMovies(movieName);
});

// Optionally, you can trigger a default fetch on page load for a popular movie
// document.addEventListener('DOMContentLoaded', () => fetchMovies('lagaan'));
