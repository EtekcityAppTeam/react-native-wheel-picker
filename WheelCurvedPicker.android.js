'use strict';

import React from 'react';
import PropTypes from 'prop-types'
import {
	View,
	ColorPropType,
	requireNativeComponent,
} from 'react-native';

const defaultItemStyle = { color: 'white', fontSize: 26 };

const WheelCurvedPickerNativeInterface = {
	name: 'WheelCurvedPicker',
	propTypes: {
		...View.propTypes,
		data:PropTypes.array,
		textColor: ColorPropType,
		currentTextColor:ColorPropType,
		textSize: PropTypes.number,
		itemStyle: PropTypes.object,
		itemSpace: PropTypes.number,
		onValueChange: PropTypes.func,
		selectedValue: PropTypes.any,
		selectedIndex: PropTypes.number,
		itemLineColor: ColorPropType,
	}
}

const WheelCurvedPickerNative = requireNativeComponent('WheelCurvedPicker', WheelCurvedPickerNativeInterface);

class WheelCurvedPicker extends React.Component {
	constructor(props){
		super(props)
		this.state = this._stateFromProps(props)
	}

	static defaultProps = {
		itemStyle : {color:"white", fontSize:26,currentTextColor:'rgb(51,51,51)'},
		itemSpace: 20,
	}

	componentWillReceiveProps (props) {
		this.setState(this._stateFromProps(props));
	}

	_stateFromProps (props) {
		var selectedIndex = 0;
		var items = [];
		React.Children.forEach(props.children, function (child, index) {
			if (child.props.value === props.selectedValue) {
				selectedIndex = index;
			}
			items.push({value: child.props.value, label: child.props.label});
		});

		var textSize = props.itemStyle.fontSize
		var textColor = props.itemStyle.color
		var currentTextColor=props.itemStyle.currentTextColor
		var itemLineColor = props.itemStyle.itemLineColor;
	

		return {selectedIndex, items, textSize, textColor,currentTextColor,itemLineColor};
	}

	_onValueChange = (e) => {
		if (this.props.onValueChange) {
			this.props.onValueChange(e.nativeEvent.data);
		}
	}

	render() {
		return <WheelCurvedPickerNative
				{...this.props}
				onValueChange={this._onValueChange}
				data={this.state.items}
				textColor={this.state.textColor}
				currentTextColor={this.state.currentTextColor}
				textSize={this.state.textSize}
				selectedIndex={parseInt(this.state.selectedIndex)}
				itemLineColor={this.state.itemLineColor} />;
	}
}

WheelCurvedPicker.propTypes={
	propTypes: {
		...View.propTypes,
		data: PropTypes.array,
		textColor: ColorPropType,  
		currentTextColor:ColorPropType,
		textSize:PropTypes.number,
		itemStyle: PropTypes.object,
		itemSpace: PropTypes.number,
		onValueChange: PropTypes.func,
		selectedValue: PropTypes.any,
		selectedIndex: PropTypes.number,
		itemLineColor: ColorPropType,
	}
}

class Item extends React.Component {
	render () {
		// These items don't get rendered directly.
		return null;
	}
}

Item.propTypes = {
	value: PropTypes.any, // string or integer basically
	label: PropTypes.string,
}

WheelCurvedPicker.Item = Item;

module.exports = WheelCurvedPicker;
