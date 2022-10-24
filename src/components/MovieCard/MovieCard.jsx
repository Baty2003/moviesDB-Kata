import React, { Component } from 'react';
import { Typography, Rate, Alert, Spin } from 'antd';
import 'antd/dist/antd.css';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

import { GenresConsumer } from '../../GenreСontext';
import './MovieCard.css';

const { Title, Text } = Typography;

String.prototype.trunc = function (countSymbol) {
  if (this.length < countSymbol) return this;
  let subStr = this.substring(0, countSymbol);
  return subStr.substring(0, subStr.lastIndexOf(' ')) + '...';
};

const colorBorderForRate = (rate) => {
  if (rate >= 7) {
    return { borderColor: '#66E900' };
  } else if (rate >= 5 && rate <= 7) {
    return { borderColor: '#E9D100' };
  } else if (rate >= 3 && rate <= 5) {
    return { borderColor: '#E97E00' };
  } else {
    return { borderColor: '#E90000' };
  }
};

export default class MovieCard extends Component {
  static defaultProps = {
    id: 0,
    title: 'Not props title',
    rating: 0,
    posterPath: null,
    genreIds: [],
    description: 'Not props description',
    addRateFilmInLocalStorage: () => {},
  };

  static propTypes = {
    id: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    releaseDate: function (props, propName, componentName) {
      if (!props[propName]) return;
      if (!/\d{4}-\d{2}-\d{2}/.test(props[propName])) {
        return new Error(
          'Invalid prop `' + propName + '` supplied to' + ' `' + componentName + '`. Validation failed.',
        );
      }
    },
    rating: PropTypes.number,
    posterPath: PropTypes.string,
    genreIds: PropTypes.array,
    rate: PropTypes.number,
    rateFilmApiFunction: PropTypes.func,
    addRateFilmInLocalStorage: PropTypes.func,
  };

  state = {
    loadingImg: true,
    src: null,
    rate: this.props.rating ? this.props.rating : 0,
    error: false,
  };

  MovieApi = this.props.movieApi;

  poster = (src, alt) => <img src={src} alt={alt} />;

  preLoadImg = () => {
    let { posterPath } = this.props;
    if (!posterPath) {
      this.setState({ loadingImg: false });
      this.poster = () => <span>Not Found image</span>;
      return;
    }
    let img = new Image();
    img.src = `https://image.tmdb.org/t/p/original${posterPath}`;
    img.onload = () => {
      this.setState({ loadingImg: false, src: img.src });
    };
    img.onerror = () => {
      this.setState({ loadingImg: false });
      this.poster = () => <Alert message="Loading Error" description="Failed to upload image" type="error" />;
    };
  };

  rateFilm = (valueRate) => {
    this.props
      .sendRateForFilm(this.props.id, valueRate)
      .then((data) => {
        if (data === true) {
          this.setState({
            rate: valueRate,
          });
        } else {
          this.setState({
            error: data,
          });
        }
        this.props.addRateFilmInLocalStorage(this.props.id, valueRate);
      })
      .catch((err) => {
        this.setState({ error: err.message });
      });
  };

  componentDidMount = () => {
    this.preLoadImg();
  };

  componentDidCatch(err) {
    this.setState({
      error: err,
    });
  }

  render() {
    let { title, description, releaseDate, genreIds, rate } = this.props;

    if (this.state.error) {
      return <Alert message="Loading Error" description={this.state.error} type="error" />;
    }

    return (
      <div className="list-movies__item">
        <div className="list-movies__img-container">
          {this.state.loadingImg ? <Spin tip="Loading..."></Spin> : this.poster(this.state.src, `poster ${title}`)}
        </div>
        <div className="list-movies__text-container">
          <div>
            <div className="flex">
              <Title level={5} className="list-movies__title">
                {window.screen.width > 1000 ? title.trunc(40) : title.trunc(30)}
              </Title>
              <div className="list-movies__rate-number" style={colorBorderForRate(rate)}>
                <span>{rate.toFixed(1)}</span>
              </div>
            </div>
            <Text type="secondary" className="list-movies__date">
              {releaseDate ? format(new Date(releaseDate), 'PP') : 'not date'}
            </Text>
            <GenresConsumer>
              {(getGenres) => {
                let genresElem = genreIds.map((genreId) => (
                  <Text code key={genreId} className="list-movies__genres">
                    {getGenres(genreId)}
                  </Text>
                ));
                return <span className="list-movies__genres">{genresElem}</span>;
              }}
            </GenresConsumer>
          </div>
        </div>
        <div className="list-movies__description-container">
          <p className="list-movies__desctiption">{description.trunc(170)}</p>
          <Rate
            defaultValue={this.state.rate}
            count={10}
            className="list-movies__rate"
            allowHalf
            onChange={this.rateFilm}
          />
        </div>
      </div>
    );
  }
}
