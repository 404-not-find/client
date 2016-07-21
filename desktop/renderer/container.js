import React, {Component} from 'react'
import {Provider} from 'react-redux'
import Nav from '../shared/nav.desktop'
import RemoteManager from './remote-manager'
import {MuiThemeProvider} from 'material-ui/styles'
import materialTheme from '../shared/styles/material-theme.desktop'
import {reduxDevToolsEnable} from '../shared/local-debug.desktop'

export default class Root extends Component {
  state: {
    panelShowing: boolean
  };

  constructor () {
    super()

    this.state = {
      panelShowing: false,
    }

    if (__DEV__) { // eslint-disable-line no-undef
      window.addEventListener('keydown', event => {
        if (event.ctrlKey && event.keyCode === 72) {
          this.setState({panelShowing: !this.state.panelShowing})
        }
      })
    }
  }

  render () {
    let dt = null
    if (__DEV__ && reduxDevToolsEnable) { // eslint-disable-line no-undef
      const DevTools = require('./redux-dev-tools').default
      dt = <DevTools />
    }

    const {store} = this.props

    return (
      <MuiThemeProvider muiTheme={materialTheme}>
        <Provider store={store}>
          <div style={{display: 'flex', flex: 1}}>
            <RemoteManager />
            <Nav />
            {dt}
          </div>
        </Provider>
      </MuiThemeProvider>
    )
  }
}
