/**
 *
 * @flow
 */

'use strict';

import React, { Component } from 'react';
import Parse from 'parse/react-native';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import {SERVER_URL, APP_ID} from '../env';

import App from './components/app';

export default class Messenger extends React.Component {

  state = {
    isLoading: true,
    store: configureStore(() => this.setState({isLoading: false})),
  };

  componentDidMount() {
  }

  render() {

    if (this.state.isLoading) {
      return null;
    }

    return (
      <Provider store={this.state.store}>
        <App />
      </Provider>
    );
  }


}
