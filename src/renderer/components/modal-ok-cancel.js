const React = require('react')
const Button = require('@mui/material/Button').default
const Box = require('@mui/material/Box').default

module.exports = class ModalOKCancel extends React.Component {
  render () {
    const { cancelText, onCancel, okText, onOK } = this.props
    return (
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          className='control cancel'
          sx={{ marginRight: 1, color: 'black' }}
          onClick={onCancel}
          variant="text"
        >
          {cancelText}
        </Button>
        <Button
          className='control ok'
          onClick={onOK}
          variant="contained"
          color="primary"
          autoFocus
        >
          {okText}
        </Button>
      </Box>
    )
  }
}