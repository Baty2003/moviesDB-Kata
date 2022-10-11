import React, { Component } from 'react';
import { Typography, Rate, Alert, Spin } from 'antd';
import 'antd/dist/antd.css';
import { format } from 'date-fns';
import './MovieCard.css';
import Paragraph from 'antd/lib/skeleton/Paragraph';

const { Title, Text } = Typography;

String.prototype.trunc = function (countSymbol) {
  if (this.length < countSymbol) return this;
  let subStr = this.substring(0, countSymbol);
  return subStr.substring(0, subStr.lastIndexOf(' ')) + '...';
};

const colorBorderForRate = (rate) => {
  if (rate >= 7) {
    return { borderColor: 'green' };
  } else if (rate >= 5 || rate <= 7) {
    return { borderColor: 'rgb(231, 177, 0)' };
  } else {
    return { borderColor: 'red' };
  }
};

export default class MovieCard extends Component {
  state = {
    loadingImg: true,
    src: null,
  };

  poster = (src, alt) => <img src={src} alt={alt} />;

  preLoadImg = () => {
    let { poster_path: posterPath } = this.props;
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

  componentDidMount = () => {
    this.preLoadImg();
  };

  render() {
    let {
      original_title: title,
      overview: description,
      release_date: releaseDate,
      poster_path: posterPath,
      genre_ids: genreIds,
      vote_average: rate,
    } = this.props;
    return (
      <div className="list-movies__item">
        <div className="list-movies__img-container">
          {this.state.loadingImg ? <Spin tip="Loading..."></Spin> : this.poster(this.state.src, `poster ${title}`)}
        </div>
        <div className="list-movies__text-container">
          <div>
            <div className="flex">
              <Title level={5} className="list-movies__title">
                {title}
              </Title>
              <div className="list-movies__rate-number" style={colorBorderForRate(rate)}>
                <span>{rate.toFixed(1)}</span>
              </div>
            </div>
            <Text type="secondary" className="list-movies__date">
              {format(new Date(releaseDate), 'PP')}
            </Text>
            <span className="list-movies__genres">
              <Text code>Lol</Text>
              <Text code>Kek</Text>
            </span>
            <p className="list-movies__desctiption">{description.trunc(170)}</p>
          </div>
          <Rate defaultValue={rate} count={10} allowHalf style={{ fontSize: '16px', marginBottom: '20px' }} disabled />
        </div>
      </div>
    );
  }
}
