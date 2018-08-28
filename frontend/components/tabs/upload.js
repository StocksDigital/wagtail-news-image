import { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Input, Button, LabelPill } from 'generic'
import { actions } from '../../state'

import styles from '../../styles/upload-tab.css'
import modalStyles from  '../../styles/image-modal.css'


const mapStateToProps = state => ({
  image: state.image,
  uploadValid: state.uploadValid,
  uploadMessage: state.uploadMessage,
})
const mapDispatchToProps = dispatch => ({
  uploadImage: () => dispatch(actions.uploadImage()),
  updateImage: imageData => dispatch(actions.updateImage(imageData)),
  addFile: file => dispatch(actions.addFile(file)),
})


class UploadTab extends Component {

  static propTypes = {
    image: PropTypes.object.isRequired,
    uploadValid: PropTypes.bool.isRequired,
    uploadMessage: PropTypes.string.isRequired,
    setActiveTab: PropTypes.func.isRequired,
    uploadImage: PropTypes.func.isRequired,
    updateImage: PropTypes.func.isRequired,
    addFile: PropTypes.func.isRequired,

  }

  handleLinkChange = e =>  this.props.updateImage({href: e.target.value})
  handleTitleChange = e =>  this.props.updateImage({
    title: e.target.value,
    alt: e.target.value
  })
  handleFileChange = e => {
    let file = e.target.files[0]
    if (!file) {
      return
    }
    this.props.addFile(file)
  }
  handleUpload = e => {
    this.props.uploadImage()
    .then(() => this.props.setActiveTab(0)())
  }

  render() {
    const { image, uploadValid, uploadMessage } = this.props
    return (
      <div className={modalStyles.imageModal}>
        <div>
          <h1>Upload Image</h1>
          <Input
            label="Image"
            name="image"
            type="file"
            onChange={this.handleFileChange}
          />
          <Input
            label="Title"
            name="title"
            type="text"
            placeholder="Image title goes here"
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
          <Button
            text="upload"
            disabled={!uploadValid}
            onClick={this.handleUpload}
          />
          {uploadMessage && <span className={styles.message}>{ uploadMessage }</span> }
        </div>
      </div>
    )
  }
}


module.exports = connect(mapStateToProps, mapDispatchToProps)(UploadTab)
