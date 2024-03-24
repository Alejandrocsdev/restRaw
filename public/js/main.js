const origin = window.location.origin
// create page
const createBtns = document.querySelector('.create-btn')
const createInput = document.querySelectorAll('.create-input')

init()

function init() {
  createPage()
}

function createPage() {
  if (createBtns !== null) {
    createBtns.addEventListener('click', (event) => {
      const target = event.target
      if (target.classList.contains('return-btn')) {
        event.preventDefault()
        window.location.href = `${origin}/restaurants`
      } else if (target.classList.contains('reset-btn')) {
        event.preventDefault()
        createInput.forEach((e) => (e.value = ''))
      }
    })
  }
}
