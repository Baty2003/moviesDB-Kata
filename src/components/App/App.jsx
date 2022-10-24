import React, { Component } from 'react';
import { Alert, Tabs } from 'antd';

import 'antd/dist/antd.css';
import MoviesApi from '../../MovieDBApi';
import ListMovies from '../ListMovies';
import SearchPanel from '../SearchPanel';
import { GenresProvider } from '../GenresContext';
import './App.css';

export default class TodoApp extends Component {
  state = {
    searchRequest: '',
    mode: 'search',
    hasError: false,
    genres: [],
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
    if (stringSearch === '') return;
    this.setState({ searchRequest: stringSearch });
  };

  getCookie = (name) => {
    let matches = document.cookie.match(
      // eslint-disable-next-line no-useless-escape
      new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'),
    );
    return matches ? decodeURIComponent(matches[1]) : undefined;
  };

  componentDidMount() {
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
      });
    }
    this.MovieApi.getGenresMovies().then((data) => {
      this.setState({
        genres: data,
      });
      return;
    });
  }

  componentDidCatch(err) {
    this.setState({
      hasError: err,
    });
  }

  render() {
    if (this.state.hasError) {
      return <Alert message="Loading Error" description={this.state.hasError} type="error" />;
    }
    const labelTab = [
      { label: 'Search', key: 'search' },
      { label: 'Rated', key: 'rated' },
    ];
    const { searchRequest, mode, genres } = this.state;
    return (
      <>
        <div className="container-tabs">
          <Tabs items={labelTab} onChange={this.changeModeView} />
        </div>
        <SearchPanel onChangeFunction={this.changeSearchRequest} disable={mode === 'rated' ? true : false} />
        <GenresProvider value={(genreId) => this.getGenres(genreId, genres)}>
          <ListMovies
            searchRequest={searchRequest}
            mode={mode}
            sessionId={this.getCookie('session_id')}
            movieApi={this.MovieApi}
          />
        </GenresProvider>
      </>
    );
  }
}
