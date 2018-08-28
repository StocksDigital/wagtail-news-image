// All HTTP API requests that used by the image block
const getCSRFToken = () => $('[name=csrfmiddlewaretoken]')[0].value

module.exports = {
  image: {
    get: id =>
      fetch(window.NEWS_IMAGE.API_URL + `${id}/`, {
        method: 'GET',
        credentials: 'include',
      })
      .then(r => r.json()),
    post: image => {
      const csrf = getCSRFToken()
      const formData  = new FormData()
      formData.append('csrfmiddlewaretoken', csrf)
      formData.append('title', image.title)
      formData.append('image_file', image.file)
      return fetch(window.NEWS_IMAGE.API_URL, {
        method: 'POST',
        credentials: 'include',
        body: formData,
        headers: {'X-CSRFToken': csrf},
      })
      .then(r => {
        if (!r.ok) {
          throw Error(r.statusText)
        }
        return r
      })
      .then(r => r.json())
    },
    search: (query, next) => {
      const startUrl = window.NEWS_IMAGE.API_URL + `?width=256&search=${encodeURIComponent(query)}`
      let url = next || startUrl
      return fetch(url, {
        method: 'GET',
        credentials: 'include',
      })
      .then(r => r.json())
    }
  }
}
