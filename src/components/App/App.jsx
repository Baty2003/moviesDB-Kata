import React, { Component } from 'react';
import { Button, Row, Col } from 'antd';
import 'antd/dist/antd.css';
import _debounce from 'lodash/debounce';

import Header from '../Header';
import Footer from '../Footer';
import ListMovies from '../ListMovies';
import SearchPanel from '../SearchPanel';
import ToggleSearchButtonRadio from '../ToggleSearchButtonRadio';
import './App.css';
import RadioGroup from '../RadioGroup';

export default class TodoApp extends Component {
  state = {
    searchRequest: '',
  };

  changeInputPanel = (stringSearch) => {
    if (stringSearch === '') return;
    this.setState({ searchRequest: stringSearch });
  };

  render() {
    return (
      <>
        <RadioGroup nameGroup="type-search">
          <ToggleSearchButtonRadio>Search</ToggleSearchButtonRadio>
          <ToggleSearchButtonRadio>Rated</ToggleSearchButtonRadio>
        </RadioGroup>
        <SearchPanel onChangeFunction={this.changeInputPanel} />
        <ListMovies searchRequest={this.state.searchRequest} />
      </>
    );
  }
}
