export default class MovieDBApi {
  _baseUrl = 'https://api.themoviedb.org/3/';
  _baseUrlForImg = 'https://image.tmdb.org/t/p/original';
  _apiKey = '8e0c35a26556ffc8ed6c5fb423a8dcba';

  async getGuestSession() {
    try {
      const reponse = await fetch(`${this._baseUrl}authentication/guest_session/new?api_key=${this._apiKey}`, {
        method: 'get',
        headers: {
          accept: 'application/json',
        },
      });
      const session = await reponse.json();
      return this._transformGetSessionData(session);
    } catch (err) {
      return err;
    }
  }

  async rateFilm(filmId, rate, sessionId) {
    try {
      const reponse = await fetch(
        `${this._baseUrl}movie/${filmId}/rating?api_key=${this._apiKey}&guest_session_id=${sessionId}`,
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            value: rate,
          }),
        },
      );
      const json = await reponse.json();
      if (json.status_code === 1 || json.status_code === 12) return true;
      throw `Фильм не оценён, ошибка \n status_code: ${json.status_code} \n status_message: ${json.status_message}`;
    } catch (err) {
      return err;
    }
  }

  async getRatedMovies(sessionId) {
    const reponse = await fetch(
      `${this._baseUrl}guest_session/${sessionId}/rated/movies?api_key=${this._apiKey}&language=en-US&sort_by=created_at.asc`,
      {
        method: 'get',
        headers: {
          accept: 'application/json',
        },
      },
    );
    const json = await reponse.json();
    let { total_pages: totalPages } = json;
    return [json.results.map(this._transformRatedMovie), totalPages];
  }

  async getGenresMovies() {
    const reponse = await fetch(`${this._baseUrl}genre/movie/list?api_key=${this._apiKey}&language=en-US`, {
      method: 'get',
      headers: {
        accept: 'application/json',
      },
    });
    const json = await reponse.json();
    return json.genres;
  }

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

  _transformRatedMovie = (movie) => {
    return {
      id: movie.id,
      title: movie.original_title,
      description: movie.overview,
      releaseDate: movie.release_date,
      posterPath: movie.poster_path,
      genreIds: movie.genre_ids,
      rate: movie.vote_average,
      rating: movie.rating,
    };
  };

  _transformGetSessionData = (data) => {
    return {
      success: data.success,
      sessionId: data.guest_session_id,
      expires: data.expires_at,
    };
  };
}
