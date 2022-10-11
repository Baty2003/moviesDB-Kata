import React, { Component } from 'react';
import { Button, Row, Col } from 'antd';
import 'antd/dist/antd.css';

import Header from '../Header';
import Footer from '../Footer';
import ListMovies from '../ListMovies';
import './App.css';

export default class TodoApp extends Component {
  render() {
    return (
      <>
        <ListMovies />
      </>
    );
  }
}
