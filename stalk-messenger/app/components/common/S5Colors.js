/**
 * TODO 색상은 여기에 기록할 것!
 *
 * @flow
 */

'use strict';

function colorForProfile(str, count = 1) {

  let index = str.charCodeAt(0);
  const hue = Math.round(460 * index / (count+10));
  return `hsl(${hue}, 74%, 65%)`;
}

module.exports = {
  actionText: '#3FB4CF',
  inactiveText: '#9B9B9B',
  darkText: '#032250',
  lightText: '#7F91A7',
  cellBorder: '#EEEEEE',
  darkBackground: '#183E63',
  colorForProfile,
};
