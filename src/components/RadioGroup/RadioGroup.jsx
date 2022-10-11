import React from 'react';
import PropTypes from 'prop-types';

import './RadioGroup.css';

const renderChildrens = (children, name, className) => {
  return children.map((child, index) => {
    return React.cloneElement(child, { name: name, className: className, key: index });
  });
};

const RadioGroup = (props) => {
  let { nameGroup } = props;

  return (
    <div className="inline-container">
      <div className="radio-group">{renderChildrens(props.children, nameGroup, 'radio-group__button')}</div>
    </div>
  );
};

export default RadioGroup;
