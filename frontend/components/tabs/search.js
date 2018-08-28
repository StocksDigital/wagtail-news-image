import { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Input } from 'generic'
import { debounce } from '../../utils'
import { actions } from '../../state'

import styles from '../../styles/search-tab.css'
import modalStyles from  '../../styles/image-modal.css'


const mapStateToProps = state => ({
  image: state.image,
  query: state.search.query,
  loading: state.search.loading,
  images: state.search.images,
  offset: state.search.offset,
  next: state.search.next,
})
const mapDispatchToProps = dispatch => ({
  searchImages: query => dispatch(actions.searchImages(query)),
  updateSearchText: query => dispatch(actions.updateSearchText(query)),
  scrollSearchNext: () => dispatch(actions.scrollSearchNext()),
  scrollSearchPrev: () => dispatch(actions.scrollSearchPrev()),
  selectImage: image => dispatch(actions.selectImage(image)),
})


class SearchTab extends Component {

  static propTypes = {
    image: PropTypes.object.isRequired,
    images: PropTypes.array,
    query: PropTypes.string,
    loading: PropTypes.bool,
    offset: PropTypes.number,
    next: PropTypes.string,
  }

  debounce = debounce(300)

  componentDidMount() {
    this.props.searchImages(this.props.query)
  }

  handleSearch = e => {
    e.persist()
    const query = e.target.value
    this.props.updateSearchText(query)
    this.debounce(() => this.props.searchImages(query))()
  }

  handleSelect = imageIdx => e => {
    const { setActiveTab, selectImage, image, images } = this.props
    let confirmed = !image.id || window.confirm('Are you sure you want to change the image?')
    if (confirmed) {
      selectImage(images[imageIdx])
      setActiveTab(0)() // Navigate to "Edit" tab
    }
  }

  render() {
    const { images, offset, next, loading, selectedIdx, query } = this.props
    const { scrollSearchNext, scrollSearchPrev } = this.props
    return (
      <div className={modalStyles.imageModal}>
        <h1>Search Images</h1>
        {!images && <p>No images found.</p> }
        {images && (
          <div>
            <Input
              label="Search"
              name="search"
              type="text"
              placeholder="Search image title, collection or filename"
              onChange={this.handleSearch}
              value={query}
            />
            <div className={styles.searchResultList}>
              {images.slice(offset, offset + 16).map((image, idx) =>
                <SearchResult
                  key={idx} idx={idx + offset} image={image} offset={offset}
                  handleSelect={this.handleSelect}
                />
              )}
            </div>
            <button
              className="button"
              onClick={scrollSearchPrev}
              disabled={loading || offset <= 0}
            >
              Prev
            </button>
            <button
              className="button"
              onClick={scrollSearchNext}
              disabled={loading || !next}
            >
              Next
            </button>
            {loading && <div className={styles.searching}>Searching...</div>}
          </div>
        )}
      </div>
    )
  }
}


class SearchResult extends Component {

  static propTypes = {
    idx: PropTypes.number,
    image: PropTypes.shape({
      title: PropTypes.string,
      rendition_url: PropTypes.string,
    })
  }

  formatTitle = title => {
    if (title.length <= 28) {
      return title
    }
    return title.slice(0, 25) + '...'
  }

  render() {
    const { image, idx, handleSelect } = this.props
    return (
      <div className={styles.searchResult}>
        <div
          className={styles.image}
          onClick={handleSelect(idx)}
          style={{backgroundImage: `url('${image.rendition_url}')`}}
        >
        </div>
        <div className={styles.title}>{this.formatTitle(image.title)}</div>
      </div>
    )
  }
}


module.exports = connect(mapStateToProps, mapDispatchToProps)(SearchTab)
