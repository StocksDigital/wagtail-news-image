import { Component, createRef } from 'react'
import PropTypes from 'prop-types'

import styles from '../styles/input.css'


/*
A custom text / file input, styled to fit in with Wagtail admin.
It validates URLs when the 'url' type is passed in and hides the parent Modal's
close button if the field is invalid.
*/
export default class Input extends Component {

  static propTypes = {
    name: PropTypes.string,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    min: PropTypes.number,
    max: PropTypes.number,
  }

  render() {
    if (this.props.type === 'url') {
      return <URLInput {...this.props}/>
    } else if (this.props.type === 'file') {
      return <FileInput {...this.props}/>
    } else if (this.props.type === 'range') {
      return <RangeInput {...this.props}/>
    } else {
      return <TextInput {...this.props}/>
    }
  }
}


class BaseInput extends Component {

  static contextTypes = {
    hideModalClose: PropTypes.func,
    showModalClose: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {isValid: true}
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { hideModalClose, showModalClose } = this.context
    if (!prevState.isValid && this.state.isValid) {
      showModalClose()
    } else if (prevState.isValid && !this.state.isValid) {
      hideModalClose()
    }
  }

  render() {
    const {
      name,
      type,
      placeholder,
      label,
      value,
      onChange,
    } = this.props
    const { isValid } = this.state
    const className = isValid ? '' : styles.invalid
    return (
      <div className={styles.inputWrapper}>
        <div className={styles.label}>{label}</div>
          <input
            name={name}
            type={type}
            placeholder={placeholder}
            onChange={onChange}
            className={className}
            value={value}
          />
      </div>
    )
  }
}


class TextInput extends BaseInput {}


class FileInput extends BaseInput {

  componentDidMount() {
      // Pass fileInput to pasteInput
      this.pasteInput.setFileInput(this.fileInput)
  }

  render() {
    const {
      name,
      type,
      placeholder,
      label,
      value,
      onChange,
    } = this.props
    const { isValid } = this.state
    const className = isValid ? '' : styles.invalid
    return (
      <div className={styles.inputWrapper}>
        <div className={styles.label}>{label}</div>
          <input
            name={name}
            type={type}
            placeholder={placeholder}
            onChange={onChange}
            className={className}
            value={value}
            ref={r => { this.fileInput = r; }}
          />
          <ImagePasteBox
            ref={r => { this.pasteInput = r; }}
          />
      </div>
    )
  }
}


class ImagePasteBox extends Component {

  constructor(props) {
    super(props)
    this.state = {isFocus: false}
  }

  setFileInput = fileInput => {
    this.fileInput = fileInput
  }

  handleFocus = e => {
    this.setState({isFocus: true})
  }

  handleBlur = e => {
    this.setState({isFocus: false})
  }

  handlePaste = e => {
    this.pasteInput.blur()
    const hasItems = e.clipboardData.items.length > 0
    if (!hasItems) {
        return
    }
    const item = e.clipboardData.items[0]
    const isFile = item.kind === 'file'
    const isImage = item.type.match('^image/')
    if (isFile && isImage) {
        const file = item.getAsFile()
        if (file) {
          this.fileInput.files = e.clipboardData.files
        }
    }
  }

  render() {
    const { isFocus } = this.state
    const value = isFocus ? 'Paste now!' : 'Click to Paste'
    return (
      <input
        type='text'
        className={styles.imagePaste}
        value={value}
        onPaste={this.handlePaste}
        onChange={e => e.preventDefault()}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        ref={r => { this.pasteInput = r; }}
      />
    )
  }
}


class URLInput extends BaseInput {

  static validateURL(text) {
    return !text || /^https?:\/\/\S+\.\S+$/.test(text)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {isValid: URLInput.validateURL(nextProps.value)}
  }

  constructor(props) {
    super(props)
    this.state = {isValid: URLInput.validateURL(props.value)}
  }
}


class RangeInput extends BaseInput {
  render() {
    const {
      name,
      type,
      min,
      max,
      label,
      value,
      onChange,
    } = this.props
    return (
      <div className={styles.inputWrapper}>
        <div className={styles.label}>{label}</div>
        <div className={styles.rangeValue}>{value}px</div>
        <input
          name={name}
          type={type}
          min={min}
          max={max}
          onChange={onChange}
          value={value}
        />
      </div>
    )
  }
}
