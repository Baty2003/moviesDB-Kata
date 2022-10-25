import React, { Component } from 'react';
import { Alert, Spin } from 'antd';
import PropTypes from 'prop-types';

import 'antd/dist/antd.css';
import './ListMovies.css';
import MovieCard from '../MovieCard';

export default class ListMovies extends Component {
  static defaultProps = {
    movies: [],
    loading: false,
    searchRatedFilmsInLocalStorage: () => 0,
    listRatedFilms: [],
  };

  static propTypes = {
    movies: PropTypes.array,
    loading: PropTypes.bool,
    searchRatedFilmsInList: PropTypes.func,
    listRatedFilms: PropTypes.array,
  };

  state = {
    ratedFilms: this.props.listRatedFilms,
    error: false,
  };

  componentDidCatch() {
    this.setState({
      error: true,
    });
  }

  render() {
    const { loading, movies, searchRatedFilmsInList, sendRateForFilmApi, addRateFilmInLocalStorage } = this.props;
    const { error, ratedFilms } = this.state;
    if (error) {
      return <Alert message="Error" description={'The list cannot be loaded. ${}'} type="error" showIcon />;
    }
    if (!loading) {
      let elements = movies.map((movie) => {
        return (
          <MovieCard
            key={movie.id}
            rating={searchRatedFilmsInList(movie.id, ratedFilms)}
            {...movie}
            addRateFilmInLocalStorage={addRateFilmInLocalStorage}
            sendRateForFilmApi={sendRateForFilmApi}
          />
        );
      });

      return <div className="list-movies">{elements}</div>;
    }

    return (
      <div className="list-movies list-movies__wait-data">
        <Spin tip="Loading..." size="large" className="list-movies__spin"></Spin>;
      </div>
    );
  }
}
