/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

'use strict';
import  VSPickerIOS from './VSPickerIOS';
import React from 'react';
import { 
  ColorPropType,
  Platform,
  UnimplementedView,
  StyleSheet,
  ViewPropTypes,
 } from 'react-native';
import PropTypes from 'prop-types'


const MODE_DIALOG = 'dialog';
const MODE_DROPDOWN = 'dropdown';

/**
 * Individual selectable item in a Picker.
 */
class PickerItem extends React.Component {
  static propTypes = {
    /**
    * Text to display for this item.
    */
    label: PropTypes.string.isRequired,
    /**
      * The value to be passed to picker's `onValueChange` callback when
      * this item is selected. Can be a string or an integer.
      */
    value: PropTypes.any,
    /**
      * Color of this item's text.
      * @platform android
      */
    color: ColorPropType,
    /**
      * Used to locate the item in end-to-end tests.
      */
    testID: PropTypes.string,
  }

  render() {
    // The items are not rendered directly
    throw null;
  }

}


/**
 * Renders the native picker component on iOS and Android. Example:
 *
 *     <Picker
 *       selectedValue={this.state.language}
 *       onValueChange={(itemValue, itemIndex) => this.setState({language: itemValue})}>
 *       <Picker.Item label="Java" value="java" />
 *       <Picker.Item label="JavaScript" value="js" />
 *     </Picker>
 */
class VSPicker extends React.Component{


  static propTypes = {
    style: ViewPropTypes.style,
    /**
     * Value matching value of one of the items. Can be a string or an integer.
     */
    selectedValue: PropTypes.any,
    /**
     * Callback for when an item is selected. This is called with the following parameters:
     *   - `itemValue`: the `value` prop of the item that was selected
     *   - `itemPosition`: the index of the selected item in this picker
     */
    onValueChange: PropTypes.func,
    /**
     * If set to false, the picker will be disabled, i.e. the user will not be able to make a
     * selection.
     * @platform android
     */
    enabled: PropTypes.bool,
    /**
     * On Android, specifies how to display the selection items when the user taps on the picker:
     *
     *   - 'dialog': Show a modal dialog. This is the default.
     *   - 'dropdown': Shows a dropdown anchored to the picker view
     *
     * @platform android
     */
    mode: PropTypes.oneOf(['dialog', 'dropdown']),
    /**
     * Style to apply to each of the item labels.
     * @platform ios
     */
    itemStyle: PropTypes.object,
    /**
     * Prompt string for this picker, used on Android in dialog mode as the title of the dialog.
     * @platform android
     */
    prompt: PropTypes.string,
    /**
     * Used to locate this view in end-to-end tests.
     */
    testID: PropTypes.string,
  }

  static defaultProps = {
    mode: MODE_DIALOG,
  }

  /**
   * On Android, display the options in a dialog.
   */
  static MODE_DIALOG = MODE_DIALOG;

  /**
   * On Android, display the options in a dropdown (this is the default).
   */
  static MODE_DROPDOWN = MODE_DROPDOWN;

  static Item = PickerItem;
  render() {
    if (Platform.OS === 'ios') {
      // $FlowFixMe found when converting React.createClass to ES6
      return <VSPickerIOS {...this.props}>{this.props.children}</VSPickerIOS>;
    } else {
      return <UnimplementedView />;
    }
  }

}



module.exports = VSPicker;
