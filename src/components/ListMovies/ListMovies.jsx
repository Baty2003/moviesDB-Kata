import React, { Component } from 'react';
import { Alert, Spin } from 'antd';
import 'antd/dist/antd.css';

import './ListMovies.css';
import MovieCard from '../MovieCard';
import MoviesApi from '../../MovieDBApi';

export default class ListMovies extends Component {
  MovieApi = new MoviesApi();

  state = {
    movies: [],
    loading: true,
    error: false,
  };

  async getMovies() {
    this.MovieApi.searchFilmsByName('return')
      .then(({ results }) => {
        this.setState({
          movies: results,
          loading: false,
        });
      })
      .catch(() => {
        this.setState({ loading: false, error: true });
      });
  }

  componentDidMount() {
    this.getMovies();
  }

  render() {
    let { error, loading } = this.state;
    if (!loading && !error) {
      let elements = this.state.movies.map((movie) => {
        return <MovieCard key={movie.id} {...movie} />;
      });

      return <div className="list-movies">{elements}</div>;
    }

    return (
      <div className="list-movies list-movies__wait-data">
        <Spin tip={error ? null : 'Loading...'} size="large" className="list-movies__spin"></Spin>;
        {error ? (
          <Alert
            message="Loading Error"
            description="An unexpected error has occurred, we are already correcting it!"
            type="error"
          />
        ) : null}
      </div>
    );
  }
}
