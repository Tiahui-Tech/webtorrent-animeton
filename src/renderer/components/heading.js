const React = require('react')
const PropTypes = require('prop-types')
const { styled } = require('@mui/material/styles')
const { grey } = require('@mui/material/colors')

const StyledHeading = styled('h1')(({ theme }) => ({
  color: grey[100],
  fontSize: 20,
  marginBottom: 15,
  marginTop: 30
}))

class Heading extends React.Component {
  static get propTypes () {
    return {
      level: PropTypes.number
    }
  }

  static get defaultProps () {
    return {
      level: 1
    }
  }

  render () {
    return (
      <StyledHeading as={`h${this.props.level}`}>
        {this.props.children}
      </StyledHeading>
    )
  }
}

module.exports = Heading