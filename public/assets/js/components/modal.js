class Modal extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this._modalOpen = false
    this.shadowRoot.innerHTML = `    
    <style>
      :host {
        display: block;
        position: fixed;
        width: 100%;
        height: 100%;
        z-index: 10;
        left: 0;
        top: 0;
        pointer-events: all;
        transition: all 0.3s;
      }
      :host(.hidden) {
        opacity: 0;
        pointer-events: none;
      }
      :host(.hidden) .modal-box {
        top: 15%;
      }
      .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        background: rgba(0, 0, 0, 0.513);
      }
      .modal-box {
        position: absolute;
        left: 50%;
        top: 20%;
        transform: translateX(-50%);
        z-index: 1;
        min-width: 50%;
        transition: top 0.3s;
        border-radius: 1.5rem;
        overflow: hidden;
      }
      .modal-box--header {
        padding: 2rem;
        font-size: 3rem;
        text-transform: capitalize;
        background: #0277bd;
        color: white;
      }
      .modal-box--header h1 {
        font-size: 2rem;
      }

      ::slotted(#title) {
        color: white;
        font-size: 2rem;
      }

      .modal-box--content {
        padding: 2rem 3rem;
        background: #fff;
      }
      .modal-box--actions {
        background: #ddd;
        padding: 1rem;
        display: flex;
        justify-content: flex-end;
      }
    </style>
    <div class="modal-wrapper">
      <div class="modal-overlay"></div>
      <div class="modal-box">
        <div class="modal-box--header">
          <slot name="title"><h1>Please Confirm</h1></slot>
        </div>
        <div class="modal-box--content">
          <slot></slot>
        </div>
        <div class="modal-box--actions">
          <slot name="actions">
            <button id="okay" class="btn">Okay</button>
            <button id="closeButton" class="btn btn--red">cancel</button>
          </slot>
        </div>
      </div>
    </div>
`
  }

  static get observedAttributes() {
    return ['opened']
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (newVal === oldVal) {
      return
    }
    if (name === 'opened') {
      if (newVal != null) {
        this._open()
        return
      }
      this._close()
    }
  }

  connectedCallback() {
    if (!this.hasAttribute('opened')) {
      this.classList.add('hidden')
    }
    const shadowroot = this.shadowRoot
    shadowroot
      .querySelector('.modal-overlay')
      .addEventListener('click', this.decline.bind(this))
    shadowroot
      .querySelector('#closeButton')
      .addEventListener('click', this.decline.bind(this))
    shadowroot
      .querySelector('#okay')
      .addEventListener('click', this.okay.bind(this))
  }

  onSubmit(cb) {
    this.onComplete = cb
  }

  okay(e) {
    if (this.onComplete) {
      this.onComplete()
    }
    this._close()
    const acceptEvent = new Event('accept', { bubbles: true, composed: true })
    this.dispatchEvent(acceptEvent)
  }

  decline(e) {
    this._close()
    const declineEvent = new Event('decline', { bubbles: true, composed: true })

    this.dispatchEvent(declineEvent)
  }

  _open() {
    this._modalOpen = true
    this._render()
  }

  _close() {
    this._modalOpen = false
    this.removeAttribute('opened')
    this._render()
  }

  _render() {
    if (this._modalOpen) {
      this.classList.remove('hidden')
    } else {
      this.classList.add('hidden')
    }
  }
}

customElements.define('uc-modal', Modal)
