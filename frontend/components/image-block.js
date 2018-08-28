import { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Modal, TabNav } from 'generic'
import EditTab from './tabs/edit'
import SearchTab from './tabs/search'
import UploadTab from './tabs/upload'
import { actions } from '../state'

import styles from '../styles/image-block.css'


const mapStateToProps = state => ({
  showModal: state.showModal,
  image: state.image,
})
const mapDispatchToProps = dispatch => ({
  openModal: () => dispatch(actions.openModal()),
  closeModal: () => dispatch(actions.closeModal()),
  fetchImage: id => dispatch(actions.fetchImage(id)),
})


class ImageBlock extends Component {

  static propTypes = {
    store: PropTypes.object.isRequired,  // Redux store
    image: PropTypes.object.isRequired,
    showModal: PropTypes.bool.isRequired,
    openModal: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    fetchImage: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
    }
  }

  componentDidCatch(error, info) {
    console.error(error, info)
    this.setState({ hasError: true })
  }

  componentDidMount() {
    const { image, fetchImage } = this.props;
    if (image.id) {
      fetchImage(image.id)
    }
  }

  renderError() {
    return (
      <div className={styles.placeholder}>
        <h4>Image Block Error</h4>
      </div>
    )
  }

  renderPlaceholder() {
    const { openModal } = this.props
    return (
      <div onClick={openModal} className={styles.placeholder}>
        <h4>Click to add an image</h4>
      </div>
    )
  }

  renderImage() {
    const { image, openModal } = this.props
    return (
      <div className={styles.wrapper} onClick={openModal}>
        <img src={image.src} width={image.width}/>
        {image.title && <p>{image.title}</p>}
      </div>
    )
  }

  render() {
    const { image, showModal, closeModal, store } = this.props
    let contents
    if (this.state.hasError) {
      contents = this.renderError()
    } else if (image.src) {
      contents = this.renderImage()
    } else {
      contents = this.renderPlaceholder()
    }
    const defaultTab = image.src ? 0 : 1
    const modal = !showModal ? null : (
      <Modal handleClose={closeModal}>
        <TabNav defaultTab={defaultTab} tabs={['Edit', 'Search', 'Upload']}>
          <EditTab store={store}/>
          <SearchTab store={store} />
          <UploadTab store={store}/>
        </TabNav>
      </Modal>
    )
    return (
      <div className={styles.block}>
        {contents}
        {modal}
      </div>
    )
  }
}


module.exports = connect(mapStateToProps, mapDispatchToProps)(ImageBlock)
