// SOCKET CONNECTION
var socket = io()

// DOM CONSTANTS
const sendButton = document.querySelector('#sendButton')
const msgContainer = $('#messageInput')
const msgList = $('.message-list')
const changeInfoBtn = $('#changeinfo')
const changeInfoModal = document.querySelector('uc-modal')

changeInfoModal.addEventListener('accept', function(e) {
  const name = $('uc-modal input').val()
  socket.emit('user-info', { name })
  changeStatus(name)
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

// UTILITY FUNCTIONS
const changeStatus = name => {
  const statusEl = $('.status')
  if (name) {
    statusEl.text(name)
    statusEl.css('display', 'block')
  } else {
    statusEl.css('display', 'none')
  }
}

const scrollToBottom = () => {
  const scrollPosition = $('.message-list')[0].scrollHeight
  console.log('position', scrollPosition)
  $('.message-list').scrollTop(scrollPosition)
}

const sendMessage = msg => {
  const chatMsgEl = `<div class="chat-msg">
          <div>
            <div><span class="senderName">You</span></div>
            ${msg}
            <div><span class="timestamp">${moment().format(
              'h:mm a'
            )}</span></div>
          </div>
        </div>`
  msgList.append(chatMsgEl)
  socket.emit('chat-message', msg)
  msgContainer.val('')
  scrollToBottom()
}

const receiveMessage = (msg, senderName, timestamp) => {
  const chatMsgEl = `<div class="chat-msg other">
          <div>
            <div><span class="senderName">${senderName}</span></div>
            ${msg}
            <div><span class="timestamp">${timestamp}</span></div>
          </div>
        </div>`
  msgList.append(chatMsgEl)
  scrollToBottom()
}

const addNotfication = name => {
  const notificationEl = `<div class="notificaiton">
          <span>
            ℹ ${name} joined the chat.
          </span>
          </div>`
  msgList.append(notificationEl)
  scrollToBottom()
}

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

// SOCKET CONFIGURATION

socket.on('reply', data => {
  receiveMessage(data.message, data.userInfo.name, data.timestamp)
})

socket.on('new-connection', data => {
  addNotfication(data.name)
})
