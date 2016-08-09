/**
 *
 * @flow
 * @providesModule S5SwipeListView
 */
'use strict';

import React, {
  Component,
  PropTypes
} from 'react';
import {
  ListView,
  Text,
  View,
  StyleSheet
} from 'react-native';

import S5SwipeRow from './S5SwipeRow';
import S5SectionList from './S5SectionList';

/**
 * f that renders SwipeRows.
 */
export default class S5SwipeListView extends Component {

  constructor(props){
    super(props);
    this._rows = {};
    this.openCellId = null;


    this.cellTagMap = {};
    this.scrollToSection = this.scrollToSection.bind(this);
  }

  setScrollEnabled(enable) {
    this._listView.setNativeProps({scrollEnabled: enable});
  }

  safeCloseOpenRow() {
    // if the openCellId is stale due to deleting a row this could be undefined
    if (this._rows[this.openCellId]) {
      this._rows[this.openCellId].closeRow();
    }
  }

  onRowOpen(secId, rowId, rowMap) {
    const cellIdentifier = `${secId}${rowId}`;
    if (this.openCellId && this.openCellId !== cellIdentifier) {
      this.safeCloseOpenRow();
    }
    this.openCellId = cellIdentifier;
    this.props.onRowOpen && this.props.onRowOpen(secId, rowId, rowMap);
  }

  onRowPress(id) {
    if (this.openCellId) {
      if (this.props.closeOnRowPress) {
        this.safeCloseOpenRow();
        this.openCellId = null;
      }
    }
  }

  onScroll(e) {
    if (this.openCellId) {
      if (this.props.closeOnScroll) {
        this.safeCloseOpenRow();
        this.openCellId = null;
      }
    }
    this.props.onScroll && this.props.onScroll(e);
  }

  setRefs(ref) {
    this._listView = ref;
    this.props.listViewRef && this.props.listViewRef(ref);
  }

  renderRow(rowData, secId, rowId, rowMap) {
    const Component = this.props.renderRow(rowData, secId, rowId, rowMap);
    if (!this.props.renderHiddenRow) {
      return React.cloneElement(
        Component,
        {
          ...Component.props,
          ref: row => this._rows[`${secId}${rowId}`] = row,
          onRowOpen: _ => this.onRowOpen(secId, rowId, this._rows),
          onRowClose: _ => this.props.onRowClose && this.props.onRowClose(secId, rowId, this._rows),
          onRowPress: _ => this.onRowPress(`${secId}${rowId}`),
          setScrollEnabled: enable => this.setScrollEnabled(enable)
        }
      );
    } else {
      return (
        <S5SwipeRow
          ref={row => this._rows[`${secId}${rowId}`] = row}
          onRowOpen={ _ => this.onRowOpen(secId, rowId, this._rows) }
          onRowClose={ _ => this.props.onRowClose && this.props.onRowClose(secId, rowId, this._rows) }
          onRowPress={ _ => this.onRowPress(`${secId}${rowId}`) }
          setScrollEnabled={ (enable) => this.setScrollEnabled(enable) }
          leftOpenValue={this.props.leftOpenValue}
          rightOpenValue={this.props.rightOpenValue}
          closeOnRowPress={this.props.closeOnRowPress}
          disableLeftSwipe={this.props.disableLeftSwipe}
          disableRightSwipe={this.props.disableRightSwipe}
          recalculateHiddenLayout={this.props.recalculateHiddenLayout}
          style={this.props.swipeRowStyle}
        >
          {this.props.renderHiddenRow(rowData, secId, rowId, this._rows)}
          {this.props.renderRow(rowData, secId, rowId, this._rows)}
        </S5SwipeRow>
      );
    }
  }

  updateTagInCellMap(tag, section) {
    // TODO impl this
    this.cellTagMap[section] = tag;
  }

