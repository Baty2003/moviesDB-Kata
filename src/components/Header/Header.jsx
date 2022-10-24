import React, { Component } from 'react';
import './Header.css';
export default class SearchPanel extends Component {
  render() {
    return (
      <header htmlFor="search-panel" className={`search-panel ${this.props.className ? this.props.className : null}`}>
        {this.props.children}
      </header>
    );
  }
}
