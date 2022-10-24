import React, { Component } from 'react';
import { Alert, Tabs, Pagination } from 'antd';

import 'antd/dist/antd.css';
import MoviesApi from '../../MovieDBApi';
import ListMovies from '../ListMovies';
import Header from '../Header';
import Footer from '../Footer';
import Section from '../Section';
import SearchPanel from '../SearchPanel';
import { GenresProvider } from '../../GenreСontext';
import './App.css';

export default class TodoApp extends Component {
  state = {
    searchRequest: '',
    mode: 'search',
    error: false,
    genres: [],
    data: [],
    currentPage: 1,
    totalPage: 1,
    sessionId: null,
    loadingData: false,
  };

  MovieApi = new MoviesApi();

  getGenres(genreId, arrGenres) {
    let foundGenre = arrGenres.find((genre) => genre.id === genreId);
    if (!foundGenre) return 'none';
    return foundGenre.name;
  }

  changeModeView = (nameMode) => {
    this.setState({
      mode: nameMode,
    });
  };

  changeSearchRequest = (stringSearch) => {
    this.setState({ searchRequest: stringSearch });
  };

  changePage = (value) => {
    this.setState({
      currentPage: value,
    });
  };

  setError = (err) => {
    this.setState({ error: err });
  };

  getCookie = (name) => {
    let matches = document.cookie.match(
      // eslint-disable-next-line no-useless-escape
      new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'),
    );
    return matches ? decodeURIComponent(matches[1]) : undefined;
  };

  getSearchMovies = async () => {
    this.setState({ loadingData: true, totalPage: 1, currentPage: 1 });
    const { searchRequest, currentPage } = this.state;
    this.MovieApi.searchFilmsByNameAnotherPage(searchRequest, currentPage)
      .then((results) => {
        this.setState({
          data: results[0],
          totalPage: results[1],
          loadingData: false,
        });
      })
      .catch((err) => {
        this.setError(err.message);
      });
  };

  getRatedMovies = async (page) => {
    this.setState({ loadingData: true, totalPage: 1, currentPage: 1 });
    const { sessionId } = this.state;
    this.getCookie('session_id');
    this.MovieApi.getRatedMovies(sessionId, page)
      .then((results) => {
        this.setState({
          data: results[0],
          totalPage: results[1],
          loadingData: false,
        });
      })
      .catch((err) => {
        this.setError(err.message);
      });
  };

  searchRatedFilmsInLocalStorage(filmId, arrFilms) {
    const foundFilm = arrFilms.find((film) => film.id === filmId);
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

  getRatedFilmExpression = () =>
    localStorage.getItem('ratedFilms') ? JSON.parse(localStorage.getItem('ratedFilms')) : [];

  componentDidMount = () => {
    if (document.cookie.indexOf('session_id') === -1) {
      localStorage.clear();
      this.MovieApi.getGuestSession().then((data) => {
        if (!data.success) {
          this.setState({
            hasError: 'Ошибка получения гостевой сессии',
          });
        }
        let date = new Date(data.expires);
        document.cookie = `session_id = ${data.sessionId}; expires=${date.toUTCString()}; secure`;
        this.setState({ sessionId: this.getCookie('session_id') });
      });
    } else {
      this.setState({ sessionId: this.getCookie('session_id') });
    }

    this.MovieApi.getGenresMovies().then((data) => {
      this.setState({
        genres: data,
      });
      return;
    });
  };

  componentDidCatch(err) {
    this.setState({
      error: err,
    });
  }

  componentDidUpdate(_, { searchRequest: searchRequestPrev, mode: modePrev, currentPage: currentPagePrev }) {
    const { searchRequest, mode, currentPage } = this.state;
    if (searchRequestPrev !== searchRequest && searchRequest) this.getSearchMovies();
    if (searchRequestPrev !== searchRequest && !searchRequest) this.setState({ data: [] });
    if (modePrev !== mode && mode === 'rated') this.getRatedMovies();
    if (modePrev !== mode && mode === 'search') this.setState({ data: [], searchRequest: '' });
    if (currentPagePrev !== currentPage && mode === 'search') this.getSearchMovies();
  }

  render() {
    if (this.state.error) {
      return <Alert message="Loading Error" description={this.state.error} type="error" />;
    }
    const labelTab = [
      { label: 'Search', key: 'search' },
      { label: 'Rated', key: 'rated' },
    ];
    const { searchRequest, mode, genres, currentPage, totalPage, data, loadingData, sessionId } = this.state;
    const showPagination = (searchRequest || mode === 'rated') && data.length ? true : false;
    let content = (
      <GenresProvider value={(genreId) => this.getGenres(genreId, genres)}>
        <ListMovies
          movies={data}
          loading={loadingData}
          addRateFilmInLocalStorage={this.addRateFilmInLocalStorage}
          searchRatedFilmsInLocalStorage={this.searchRatedFilmsInLocalStorage}
          getRatedFilmExpression={this.getRatedFilmExpression}
          sendRateForFilm={(filmId, rate) => this.MovieApi.rateFilm(filmId, rate, sessionId)}
        />
      </GenresProvider>
    );

    if (!searchRequest && mode === 'search' && !loadingData) {
      content = <h1>Enter the name of the movie to search for</h1>;
    } else if (!data.length && mode === 'rated' && !loadingData) {
      content = <h1>There are no rated films</h1>;
    } else if (!data.length && searchRequest && mode === 'search' && !loadingData) {
      content = <h1>Films not found</h1>;
    }
    return (
      <>
        <Header className="container-tabs">
          <Tabs items={labelTab} onChange={this.changeModeView} />
        </Header>
        <Section>
          <SearchPanel onChangeFunction={this.changeSearchRequest} disable={mode === 'rated' ? true : false} />
          {content}
        </Section>
        <Footer>
          {showPagination && (
            <Pagination defaultCurrent={currentPage} total={totalPage * 10} onChange={this.changePage} />
          )}
        </Footer>
      </>
    );
  }
}
