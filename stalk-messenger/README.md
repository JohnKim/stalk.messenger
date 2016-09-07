# STALK MESSENGER

### init s5messenger project

```
react-native init s5messenger
cd s5messenger

npm install --save react-native-image-picker@latest react-native-linear-gradient react-native-vector-icons
rnpm link

npm install --save moment git://github.com/S5Platform/Parse-SDK-JS.git redux react-redux redux-logger redux-persist redux-thunk tween-functions
npm install --save-dev faker # babel-eslint eslint eslint-plugin-react eslint-plugin-react-native remote-redux-devtools

npm install --save react-native-action-button react-native-gifted-chat react-native-gifted-listview react-native-gifted-spinner react-native-push-notification  git://github.com/S5Platform/react-native-socketio.git react-native-scrollable-tab-view

# Setting react-native-push-notification MANUALLY
# https://github.com/zo0r/react-native-push-notification

# Setting react-native-socketio MANUALLY
# https://github.com/S5Platform/react-native-socketio
```

### install and run

```
watchman watch-del-all
npm cache clean
npm install
```

```
npm start -- --reset-cache
react-native run-ios
```
