import { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Modal, Input, Button, LabelPill } from 'generic'
import ImageResize from '../image-resize'
import { actions } from '../../state'

import styles from '../../styles/edit-tab.css'
import modalStyles from  '../../styles/image-modal.css'


const mapStateToProps = state => ({
  image: state.image,
})
const mapDispatchToProps = dispatch => ({
  updateImage: image => dispatch(actions.updateImage(image)),
})


class EditTab extends Component {

  static propTypes = {
    updateImage: PropTypes.func,
    image: PropTypes.shape({
      src: PropTypes.string,
      title: PropTypes.string,
      href: PropTypes.string,
      width: PropTypes.any,
    }).isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {showResize: false}
  }

  openResize = () => this.setState({showResize: true})
  closeResize = () => this.setState({showResize: false})
  handleLinkChange = e =>  this.props.updateImage({href: e.target.value})
  handleWidthChange = e => this.props.updateImage({width: e.target.value})
  handleTitleChange = e =>  this.props.updateImage({
    title: e.target.value,
    alt: e.target.value
  })

  render() {
    const { showResize } = this.state;
    const { image } = this.props
    if (showResize) {
      return (
        <Modal handleClose={this.closeResize} isFullScreen={true}>
          <ImageResize
            handleWidthChange={this.handleWidthChange}
            image={image}
          />
        </Modal>
      )
    }

    return (
      <div className={modalStyles.imageModal}>
        <h1>Edit Image</h1>
        {!image.src && <p>No image selected.</p>}
        {image.src && (
          <div>
            <Input
              label="Caption"
              name="title"
              type="text"
              placeholder="Image caption goes here"
              onChange={this.handleTitleChange}
              value={image.title}
            />
            <Input
              label="Link"
              name="href"
              type="url"
              placeholder="http://example.com (optional)"
              onChange={this.handleLinkChange}
              value={image.href}
            />
            <LabelPill label="Width" value={Number(image.width)}/>
            <Button text="resize" onClick={this.openResize}/>
          </div>
        )}
        {image.src && (
          <div className={styles.imagePreview}>
            <div style={{maxWidth: `${image.width}px`, backgroundImage: `url(${image.src})` }} />
          </div>
        )}
      </div>
    )
  }
}


module.exports = connect(mapStateToProps, mapDispatchToProps)(EditTab)
