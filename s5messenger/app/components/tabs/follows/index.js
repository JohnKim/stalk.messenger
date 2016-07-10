/**
 *
 * @flow
 */

'use strict';


import React, { Component } from 'react';
import {
  View,
  Navigator,
  StyleSheet,
} from 'react-native';

import { loadPostByPage } from 's5-action';
import { connect } from 'react-redux';

import { Text } from 'S5Text';
import Header from 'S5Header';
import RefreshableListView from 'S5RefreshableListView';
import PostCell from '../post/PostCell';

const PAGE_SIZE = 20;

class FollowsScreen extends Component {

  constructor(props) {
    super(props);

    this.state = { };

    this._onFetch       = this._onFetch.bind(this);
    this._renderRowView = this._renderRowView.bind(this);
    this.openPostDetail = this.openPostDetail.bind(this);
  }

  _onFetch(page = 1, callback, options) {

    this.props.loadPost(page)
      .then(function(result){

        let rows = result.map( (object) => {

          let location = object.get("location").toJSON();

          return {
            id: object.id,
            title: object.get('title'),
            description: object.get('description'),
            slug: object.get('slug') || '',
            location: { longitude: location.longitude, latitude: location.latitude } || {},
            tags: object.get('tags') || [],
            created: object.createdAt.getTime(),
          };

        });

        if(rows.length < PAGE_SIZE){
          callback(rows, {
            allLoaded: true, // the end of the list is reached
          });
        } else {
          callback(rows);
        }
      });

  }

  _renderRowView(post) {
    return (
      <PostCell
        key={post.id}
        post={post}
        onPress={() => this.openPostDetail(post)}
      />
    );
  }

  openPostDetail(post) {
    console.log(post);
  }


  render() {

    const searchItem = {
      title: 'Search',
      icon: require('./img/search.png'),
      onPress: () => alert('Filter button pressed!'),
    };

    return (
      <View style={styles.container}>
        <Header
          title="Follows"
          style={{backgroundColor: '#224488'}}
          rightItem={{...searchItem, layout: 'icon'}}
        />
        <RefreshableListView
          onFetch={this._onFetch}
          rowView={this._renderRowView}
        />
      </View>
    );
  }

}

FollowsScreen.propTypes = {
  user: React.PropTypes.object,
  navigator: React.PropTypes.object, // Navigator
  loadPost: React.PropTypes.func, // (page: number) => Array<Post>
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  }
});

function select(store) {
  return {
    user: store.user,
  };
}

function actions(dispatch) {
  return {
    loadPost: (page: number) => dispatch(loadPostByPage(page, PAGE_SIZE)),
  };
}

module.exports = connect(select, actions)(FollowsScreen);
