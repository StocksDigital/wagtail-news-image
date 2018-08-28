/*
This module exports a collection of 'action' functions,
which can be used to dispatch events for the reducer

Redux's store.dispatch is aliased to 'd' for brevity
*/
import SparkMD5 from 'spark-md5'

import api from './api'

// Main modal controls
const modalActions = {
  // Open the main modal
  openModal: () => ({
    type: 'OPEN_MODAL',
  }),
  // Close the main modal and save data to the Draftail content state
  closeModal: () => (d, getState) => {
    const state = getState()
    d({type: 'UPDATE_DRAFTAIL', image: state.image})
    d({type: 'CLOSE_MODAL'})
  },
}


// Edit or upload images
const imageActions = {
  // Fetch image details from the backend API
  fetchImage: id => d => {
    return api.image.get(id)
    .then( data => {
      d({type: 'ADD_NEW_IMAGE', image: {
        src: data.rendition_url,
        width: data.width,
      }})
    })
    .catch((error) => {
      console.error(error)
      d({type: 'API_ERROR', error: error})
    })
  },
  // Select an image from the search tab
  selectImage: image => d => {
    d({type: 'ADD_NEW_IMAGE', image: {
      id: image.id,
      src: '', // Don't use the search menu's low resolution image rendition
    }})
    d(imageActions.fetchImage(image.id))
  },
  // Update image with new data (title, alt, href, width)
  updateImage: imageData => ({
    type: 'UPDATE_IMAGE',
    ...imageData
  }),
  // Add a file for uploading
  addFile: file => d => {
    if (!file.name.match('^image.')) {
      // Proceed as normal if the filename doesn't start with 'image.'
      d({type: 'ADD_FILE', file: file})
    } else {
      // Copy paste uploads always use a generic `image.png` name
      // so we rename the file here to paste.<hash>.png
      const reader = new FileReader()
      reader.onload = e => {
        const hash = SparkMD5.ArrayBuffer.hash(e.target.result)
        const extension = file.name.split('.').slice(-1)
        const filename = `paste.${hash}.${extension}`
        file = new File([file], filename, {type: file.type})
         d({type: 'ADD_FILE', file: file})
      }
      reader.readAsArrayBuffer(file)
    }
  },
  // Upload an image to the backend
  uploadImage: () => (d, getState) => {
    const state = getState()
    if (!state.uploadValid) {
      return
    }
    d({type: 'REQUEST_UPLOAD_IMAGE'})
    return api.image.post(state.image)
    .then(data => {
      d({type: 'SUCCEED_UPLOAD_IMAGE'})
      d({type: 'ADD_NEW_IMAGE', image: {
        id: data.id,
        title: data.title,
        src: data.rendition_url,
        file: null,
      }})
    })
    .catch(error => {
      d({type: 'FAIL_UPLOAD_IMAGE'})
      console.error(error)
    })
  },
}


// Image search
const searchActions = {
  updateSearchText: query => ({ type: 'UPDATE_TEXT', query: query }),
  searchImages: query => d => {
    d({type: 'REQUEST_SEARCH'})
    return api.image.search(query)
    .then(data => d({
      type: 'SUCCEED_SEARCH',
      next: data.next,
      images: data.results,
      query: query,
    }))
    .catch(error => {
      d({type: 'FAIL_SEARCH'})
      console.error(error)
    })
  },
  scrollSearchNext: () => (d, getState) => {
    const search = getState().search
    if (search.offset + 32 <= search.images.length) {
      d({ type: 'SCROLL_NEXT'})
    } else {
      d({type: 'REQUEST_SEARCH'})
      return api.image.search(search.query, search.next)
      .then(data => d({
        type: 'SEARCH_NEXT',
        next: data.next,
        images: data.results,
        query: search.query,
      }))
      .catch(error => {
        d({type: 'FAIL_SEARCH'})
        console.error(error)
      })
    }
  },
  scrollSearchPrev: () => ({type: 'SCROLL_PREV'}),
}


module.exports = {
  ...modalActions,
  ...imageActions,
  ...searchActions,
}