  scrollToSection(section) {
    var y = 0;
    var headerHeight = this.props.headerHeight || 0;
    y += headerHeight;

    var cellHeight = this.props.cellHeight;
    var sectionHeaderHeight = this.props.sectionHeaderHeight || 0;
    var keys = Object.keys(this.props.sectionData);
    var index = keys.indexOf(section);

    var numcells = 0;
    for (var i = 0; i < index; i++) {
      numcells += this.props.sectionData[keys[i]].length;
    }

    sectionHeaderHeight = index * sectionHeaderHeight;
    y += numcells * cellHeight + sectionHeaderHeight;
    var maxY = this.totalHeight - this.containerHeight + headerHeight;
    y = y > maxY ? maxY : y;

    this._listView.scrollTo({ x:0, y, animated: true });
  }

  render() {
    var sectionList;

    if ( this.props.sectionData ){
      sectionList = !this.props.hideSectionList ?
        <S5SectionList
          style={this.props.sectionListStyle}
          onSectionSelect={this.scrollToSection}
          sections={Object.keys(this.props.sectionData)}
          data={this.props.sectionData}
          getSectionListTitle={this.props.getSectionListTitle}
          component={this.props.sectionListItem}
        /> :
        null;
    }

    return (
      <View ref="view" style={[styles.container, this.props.style]}>
        <ListView
          {...this.props}
          ref={ c => this.setRefs(c) }
          onScroll={ e => this.onScroll(e) }
          renderRow={(rowData, secId, rowId) => this.renderRow(rowData, secId, rowId, this._rows)}
        />
        {sectionList}
      </View>
    )
  }

}

var styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

var stylesheetProp = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.object,
]);

S5SwipeListView.propTypes = {
  /**
   * How to render a row. Should return a valid React Element.
   */
  renderRow: PropTypes.func.isRequired,
  /**
   * How to render a hidden row (renders behind the row). Should return a valid React Element.
   * This is required unless renderRow is passing a SwipeRow.
   */
  renderHiddenRow: PropTypes.func,
  /**
   * TranslateX value for opening the row to the left (positive number)
   */
  leftOpenValue: PropTypes.number,
  /**
   * TranslateX value for opening the row to the right (negative number)
   */
  rightOpenValue: PropTypes.number,
  /**
   * Should open rows be closed when the listView begins scrolling
   */
  closeOnScroll: PropTypes.bool,
  /**
   * Should open rows be closed when a row is pressed
   */
  closeOnRowPress: PropTypes.bool,
  /**
   * Disable ability to swipe rows left
   */
  disableLeftSwipe: PropTypes.bool,
  /**
   * Disable ability to swipe rows right
   */
  disableRightSwipe: PropTypes.bool,
  /**
   * Enable hidden row onLayout calculations to run always.
   *
   * By default, hidden row size calculations are only done on the first onLayout event
   * for performance reasons.
   * Passing ```true``` here will cause calculations to run on every onLayout event.
   * You may want to do this if your rows' sizes can change.
   * One case is a S5SwipeListView with rows of different heights and an options to delete rows.
   */
  recalculateHiddenLayout: PropTypes.bool,
  /**
   * Called when a swipe row is animating open
   */
  onRowOpen: PropTypes.func,
  /**
   * Called when a swipe row is animating closed
   */
  onRowClose: PropTypes.func,
  /**
   * Styles for the parent wrapper View of the SwipeRow
   */
  swipeRowStyle: PropTypes.object,
  /**
   * Called when the ListView ref is set and passes a ref to the ListView
   * e.g. listViewRef={ ref => this._swipeListViewRef = ref }
   */
  listViewRef: PropTypes.func,

  /**
   * Styles to pass to the container
   */
  style: stylesheetProp,

  /**
   * Styles to pass to the section list container
   */
  sectionListStyle: stylesheetProp
}

S5SwipeListView.defaultProps = {
  leftOpenValue: 0,
  rightOpenValue: 0,
  closeOnScroll: true,
  closeOnRowPress: true,
  disableLeftSwipe: false,
  disableRightSwipe: false,
  recalculateHiddenLayout: false
}
