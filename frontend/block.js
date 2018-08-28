import { Component } from 'react'
import { Provider } from 'react-redux'
const updateBlockEntity = window.Draftail.DraftUtils.updateBlockEntity

import { initStore } from './state'
import ImageBlock from './components/image-block'


// The block is used to render the entity in the editor
// It may receive props:
// *  from the source component when first created
// *  from the server side when reloaded from the database
export default class ImageBlockWrapper extends Component {

  // Pull image data from content state and put it in the Redux store
  constructor(props) {
    super(props)
    const imageData = props.blockProps.entity.getData()
    this.store = initStore(this.updateDraftail, imageData)
  }

  // Push redux store data back into Drafttail's content state
  updateDraftail = image => {
    const { block, blockProps } = this.props
    const { editorState, onChange } = blockProps

    onChange(updateBlockEntity(editorState, block, {
      id: image.id,
      title: image.title,
      alt: image.alt,
      href: image.href,
      width: image.width,
    }))
  }

  render() {
    return (
      <Provider store={this.store}>
        <ImageBlock store={this.store}/>
      </Provider>
    )
  }
}
