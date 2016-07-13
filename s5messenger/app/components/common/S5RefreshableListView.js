/**
 *
 * @flow
 * @providesModule S5RefreshableListView
 */
'use strict';


import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Platform
} from 'react-native';

var GiftedListView = require('GiftedListView');
var Spinner = require('S5Spinner');

type Rows = Array<Object>;
type RowsAndSections = {
  [sectionID: string]: Object;
};

export type Data = Rows | RowsAndSections;
type RenderElement = () => ?ReactElement;

type Props = {
  renderEmptyList?: ?RenderElement;
};

class S5RefreshableListView extends Component {

  constructor(props: Props) {
    super(props);

    this.renderEmptyView = this.renderEmptyView.bind(this);
    this.renderSeparatorView = this.renderSeparatorView.bind(this);
    this.renderPaginationAllLoadedView = this.renderPaginationAllLoadedView.bind(this);

  }

  /**
   * Render a row
   * @param {object} rowData Row data
   */
  _renderSectionHeaderView(sectionData, sectionID) {
    return (
      <View style={customStyles.header}>
        <Text style={customStyles.headerTitle}>
          {sectionID}
        </Text>
      </View>
    );
  }

  /**
   * Render the refreshable view when waiting for refresh
   * On Android, the view should be touchable to trigger the refreshCallback
   * @param {function} refreshCallback The function to call to refresh the listview
   */
  _renderRefreshableWaitingView(refreshCallback) {
    if (Platform.OS !== 'android') {
      return (
        <View style={customStyles.refreshableView}>
          <Text style={customStyles.actionsLabel}>
            ↓
          </Text>
        </View>
      );
    } else {
      return (
        <TouchableHighlight
          underlayColor='#c8c7cc'
          onPress={refreshCallback}
          style={customStyles.refreshableView}
        >
          <Text style={customStyles.actionsLabel}>
            ↻
          </Text>
        </TouchableHighlight>
      );
    }
  }

  /**
   * Render the refreshable view when the pull to refresh has been activated
   * @platform ios
   */
  _renderRefreshableWillRefreshView() {
    return (
      <View style={customStyles.refreshableView}>
        <Text style={customStyles.actionsLabel}>
          ↻
        </Text>
      </View>
    );
  }

  /**
   * Render the refreshable view when fetching
   */
  _renderRefreshableFetchingView() {
    return (
      <View style={customStyles.refreshableView}>
        <Spinner />
      </View>
    );
  }

  /**
   * Render the pagination view when waiting for touch
   * @param {function} paginateCallback The function to call to load more rows
   */
  _renderPaginationWaitingView(paginateCallback) {
    return (
      <TouchableHighlight
        underlayColor='#c8c7cc'
        onPress={paginateCallback}
        style={customStyles.paginationView}
      >
        <Text style={[customStyles.actionsLabel, {fontSize: 13}]}>
          Load more
        </Text>
      </TouchableHighlight>
    );
  }

  /**
   * Render the pagination view when fetching
   */
  _renderPaginationFetchigView() {
    return (
      <View style={customStyles.paginationView}>
        <Spinner />
      </View>
    );
  }

  /**
   * Render the pagination view when end of list is reached
   */
  renderPaginationAllLoadedView() {
    if (this.props.renderPaginationAllLoadedView) {
      return this.props.renderPaginationAllLoadedView();
    }
    return (
      <View style={customStyles.paginationView}>
        <Text style={customStyles.actionsLabel}>
          ~
        </Text>
      </View>
    );
  }

  /**
   * Render a view when there is no row to display at the first fetch
   * @param {function} refreshCallback The function to call to refresh the listview
   */
  renderEmptyView(refreshCallback) {
    if (this.props.renderEmptyView) {
      return this.props.renderEmptyView();
    }
    return (
      <View style={customStyles.defaultView}>
        <Text style={customStyles.defaultViewTitle}>
          Sorry, there is no content to display
        </Text>

        <TouchableHighlight
          underlayColor='#c8c7cc'
          onPress={refreshCallback}
        >
          <Text>
            ↻
          </Text>
        </TouchableHighlight>
      </View>
    );
  }


  /**
   * Render a separator between rows
   */
  renderSeparatorView() {
    if (this.props.renderSeparatorView) {
      return this.props.renderSeparatorView();
    }
    return (
      <View style={customStyles.separator} />
    );
  }

  render() {
    return (
      <GiftedListView

        {...this.props}

        initialListSize={12} // the maximum number of rows displayable without scrolling (height of the listview / height of row)

        firstLoader={true} // display a loader for the first fetching

        pagination={this.props.pagination || true} // enable infinite scrolling using touch to load more
        paginationFetchigView={this._renderPaginationFetchigView}
        paginationAllLoadedView={this.renderPaginationAllLoadedView}
        paginationWaitingView={this._renderPaginationWaitingView}

        refreshable={this.props.refreshable || true} // enable pull-to-refresh for iOS and touch-to-refresh for Android
        refreshableViewHeight={50} // correct height is mandatory
        refreshableDistance={40} // the distance to trigger the pull-to-refresh - better to have it lower than refreshableViewHeight
        refreshableFetchingView={this._renderRefreshableFetchingView}
        refreshableWillRefreshView={this._renderRefreshableWillRefreshView}
        refreshableWaitingView={this._renderRefreshableWaitingView}

        emptyView={this.renderEmptyView}

        renderSeparator={this.renderSeparatorView}

        //withSections={true} // enable sections
        //sectionHeaderView={this._renderSectionHeaderView}

        PullToRefreshViewAndroidProps={{
          colors: ['#fff'],
          progressBackgroundColor: '#003e82',
        }}

        scrollAutoLoadEnabled={true}

        autoPaginate={true}

      />
    );
  }

};

var customStyles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: '#CCC'
  },
  refreshableView: {
    height: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsLabel: {
    fontSize: 20,
    color: '#007aff',
  },
  paginationView: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  defaultView: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  defaultViewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  row: {
    padding: 10,
    height: 44,
  },
  header: {
    backgroundColor: '#50a4ff',
    padding: 10,
  },
  headerTitle: {
    color: '#fff',
  },
});

module.exports = S5RefreshableListView;
