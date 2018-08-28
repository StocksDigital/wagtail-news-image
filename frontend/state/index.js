import { applyMiddleware, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger }  from 'redux-logger'

import reducer from './reducer'
import actions from './actions'


const initStore = (update, imageData) => {
  // Add a middleware function to push image data to Draftail when
  // the 'UPDATE_DRAFTAIL' action is fired
  const updateMiddleware = update => store => next => action => {
    if (action.type === 'UPDATE_DRAFTAIL') {
      update(action.image)
    }
    return next(action)
  }

  const loggerMiddleware = createLogger()
  const middleware = applyMiddleware(
    updateMiddleware(update),
    thunkMiddleware,
    loggerMiddleware
  )
  const initialState = {
    showModal: false,
    uploadValid: false,
    uploadMessage: '',
    image: {
        id: imageData.id,
        title: imageData.title || '',
        alt: imageData.alt,
        href: imageData.href || '',
        width: !!imageData.width ? Number(imageData.width) : null,
        file: null,
        src: null,
    },
    search: {
      query: '',
      loading: false,
      images: [],
      offset: 0,
      next: null,
    },
  }
  return createStore(reducer, initialState, middleware)
}


module.exports = { initStore, actions }
