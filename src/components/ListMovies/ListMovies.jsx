import React, { Component } from 'react';
import { Alert, Spin, Pagination } from 'antd';
import PropTypes from 'prop-types';

import 'antd/dist/antd.css';
import './ListMovies.css';
import MovieCard from '../MovieCard';

export default class ListMovies extends Component {
  static defaultProps = {
    mode: 'search',
    searchRequest: '',
  };

  static propTypes = {
    mode: PropTypes.oneOf(['search', 'rated']),
    searchRequest: PropTypes.string,
    sessionId: PropTypes.string.isRequired,
    movieApi: PropTypes.object.isRequired,
  };

  getRatedFilmExpression = () =>
    localStorage.getItem('ratedFilms') ? JSON.parse(localStorage.getItem('ratedFilms')) : [];

  state = {
    movies: [],
    loading: false,
    error: false,
    totalPages: 1,
    currentPage: 1,
    ratedFilms: this.getRatedFilmExpression(),
    searchRequest: '',
  };

  MovieApi = this.props.movieApi;

  async getSearchMovies(searchRequest) {
    this.MovieApi.searchFilmsByName(searchRequest)
      .then((results) => {
        this.setState({
          movies: results[0],
          loading: false,
          totalPages: results[1],
          searchRequest: searchRequest,
        });
      })
      .catch(() => {
        this.setState({ loading: false, error: true });
      });
  }

  async getRatedMovies() {
    this.MovieApi.getRatedMovies(this.props.sessionId)
      .then((results) => {
        this.setState({
          movies: results[0],
          loading: false,
          totalPages: results[1],
        });
      })
      .catch(() => {
        this.setState({ loading: false, error: true });
      });
  }

  getMoviesAnotherPage = async (page) => {
    this.setState({ loading: true });
    let { searchRequest } = this.state;
    this.MovieApi.searchFilmsByNameAnotherPage(searchRequest, page)
      .then((results) => {
        this.setState({
          movies: results[0],
          loading: false,
          currentPage: page,
        });
      })
      .catch(() => {
        this.setState({ loading: false, error: true });
      });
  };

  searchInRatedFilms(filmId) {
    const { ratedFilms } = this.state;
    const foundFilm = ratedFilms.find((film) => film.id === filmId);
    if (!foundFilm) return 0;
    return foundFilm.rate;
  }

  addRateFilmInLocalStorage(filmId, valueRate) {
    const newRatedFilm = { id: filmId, rate: valueRate };
    let localStorageFilmsRated = localStorage.getItem('ratedFilms');

    if (!localStorageFilmsRated) {
      localStorage.setItem('ratedFilms', JSON.stringify([newRatedFilm]));
      return;
    }
    localStorageFilmsRated = JSON.parse(localStorageFilmsRated);
    let existsFilm = localStorageFilmsRated.find((film) => film.id === filmId);

    if (existsFilm) {
      let idExistFilm = localStorageFilmsRated.map((film) => film.id).indexOf(filmId);
      localStorageFilmsRated[idExistFilm].rate = valueRate;
    } else {
      localStorageFilmsRated.push(newRatedFilm);
    }

    localStorage.setItem('ratedFilms', JSON.stringify(localStorageFilmsRated));
    return;
  }

  componentDidUpdate({ searchRequest, mode }) {
    let { searchRequest: searchRequestProps, mode: modeProps } = this.props;

    if (modeProps != mode && modeProps === 'rated') {
      this.setState({ loading: true });
      this.getRatedMovies();
      return;
    }

    if (modeProps != mode && modeProps === 'search') {
      this.setState({ movies: [] });
    }

    if (searchRequestProps === searchRequest) return;
    this.setState({
      loading: true,
      ratedFilms: this.getRatedFilmExpression(),
    });

    this.getSearchMovies(searchRequestProps);
  }

  componentDidCatch() {
    this.setState({
      error: true,
    });
  }

  render() {
    let { error, loading, movies, totalPages, currentPage } = this.state;
    let { sessionId, mode } = this.props;
    if (!loading && !error && movies.length > 0) {
      let elements = movies.map((movie) => {
        return (
          <MovieCard
            key={movie.id}
            rating={this.searchInRatedFilms(movie.id)}
            {...movie}
            rateFilmApiFunction={(id, valueRate) => this.MovieApi.rateFilm(id, valueRate, sessionId)}
            addRateFilmInLocalStorage={this.addRateFilmInLocalStorage}
          />
        );
      });

      return (
        <div className="list-movies">
          {elements}
          <Pagination
            style={{ gridColumn: 'span 2' }}
            defaultCurrent={currentPage}
            total={totalPages}
            onChange={this.getMoviesAnotherPage}
          />
        </div>
      );
    }

    let loader = loading ? (
      <Spin tip={error ? null : 'Loading...'} size="large" className="list-movies__spin"></Spin>
    ) : null;
    let alert = error ? (
      <Alert
        message="Loading Error"
        description="An unexpected error has occurred, we are already correcting it!"
        type="error"
      />
    ) : null;

    let promptForInput =
      movies.length === 0 && !loading && !error ? (
        <p className="prompt-text">Enter the name of the movie to search for</p>
      ) : null;

    let promptForRated =
      movies.length === 0 && !loading && !error ? <p className="prompt-text">There are no rated films</p> : null;

    return (
      <div className="list-movies list-movies__wait-data">
        {loader}
        {alert}
        {mode === 'search' ? promptForInput : promptForRated}
      </div>
    );
  }
}
