const fadeIn = el => {
  if (el.style.display === 'none') {
    el.style.display = 'block'
  }
  const fadeInAnim = el.animate([{ opacity: 0 }, { opacity: 1 }], {
    fill: 'both',
    duration: 1000
  })
}

const fadeOut = el => {
  const fadeOutAnim = el.animate([{ opacity: 1 }, { opacity: 0 }], {
    fill: 'both',
    duration: 400
  })
  fadeOutAnim.onfinish = () => {
    el.style.display = 'none'
  }
}

const loaderEl = () => {
  const el = $(`<div style="display: flex; justify-content: center; padding: 2rem; margin: 1rem;" id="loaderContainer">
      <div class="loader">
        <div class="loader-dot"></div>
        <div class="loader-dot"></div>
        <div class="loader-dot"></div>
      </div>
    </div>`)
  return el
}

const showLoader = () => {
  $('.message-list').append(loaderEl)
}

const hideLoader = () => {
  $('#loaderContainer').remove()
}
