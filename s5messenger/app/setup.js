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

function setup(): Component {

  console.disableYellowBox = true;
  Parse.initialize(APP_ID);
  Parse.serverURL = `${SERVER_URL}/parse`;

  class Root extends Component {

    state = {
      isLoading: true,
      store: configureStore(() => this.setState({isLoading: false})),
    };

    render() {
      if (this.state.isLoading) {
        return null;
      }

      /** 컴포넌트에 Store를 제공하는 Provider (최상위 컨포넌트) **/
      return (
        <Provider store={this.state.store}>
          <App />
        </Provider>
      );
    }

  }

  return Root;
}

global.LOG = (...args) => {
  console.log('/------------------------------\\');
  console.log(...args);
  console.log('\\------------------------------/');
  return args[args.length - 1];
};

module.exports = setup;
