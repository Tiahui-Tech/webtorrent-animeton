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
}
