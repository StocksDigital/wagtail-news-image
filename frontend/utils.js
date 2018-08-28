// Debounce user input
const debounce = delay => {
  let timer = null
  return func => {
      return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => func( ...args), delay)
      }
  }
}


module.exports = { debounce }
