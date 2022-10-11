import { InputNumber } from 'antd';
import React, { Component } from 'react';
import './SearchPanel.css';
import _debounce from 'lodash/debounce';
export default class SearchPanel extends Component {
  onChangeInput = (evt) => {
    this.setState({ value: evt.target.value });
    let { onChangeFunction } = this.props;
    onChangeFunction(evt.target.value);
  };

  debounceOnChange = _debounce((evt) => {
    this.onChangeInput(evt);
  }, 1000);

  render() {
    return (
      <label htmlFor="search-panel" className="search-panel">
        <input
          type="text"
          name="search-panel"
          className="search-panel__input"
          onChange={this.debounceOnChange}
          placeholder="Type to search..."
        />
      </label>
    );
  }
}
