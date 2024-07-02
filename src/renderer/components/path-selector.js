const path = require('path')
const remote = require('@electron/remote')
const React = require('react')
const PropTypes = require('prop-types')

const Button = require('@mui/material/Button').default
const TextField = require('@mui/material/TextField').default
const Box = require('@mui/material/Box').default
const Typography = require('@mui/material/Typography').default
const { grey } = require('@mui/material/colors')

// Lets you pick a file or directory.
// Uses the system Open File dialog.
// You can't edit the text field directly.
class PathSelector extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    dialog: PropTypes.object,
    id: PropTypes.string,
    onChange: PropTypes.func,
    title: PropTypes.string.isRequired,
    value: PropTypes.string
  }

  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    const opts = Object.assign({
      defaultPath: path.dirname(this.props.value || ''),
      properties: ['openFile', 'openDirectory']
    }, this.props.dialog)

    const filenames = remote.dialog.showOpenDialogSync(remote.getCurrentWindow(), opts)
    if (!Array.isArray(filenames)) return
    this.props.onChange && this.props.onChange(filenames[0])
  }

  render () {
    const id = this.props.title.replace(' ', '-').toLowerCase()
    const text = this.props.value || ''

    return (
      <Box 
        className={this.props.className} 
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%'
        }}
      >
        <Typography 
          className='label' 
          sx={{
            flexShrink: 0,
            marginRight: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {this.props.title}:
        </Typography>
        <TextField
          className='control'
          disabled
          id={id}
          value={text}
          sx={{
            flex: 1,
            '& .MuiInputBase-input': {
              color: grey[50]
            }
          }}
        />
        <Button
          className='control'
          variant="contained"
          onClick={this.handleClick}
          sx={{ marginLeft: 1 }}
        >
          Change
        </Button>
      </Box>
    )
  }
}

module.exports = PathSelector