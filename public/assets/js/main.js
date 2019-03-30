var socket = io()
const botName = 'tiger'

// =======================================
// DOM CONSTANTS
// =======================================
const sendButton = document.querySelector('#sendButton')
const msgContainer = $('#messageInput')
const msgList = $('.message-list')
const changeInfoBtn = $('#changeinfo')
const changeInfoModal = document.querySelector('uc-modal')

// =======================================
// UTILITY FUNCTIONS
// =======================================
const changeStatus = connectToServer => {
  const name = $('uc-modal input').val()
  const statusEl = $('.status')
  if (name && connectToServer) {
    if (!socket.connected) {
      socket.open()
    }
    socket.emit('user-info', { name })
    statusEl.text(name)
    statusEl.css('display', 'block')
    statusEl.removeClass('disconnected')
    $('#disconnectBtn').css('display', 'block')
    $('#reconnectBtn').css('display', 'none')
  } else {
    statusEl.addClass('disconnected')
    $('#disconnectBtn').css('display', 'none')
  }
}

const scrollToBottom = () => {
  const scrollPosition = $('.message-list')[0].scrollHeight
  $('.message-list').scrollTop(scrollPosition)
}

const sendMessage = msg => {
  const chatMsgEl = `  
  <div class="chat-msg">
    <div>
      <div><span class="senderName">You</span></div>
      ${msg}
      <div><span class="timestamp">${moment().format('h:mm a')}</span></div>
    </div>
  </div>`
  msgList.append(chatMsgEl)
  msgContainer.val('')
  scrollToBottom()
  //RETURN IF THE REQUEST IS FOR THE BOT
  if (msg.includes('tiger')) {
    botRequest(msg)
    return
  }
  socket.emit('chat-message', msg)
}

const receiveMessage = (msg, senderName, timestamp) => {
  const chatMsgEl = `
    <div class="chat-msg other">
      <div>
        <div><span class="senderName">${senderName}</span></div>
        ${msg}
        <div><span class="timestamp">${timestamp}</span></div>
      </div>
    </div>`
  msgList.append(chatMsgEl)
  scrollToBottom()
}

/**
 *
 * @param {String} msg
 * @param {Boolean} botNotification
 */
const addNotfication = (msg, botNotification) => {
  const notificationEl = `<div class="notificaiton ${
    botNotification ? 'bot' : ''
  }">
          <span>
            ${msg}
          </span>
          </div>`
  msgList.append(notificationEl)
  scrollToBottom()
}

// ================================
// BOT CONFIGUARATION FUNCTIONS
// ================================
const queryCheckers = {
  weather: msg => msg.includes('weather') || msg.includes('temperature'),
  ipl: msg => msg.includes('ipl') || msg.includes('temperature'),
  election: msg => msg.includes('election') || msg.includes('lok'),
  changeName: msg => msg.includes('call you') || msg.includes('change name'),
  movies: msg => msg.includes('movies'),
  greeting: msg =>
    msg.includes('hey') || msg.includes('hello') || msg.includes('hi')
}

const botRequest = msg => {
  let queryType

  //CALCULATING QUERY TYPE
  for (var key in queryCheckers) {
    const match = queryCheckers[key](msg)
    if (match) {
      queryType = key
      break
    }
  }

  // FOR WEATHER QUERY
  if (queryType == 'weather' && navigator.geolocation) {
    // FETCHING LOCATION
    navigator.geolocation.getCurrentPosition(
      ({ coords: { longitude, latitude } }) => {
        socket.emit('bot-request', {
          type: queryType,
          data: {
            lat: latitude,
            long: longitude
          }
        })
      }
    )
    return
  }

  socket.emit('bot-request', {
    type: queryType
  })
}

const receiveFromBot = (msg, senderName, timestamp) => {
  const chatMsgEl = `<div class="chat-msg bot">
          <div>
            <div><span class="senderName">${senderName}</span></div>
            ${msg}
            <div><span class="timestamp">${timestamp}</span></div>
          </div>
        </div>`
  msgList.append(chatMsgEl)
  scrollToBottom()
}

// =======================================
// DOM LISTENERS
// =======================================
msgContainer.keyup(function(e) {
  if (e.keyCode == 13) {
    const msg = $(this).val()
    sendMessage(msg)
  }
})

sendButton.addEventListener('click', e => {
  const msg = msgContainer.val()
  sendMessage(msg)
})

changeInfoBtn.on('click', function(e) {
  changeInfoModal.setAttribute('opened', true)
})

$('uc-modal #okay').on('click', e => {
  changeInfoModal.okay()
})

$('uc-modal #closeButton').on('click', e => {
  changeInfoModal.decline()
})

changeInfoModal.addEventListener('accept', function(e) {
  changeStatus(true)
})

$('#disconnectBtn').click(function(e) {
  socket.close()
  $('#reconnectBtn').css('display', 'block')
  changeStatus(false)
})

$('#reconnectBtn').click(function(e) {
  changeStatus(true)
})

// =======================================
// SOCKET LISTENERS
// =======================================
socket.on('reply', data => {
  receiveMessage(data.message, data.userInfo.name, data.timestamp)
})

socket.on('new-connection', data => {
  addNotfication(`${data.name} has joined the chat`)
})

socket.on('user-disconnect', data => {
  addNotfication(`${data.name} has left the chat`)
})

socket.on('bot-reply', data => {
  let message
  switch (data.reponseType) {
    case 'weather':
      const { type, temp, location } = data.message
      message = `In ${location}, <br> It's ${temp} &#176 C , ${type}`
      break

    default:
      message = data.message
      break
  }
  receiveFromBot(message, data.userInfo.name, data.timestamp)
})

socket.on('bot-name-change', botData => {
  botName = botData.name
})

socket.on('disconnect', () => {
  socket.open()
})
