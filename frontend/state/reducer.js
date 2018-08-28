/*
This module exports a 'reducer' function, which
receives the previous state and an action, and returns the next state
*/

// Main modal controls
const modalReducer = {
  OPEN_MODAL: (state, action) => ({
    ...state,
    showModal: true,
  }),
  CLOSE_MODAL: (state, action) => ({
    ...state,
    showModal: false,
  }),
}


// Edit or upload an image
const imageReducer = {
  // Add an uploaded image or an image fetched from backend
  ADD_NEW_IMAGE: (state, action) => {
    const newImage = {
      ...state.image,
      id: action.image.id || state.image.id,
      src: action.image.src,
      width: getNewImageWidth(state.image, action.image),
      title: state.image.title || action.image.title || '',
      maxWidth: getImageMaxWidth(action.image),
    }
    return {
      ...state,
      image: newImage,
      uploadValid: validateImageForUpload(newImage),
    }
  },

  // Update an existing image
  UPDATE_IMAGE: (state, action) => {
    const newImage = {
      ...state.image,
      title: 'title' in action ? action.title : state.image.title,
      alt: 'alt' in action ? action.alt : state.image.alt,
      href: 'href' in action ? action.href : state.image.href,
      width: (action.width
        ? getImageWidth(action.width, state.image.maxWidth)
        : state.image.width),
    }
    return {
      ...state,
      image: newImage,
      uploadValid: validateImageForUpload(newImage),
    }
  },
  // Add a file for uploading
  ADD_FILE: (state, action) => {
    const newImage = {
      ...state.image,
      file: action.file,
    }
    return {
      ...state,
      image: newImage,
      uploadMessage: 'Image not uploaded yet.',
      uploadValid: validateImageForUpload(newImage),
    }
  },
  // Image uploads
  REQUEST_UPLOAD_IMAGE: (state, action) => ({
    ...state,
    uploadMessage: `Uploading ${state.image.file.name}...`,
    uploadValid: false,
  }),
  FAIL_UPLOAD_IMAGE: (state, action) => ({
    ...state,
    uploadMessage: 'Upload failed.',
    uploadValid: validateImageForUpload(state.image),
  }),
  SUCCEED_UPLOAD_IMAGE: (state, action) => ({
    ...state,
    uploadMessage: 'Upload successful.',
    uploadValid: false,
  }),
}


// Image search
const searchReducer = {
  // Image search
  UPDATE_TEXT: (state, action) => ({
    ...state,
    search: {...state.search, query: action.query}
  }),
  REQUEST_SEARCH: (state, action) => ({
    ...state,
    search: {...state.search, loading: true}
  }),
  SUCCEED_SEARCH: (state, action) => ({
    ...state,
    search: {
      ...state.search,
      query: action.query,
      next: action.next,
      images: action.images,
      loading: false,
      offset: 0,
    }
  }),
  SEARCH_NEXT: (state, action) => ({
    ...state,
    search: {
      ...state.search,
      query: action.query,
      next: action.next,
      images: [...state.search.images, ...action.images],
      loading: false,
      offset: state.search.offset + 16,
    }
  }),
  FAIL_SEARCH: (state, action) => ({
    ...state,
    search: {...state.search, loading: false }
  }),
  SCROLL_NEXT: (state, action) => ({
    ...state,
    search: {
      ...state.search,
      offset: state.search.offset + 16
    }
  }),
  SCROLL_PREV: (state, action) => ({
    ...state,
    search: {
      ...state.search,
      offset: state.search.offset <= 16 ? 0 : state.search.offset - 16
    }
  }),
}


const validateImageForUpload = image =>
  Boolean(image.title) && Boolean(image.file)


const getImageMaxWidth = image => {
  const width = Number.parseInt(image.width)
  if (!width) {
    return 800
  }
  return width > 800 ? 800 : width
}


const getImageWidth = (w, maxWidth) => {
  const width = Number.parseInt(w)
  return width >= maxWidth ? maxWidth : (width - width % 20)
}


const getNewImageWidth = (oldImage, newImage) => {
    const maxWidth = getImageMaxWidth(newImage)
    // If the image already has a width set then use that, else default to the max width
    const width = oldImage.width || maxWidth
    // Ensure the image isn't wider than the max width
    return width > maxWidth ? maxWidth : width
}


const reducers = {
  ...modalReducer,
  ...imageReducer,
  ...searchReducer,
}


module.exports =  (state, action) => {
  const func = reducers[action.type]
  if (!func) return {...state}
  return func(state, action)
}
