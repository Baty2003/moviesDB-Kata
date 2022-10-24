import React, { Component } from 'react';
import './Section.css';
export default class Section extends Component {
  render() {
    return <section>{this.props.children}</section>;
  }
}
