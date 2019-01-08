'use strict';

import React from 'react';

import {
	PickerIOS,
	Platform,
} from 'react-native';

import WheelCurvedPicker from './WheelCurvedPicker'
import VSPicker from './VSPicker'
module.exports = (Platform.OS === 'ios' ? VSPicker : WheelCurvedPicker)

