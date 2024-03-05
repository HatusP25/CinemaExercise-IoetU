
import { get_movie } from '../javascript/get-movie.js';
import { OPTIONS } from '../javascript/constants.js';

jest.mock('../javascript/constants.js', () => ({
  OPTIONS: { method: 'GET' }, // Simplified for testing, add headers if needed
  API_MOVIE_ID_URL: 'https://moviesdatabase.p.rapidapi.com/titles/{id}?info=base_info'
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    text: () => Promise.resolve(JSON.stringify({ results: { id: "123", title: "Example Movie" } })),
  })
);

beforeAll(() => {
  global.console = { error: jest.fn() };
});

beforeEach(() => {
  fetch.mockClear();
});

describe('get_movie function', () => {
  it('fetches movie successfully by ID', async () => {
    const movieId = "123";
    const movie = await get_movie(movieId);
    
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      'https://moviesdatabase.p.rapidapi.com/titles/123?info=base_info',
      OPTIONS
    );
    expect(movie).toEqual({ id: "123", title: "Example Movie" });
  });

  it('handles network errors gracefully', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));

    const movieId = "errorCase";
    const movie = await get_movie(movieId);
    
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      `Error fetching movie with ID ${movieId}:`, new Error('Network error')
    );
    expect(movie).toBeUndefined();
  });
});
