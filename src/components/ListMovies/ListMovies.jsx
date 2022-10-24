import React, { Component } from 'react';
import { Spin } from 'antd';
import PropTypes from 'prop-types';

import 'antd/dist/antd.css';
import './ListMovies.css';
import MovieCard from '../MovieCard';

export default class ListMovies extends Component {
  static defaultProps = {
    movies: [],
    loading: false,
    searchRatedFilmsInLocalStorage: () => 0,
    getRatedFilmExpression: () => 0,
  };

  static propTypes = {
    movies: PropTypes.array,
    loading: PropTypes.bool,
    searchRatedFilmsInLocalStorage: PropTypes.func,
    getRatedFilmExpression: PropTypes.func,
  };

  state = {
    ratedFilms: this.props.getRatedFilmExpression(),
  };

  componentDidCatch() {
    this.setState({
      error: true,
    });
  }

  render() {
    let { loading, movies, searchRatedFilmsInLocalStorage, sendRateForFilm, addRateFilmInLocalStorage } = this.props;
    if (!loading) {
      let elements = movies.map((movie) => {
        return (
          <MovieCard
            key={movie.id}
            rating={searchRatedFilmsInLocalStorage(movie.id, this.state.ratedFilms)}
            {...movie}
            addRateFilmInLocalStorage={addRateFilmInLocalStorage}
            sendRateForFilm={sendRateForFilm}
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

// let alert = error ? (
//   <Alert
//     message="Loading Error"
//     description="An unexpected error has occurred, we are already correcting it!"
//     type="error"
//   />
// ) : null;

// let promptForInput =
//   movies.length === 0 && !loading && !error ? (
//     <p className="prompt-text">{searchRequest ? 'Films not found' : 'Enter the name of the movie to search for'}</p>
//   ) : null;

// let promptForRated =
//   movies.length === 0 && !loading && !error ? <p className="prompt-text">There are no rated films</p> : null;

// return (
//   <div className="list-movies list-movies__wait-data">
//     {loader}
//     {alert}
//     {mode === 'search' ? promptForInput : promptForRated}
//   </div>
// );
