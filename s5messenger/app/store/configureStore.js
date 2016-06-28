/**
 *
 * @flow
 */

'use strict';

import { applyMiddleware, createStore } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import { AsyncStorage } from 'react-native';

import thunk from 'redux-thunk'; // (https://github.com/gaearon/redux-thunk)
import createLogger from 'redux-logger'; // (https://github.com/theaqua/redux-logger)

import promise from './middleware/promise';
import array from './middleware/array';

// reducer
import reducers from '../reducers';
/* ************************************************************************** */

var isDebuggingInChrome = __DEV__ && !!window.navigator.userAgent;

var logger = createLogger({
  predicate: (getState, action) => isDebuggingInChrome, // 로깅 조건
  collapsed: true,
  duration: true,
});

var createS5Store = applyMiddleware(
  thunk,
  promise,
  array,
  logger
)(createStore);

function configureStore(onComplete: ?() => void) {

  // TODO(frantic): reconsider usage of redux-persist, maybe add cache breaker

  const store = autoRehydrate()(createS5Store)(reducers);
  persistStore(store, {storage: AsyncStorage}, onComplete);

  if (isDebuggingInChrome) {
    window.store = store;
  }
  return store;
}

module.exports = configureStore;
