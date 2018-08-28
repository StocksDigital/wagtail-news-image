import { Component } from 'react';
import PropTypes from 'prop-types'

import styles from '../styles/input.css'


export default class LabelPill extends Component {

  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
  }

  render() {
    return (
      <div className={styles.labelPill}>
        <div className={styles.labelPillInner}>
          <div className={styles.label}>{this.props.label}</div>
          <div className={styles.rangeValue}>{this.props.value}px</div>
        </div>
      </div>
    )
  }
}
