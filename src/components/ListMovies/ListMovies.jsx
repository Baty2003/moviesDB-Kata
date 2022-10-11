import React, { Component } from 'react';
import { Alert, Spin, Pagination } from 'antd';
import 'antd/dist/antd.css';

import './ListMovies.css';
import MovieCard from '../MovieCard';
import MoviesApi from '../../MovieDBApi';

export default class ListMovies extends Component {
  MovieApi = new MoviesApi();

  state = {
    movies: [],
    loading: false,
    error: false,
    totalPages: 1,
    currentPage: 1,
    searchRequest: '',
  };

  async getMovies(searchRequest) {
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

  componentDidUpdate(prevProps) {
    if (this.props.searchRequest === prevProps.searchRequest) return;
    this.setState({ loading: true });
    this.getMovies(this.props.searchRequest);
  }

  render() {
    let { error, loading, movies, totalPages, currentPage } = this.state;

    if (!loading && !error && movies.length > 0) {
      let elements = this.state.movies.map((movie) => {
        return <MovieCard key={movie.id} {...movie} />;
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
      movies.length === 0 && !loading ? <p className="prompt-text">Enter the name of the movie to search for</p> : null;

    return (
      <div className="list-movies list-movies__wait-data">
        {loader}
        {alert}
        {promptForInput}
      </div>
    );
  }
}
