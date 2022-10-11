export default class MovieDBApi {
  _baseUrl = 'https://api.themoviedb.org/3/';
  _baseUrlForImg = 'https://image.tmdb.org/t/p/original';
  _apiKey = '8e0c35a26556ffc8ed6c5fb423a8dcba';

  async searchFilmsByName(name) {
    const response = await fetch(`${this._baseUrl}search/movie?api_key=${this._apiKey}&query=${name}`, {
      method: 'get',
      headers: {
        accept: 'application/json',
      },
    });
    const json = await response.json();
    let { total_pages: totalPages } = json;

    return [json.results.map(this._transformMovie), totalPages];
  }

  async searchFilmsByNameAnotherPage(name, numberPage) {
    const response = await fetch(
      `${this._baseUrl}search/movie?api_key=${this._apiKey}&query=${name}&page=${numberPage}`,
      {
        method: 'get',
        headers: {
          accept: 'application/json',
        },
      },
    );
    const json = await response.json();
    let { total_pages: totalPages } = json;

    return [json.results.map(this._transformMovie), totalPages];
  }

  _transformMovie = (movie) => {
    return {
      id: movie.id,
      title: movie.original_title,
      description: movie.overview,
      releaseDate: movie.release_date,
      posterPath: movie.poster_path,
      genreIds: movie.genre_ids,
      rate: movie.vote_average,
    };
  };
}
