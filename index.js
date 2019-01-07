'use strict';

import React from 'react';

import {
	PickerIOS,
	Platform,
} from 'react-native';

import WheelCurvedPicker from './WheelCurvedPicker'
import VSPicker from '../../app/Commons/Views/pickers/VSPicker'
module.exports = (Platform.OS === 'ios' ? VSPicker : WheelCurvedPicker)
