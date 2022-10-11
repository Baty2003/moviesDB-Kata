import React from 'react';
import PropTypes from 'prop-types';

import './ToggleSearchButtonRadio.css';

const ToggleSearchButtonRadio = (props) => {
  return (
    <label className={`${props.className} radio-button`}>
      <input type="radio" name={props.name} />
      <span>{props.children}</span>
    </label>
  );
};

export default ToggleSearchButtonRadio;
