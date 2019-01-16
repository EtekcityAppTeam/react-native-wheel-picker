/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * This is a controlled component version of RCTPickerIOS
 *
 * @format
 * @flow
 */

'use strict';

import React from 'react';
import {  
  StyleSheet,
  View,
  requireNativeComponent,
  processColor
} from 'react-native';


import type {SyntheticEvent} from 'CoreEventTypes';
import type {ColorValue} from 'StyleSheetTypes';
import type {ViewProps} from 'ViewPropTypes';
import type {TextStyleProp} from 'StyleSheet';

type PickerIOSChangeEvent = SyntheticEvent<
  $ReadOnly<{|
    newValue: any,
    newIndex: number,
  |}>,
>;

type VSPickerIOSItemType = $ReadOnly<{|
  label: ?Label,
  value: ?any,
  textColor: ?number,
|}>;

type VSPickerIOSType = Class<
  ReactNative.NativeComponent<
    $ReadOnly<{|
      items: $ReadOnlyArray<VSPickerIOSItemType>,
      onChange: (event: PickerIOSChangeEvent) => void,
      onResponderTerminationRequest: () => boolean,
      onStartShouldSetResponder: () => boolean,
      selectedIndex: number,
      style?: ?TextStyleProp,
      itemSpace: number,
      separatorColor: ColorValue,
    |}>,
  >,
>;

const VSPicker: VSPickerIOSType = (requireNativeComponent(
  'VSPicker',
): any);

type Label = Stringish | number;

type Props = $ReadOnly<{|
  ...ViewProps,
  children: React.ChildrenArray<React.Element<typeof PickerIOSItem>>,
  itemStyle?: ?TextStyleProp,
  onChange?: ?(event: PickerIOSChangeEvent) => mixed,
  onValueChange?: ?(newValue: any, newIndex: number) => mixed,
  selectedValue: any,
  itemSpace: any,
  separatorColor: ColorValue,
|}>;

type State = {|
  selectedIndex: number,
  items: $ReadOnlyArray<RCTPickerIOSItemType>,
|};

type ItemProps = $ReadOnly<{|
  label: ?Label,
  value?: ?any,
  color?: ?ColorValue,
  currentTextColor: ?ColorValue,
|}>;

const PickerIOSItem = (props: ItemProps) => {
  return null;
};

class VSPickerIOS extends React.Component<Props, State> {
  _picker: ?React.ElementRef<RCTPickerIOSType> = null;

  state = {
    selectedIndex: 0,
    items: [],
  };

  static Item = PickerIOSItem;

  static getDerivedStateFromProps(props: Props): State {
    let selectedIndex = 0;
    const items = [];
    React.Children.toArray(props.children).forEach(function(child, index) {
      if (child.props.value === props.selectedValue) {
        selectedIndex = index;
      }
      items.push({
        value: child.props.value,
        label: child.props.label,
        textColor: processColor(child.props.color),
      });
    });
    return {selectedIndex, items};
  }

  render() {
    return (
      <View style={this.props.style}>
        <VSPicker
          ref={picker => {
            this._picker = picker;
          }}
          style={[this.props.style, this.props.itemStyle]}
          items={this.state.items}
          itemSpace={this.props.itemSpace}
          separatorColor={this.props.separatorColor}
          currentTextColor={this.props.itemStyle ? this.props.itemStyle.currentTextColor : null}
          selectedIndex={this.state.selectedIndex}
          onChange={this._onChange}
          onStartShouldSetResponder={() => true}
          onResponderTerminationRequest={() => false}
        />
      </View>
    );
  }

  _onChange = event => {
    if (this.props.onChange) {
      this.props.onChange(event);
    }
    if (this.props.onValueChange) {
      this.props.onValueChange(
        event.nativeEvent.newValue,
        event.nativeEvent.newIndex,
      );
    }

    // The picker is a controlled component. This means we expect the
    // on*Change handlers to be in charge of updating our
    // `selectedValue` prop. That way they can also
    // disallow/undo/mutate the selection of certain values. In other
    // words, the embedder of this component should be the source of
    // truth, not the native component.
    if (
      this._picker &&
      this.state.selectedIndex !== event.nativeEvent.newIndex
    ) {
      this._picker.setNativeProps({
        selectedIndex: this.state.selectedIndex,
      });
    }
  };
}

// const styles = StyleSheet.create({
//   pickerIOS: {
//     // The picker will conform to whatever width is given, but we do
//     // have to set the component's height explicitly on the
//     // surrounding view to ensure it gets rendered.
//     height: 216,
//   },
// });

module.exports = VSPickerIOS;