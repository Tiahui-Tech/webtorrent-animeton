const { dispatch } = require('../lib/dispatcher')

// Controls the activation of the App
module.exports = class ActivationController {
  constructor(state) {
    this.state = state
  }

  // Activates the key
  activateKey(keyData) {
    console.log('Activating keyData:', keyData)
    this.state.saved.activation = keyData

    dispatch('stateSaveImmediate')
  }

  updateKeyState(keyData) {
    console.log('Updating key state:', keyData)
    this.state.saved.activation = keyData

    dispatch('stateSaveImmediate')
  }

  cleanKeyState() {
    console.log('Cleaning key state')
    this.state.saved.activation = {
      discordId: null,
      status: null,
      blocked: false,
      key: null,
      createdAt: null,
      activatedAt: null
    }

    dispatch('stateSaveImmediate')
  }
}
