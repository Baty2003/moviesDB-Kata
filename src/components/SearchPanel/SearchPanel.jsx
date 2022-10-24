import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './SearchPanel.css';
import _debounce from 'lodash/debounce';
export default class SearchPanel extends Component {
  static defaultProps = {
    disable: false,
    onChangeFunction: () => {},
  };

  static propTypes = {
    disable: PropTypes.bool,
    onChangeFunction: PropTypes.func,
  };

  onChangeInput = (evt) => {
    this.setState({ value: evt.target.value });
    let { onChangeFunction } = this.props;
    onChangeFunction(evt.target.value);
  };

  debounceOnChange = _debounce((evt) => {
    this.onChangeInput(evt);
  }, 1000);

  render() {
    if (this.props.disable) return;
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
