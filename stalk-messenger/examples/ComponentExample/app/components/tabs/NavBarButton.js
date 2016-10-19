
import React, { Component, PropTypes } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from 'S5Colors';

export default class NavBarButton extends Component {

  static propTypes = {
    actions: PropTypes.arrayOf(PropTypes.shape({
      icon: PropTypes.string.isRequired,
      onPress: PropTypes.func,
    })),
    size: PropTypes.number,
    color: PropTypes.string,
    style: PropTypes.any,
  };

  static defaultProps = {
    size: 28,
    color: Colors.primaryText,
    actions: [],
  };

  _updateIconSources = (props) => {

    Promise.all((props.actions || []).map((action) => {
      console.log(action.icon);
      if (action.icon) {
        return (
            <TouchableOpacity onPress={action.onPress} key={action.icon}>
              <Icon key={action.icon} name={action.icon} size={props.size} color={props.color} style={props.style} />
            </TouchableOpacity>
          );
      }
      return Promise.resolve(action);
    })).then(actions => {
      console.log(actions)
      this.setState({ actions })
    }
    );

  }

	constructor(props) {
		super(props);
    this.state = {actions: []};
    console.log(props);
	}

  componentWillMount() {
    this._updateIconSources(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.actions != nextProps.actions) {
      this._updateIconSources(nextProps);
    }
  }

  render() {
    return (
      <View style={{flexDirection: 'row', height: 100, padding: 20}}>
        {this.state.actions}
      </View>
    );
  }
}
