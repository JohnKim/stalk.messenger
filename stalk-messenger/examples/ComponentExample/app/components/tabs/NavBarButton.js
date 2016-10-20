/**
 *
 * @flow
 */

import React, { Component, PropTypes } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import Colors from 'S5Colors';
import Icon from 'S5Icon';

export default class NavBarButton extends Component {

  static propTypes = {
    actions: PropTypes.arrayOf(PropTypes.shape({
      icon: PropTypes.string.isRequired,
    })),
    onPress: PropTypes.func.isRequired,
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
      if (action.icon) {
        return (
            <TouchableOpacity onPress={() => props.onPress(action.key || action.icon)} key={action.key || action.icon} style={styles.content}>
              <Icon key={action.key || action.icon} name={action.icon} size={props.size} color={props.color} style={[ props.style, {} ]} />
            </TouchableOpacity>
          );
      }
      return Promise.resolve(action);
    })).then(actions => { this.setState({ actions }) } );

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
      <View style={{flexDirection: 'row'}}>
        {this.state.actions}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    justifyContent:'center'
  }
});
