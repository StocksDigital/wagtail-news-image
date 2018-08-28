import ImageBlock from './block'
import ImageSource from './source'


window.draftail.registerPlugin({
  type: 'NEWS-IMAGE',
  source: ImageSource,
  block: ImageBlock,
})
