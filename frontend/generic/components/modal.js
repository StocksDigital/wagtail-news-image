import { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import styles from '../styles/modal.css'

// Keep track of how many modals are open at once
let activeModals = 0
const listeners = []


// A fullscreen modal that renders outside of the editor
export default class Modal extends Component {

  static propTypes = {
    handleClose: PropTypes.func,
    isFullScreen: PropTypes.bool,
  }

  handleEscape = e => {
    const isEscape = 'key' in e
      ? (e.key == 'Escape' || e.key == 'Esc')
      : e.keyCode == 27
      if (isEscape) {
        this.props.handleClose()
      }
  }

  componentDidMount() {
    // Keep track of how many modals are open,
    // If this is the first modal, lock the page's scroll
    if (activeModals < 1) {
      $('body').addClass('modal-open')
      $('.Draftail-Toolbar').css('z-index', 0)
      $('footer').css('display', 'none')
      activeModals = 1
    } else {
      activeModals++
    }

    // Ensure `esc` closes this modal, but not parent modals
    for (let listener of listeners) {
      document.removeEventListener('keydown', listener)
    }
    document.addEventListener('keydown', this.handleEscape)
    listeners.push(this.handleEscape)

    // Create a div to render children in
    if (!this.portal) {
      this.portal = document.createElement('div')
      document.body.appendChild(this.portal)
    }
    // Kick off the render
    this.componentDidUpdate()
  }

  componentWillUnmount() {
    // Remove the `esc` key event listener, enable parent listener
    document.removeEventListener('keydown', this.handleEscape)
    listeners.pop()
    if (listeners.length > 0) {
      const previousListener = listeners.slice(-1)[0]
      document.addEventListener('keydown', previousListener)
    }

    // Clean up div used for rendering children
    document.body.removeChild(this.portal);

    // Keep track of how many modals are open,
    // If this is the last modal, unlock the page's scroll
    activeModals--
    if (activeModals < 1) {
      $('body').removeClass('modal-open')
      $('.Draftail-Toolbar').attr('style', null)
      $('footer').css('display', 'block')
    }
  }

  componentDidUpdate() {
    const { children, handleClose, isFullScreen } = this.props
    ReactDOM.render(
      <ModalInner isFullScreen={isFullScreen} handleClose={handleClose}>{children}</ModalInner>,
      this.portal
    )
  }

  render() {
    return null
  }
}


// Renders components inside a modal
// Passes functions down to children so that the close button can be hidden
class ModalInner extends Component {

  static propTypes = {
    handleClose: PropTypes.func,
  }

  static childContextTypes = {
    hideModalClose: PropTypes.func,
    showModalClose: PropTypes.func,
  }

   constructor(props) {
    super(props)
    this.state = {
      showCloseButton: true,
    }
  }

  getChildContext = () => ({
    hideModalClose: this.hideModalClose,
    showModalClose: this.showModalClose,
  })

  hideModalClose = () => {
    this.setState({showCloseButton: false})
  }

  showModalClose = () => {
    this.setState({showCloseButton: true})
  }

  render() {
    const { showCloseButton } = this.state
    const { children, handleClose, isFullScreen } = this.props
    return (
      <div className={`${styles.wrapper} ${isFullScreen && styles.fullscreen}`}>
        <div className={`${styles.content} ${isFullScreen && styles.fullscreen}`}>
          {showCloseButton &&
            <div onClick={handleClose} className={styles.closeBtn}>&times;</div>
          }
          {children}
        </div>
      </div>
    )
  }
}
