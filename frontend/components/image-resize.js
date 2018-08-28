import { Component } from 'react'
import PropTypes from 'prop-types'

import { Modal, Input, Button } from 'generic'

import styles from '../styles/image-resize.css'


export default class ImageResize extends Component {

  static propTypes = {
    handleWidthChange: PropTypes.func.isRequired,
    image: PropTypes.shape({
      src: PropTypes.string,
      width: PropTypes.number,
      maxWidth: PropTypes.number,
    }).isRequired
  }

  constructor(props) {
    super(props);
  }

  render() {
    const { handleWidthChange, image } = this.props
    return (
      <div className={styles.wrapper}>
        <div className={styles.controls}>
          <Input
            label="Width"
            name="width"
            type="range"
            min={160}
            max={image.maxWidth}
            onChange={handleWidthChange}
            value={Number(image.width)}
          />
        </div>
        <div className={styles.previewWrapper}>
          <div className={styles.preview}>
            <p>Lorem ipsum dolor sit amet, mei at dicta summo definitiones, error iudico scribentur nam ne, volutpat dissentias no mei. Soluta percipitur cum ex, sensibus hendrerit appellantur eam cu. Ei eius causae lucilius pri, cibo delenit legendos sed an. His eu consul timeam mnesarchum.</p>
            <p>Eum agam periculis ex, ea mel possim albucius. Ex expetendis mnesarchum mea, ad mucius labore argumentum cum. Ea lorem veritus mediocritatem vim. Ad atqui epicurei cum, illud nostrud efficiantur pro ex. Quo ei purto movet primis, oblique legimus corrumpit et sea.</p>
            <img src={image.src} width={image.width}/>
            <p>Mea graeco rationibus et, natum dicunt placerat ut usu, etiam nihil fuisset te sit. Ei vim putent pertinacia eloquentiam, eius doming vel ex, ei omnium audiam propriae nec. Adhuc postea inermis duo ne, purto invenire delicata id eam, causae albucius voluptaria at nam. Cum prima consulatu cu, id etiam soleat ius.</p>
            <p>Essent repudiandae sed an, ullum luptatum recusabo vel ad. Qui amet iisque fastidii eu. Pertinax consequat forensibus vix cu, semper eripuit laboramus vim et. Usu id feugiat rationibus constituam, at vis inani veritus. Populo scripserit in mea, per lorem adolescens moderatius in.</p>
          </div>
        </div>
      </div>
    )
  }
}
