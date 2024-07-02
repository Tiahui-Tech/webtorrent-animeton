const React = require('react')
const TextField = require('@mui/material/TextField').default
const Box = require('@mui/material/Box').default
const Typography = require('@mui/material/Typography').default
const { clipboard } = require('electron')

const ModalOKCancel = require('./modal-ok-cancel')
const { dispatch, dispatcher } = require('../lib/dispatcher')
const { isMagnetLink } = require('../lib/torrent-player')

module.exports = class OpenTorrentAddressModal extends React.Component {
  constructor(props) {
    super(props)
    this.torrentURLRef = React.createRef()
  }

  render () {
    return (
      <Box className='open-torrent-address-modal'>
        <Typography component="p"><label>Enter torrent address or magnet link</label></Typography>
        <Box>
          <TextField
            id='torrent-address-field'
            className='control'
            inputRef={this.torrentURLRef}
            fullWidth
            onKeyDown={handleKeyDown.bind(this)}
          />
        </Box>
        <ModalOKCancel
          cancelText='CANCEL'
          onCancel={dispatcher('exitModal')}
          okText='OK'
          onOK={handleOK.bind(this)}
        />
      </Box>
    )
  }

  componentDidMount () {
    if (this.torrentURLRef.current) {
      this.torrentURLRef.current.focus()
      const clipboardContent = clipboard.readText()

      if (isMagnetLink(clipboardContent)) {
        this.torrentURLRef.current.value = clipboardContent
        this.torrentURLRef.current.select()
      }
    }
  }
}

function handleKeyDown (e) {
  if (e.key === 'Enter') handleOK.call(this) /* hit Enter to submit */
}

function handleOK () {
  dispatch('exitModal')
  dispatch('addTorrent', this.torrentURLRef.current.value)
}