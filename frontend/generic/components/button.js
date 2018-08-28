import { Component } from 'react'
import PropTypes from 'prop-types'

import styles from '../styles/button.css'


export default class Button extends Component {

  static propTypes = {
    text: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
  }

  render() {
    const { onClick, text, disabled } = this.props
    return (
      <button
        onClick={onClick}
        className={`button ${styles.button}`}
        disabled={disabled && 'disabled'}
      >
        {text}
      </button>
    )
  }
}
