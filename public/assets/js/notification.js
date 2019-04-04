window.addEventListener('offline', () => {
  showNotification("Seems like you don't have a internet connection.")
})

window.addEventListener('online', () => {
  showNotification('Yay! You are back online.')
})

/**
 *
 * @param {Element} notificationEl The notification panel element
 * @param {String} content The message for the notification
 */
const setNotificationText = (notificationEl, content) => {
  notificationEl.querySelector(
    '.notification-panel__content'
  ).textContent = content
}

const showNotification = msg => {
  const notificationPanel = document.querySelector('.notification-panel')
  notificationPanel.style.display = 'flex'
  setNotificationText(notificationPanel, msg)
  requestAnimationFrame(() => slideIn(notificationPanel))
}

const slideIn = el => {
  if (el.style.display === 'none') {
    el.style.display = 'block'
  }
  el.animate(
    [
      { transform: 'translateX(2rem)', opacity: 0 },
      { transform: 'translateX(0)', opacity: 1 }
    ],
    {
      fill: 'forwards',
      duration: 400
    }
  )
  const timer = setTimeout(() => {
    slideOut(el, timer)
  }, 5000)
}

const slideOut = (el, timer) => {
  clearTimeout(timer)
  const hideAnimation = el.animate(
    [
      { transform: 'translateX(0rem)', opacity: 1 },
      { transform: 'translateX(2rem)', opacity: 0 }
    ],
    {
      fill: 'forwards',
      duration: 400
    }
  )
  hideAnimation.onfinish = () => {
    el.style.display = 'none'
  }
}
