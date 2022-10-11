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
    return await response.json();
  }
}
