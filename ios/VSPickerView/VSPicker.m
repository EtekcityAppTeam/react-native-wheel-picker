/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "VSPicker.h"

#import "RCTConvert.h"
#import "RCTUtils.h"

@interface VSPicker() <UIPickerViewDataSource, UIPickerViewDelegate>
@end

@implementation VSPicker

- (instancetype)initWithFrame:(CGRect)frame {
  if ((self = [super initWithFrame:frame])) {
    _color = [UIColor blackColor];
    _font = [UIFont systemFontOfSize:21]; // TODO: selected title default should be 23.5
    _selectedIndex = NSNotFound;
    _textAlign = NSTextAlignmentCenter;
    _itemSpace = 32;
    _separatorColor = [UIColor whiteColor];
    self.delegate = self;
    [self selectRow:0 inComponent:0 animated:YES]; // Workaround for missing selection indicator lines (see https://stackoverflow.com/questions/39564660/uipickerview-selection-indicator-not-visible-in-ios10)
  }
  return self;
}

RCT_NOT_IMPLEMENTED(- (instancetype)initWithCoder:(NSCoder *)aDecoder)

- (void)setItems:(NSArray<NSDictionary *> *)items {
  _items = [items copy];
  [self setNeedsLayout];
}

- (void)setSelectedIndex:(NSInteger)selectedIndex {
  if (_selectedIndex != selectedIndex) {
    BOOL animated = _selectedIndex != NSNotFound; // Don't animate the initial value
    _selectedIndex = selectedIndex;
    dispatch_async(dispatch_get_main_queue(), ^{
      [self selectRow:selectedIndex inComponent:0 animated:animated];
    });
  }
}

- (void)setItemSpace:(CGFloat)itemSpace {
  _itemSpace = itemSpace;
}

- (void)setSeparatorColor:(UIColor *)separatorColor {
  _separatorColor = separatorColor;
}

#pragma mark - UIPickerViewDataSource protocol

- (NSInteger)numberOfComponentsInPickerView:(__unused UIPickerView *)pickerView {
  return 1;
}

- (NSInteger)pickerView:(__unused UIPickerView *)pickerView
numberOfRowsInComponent:(__unused NSInteger)component {
  return _items.count;
}

#pragma mark - UIPickerViewDelegate methods

- (NSString *)pickerView:(__unused UIPickerView *)pickerView
             titleForRow:(NSInteger)row
            forComponent:(__unused NSInteger)component {
  return [RCTConvert NSString:_items[row][@"label"]];
}

- (CGFloat)pickerView:(UIPickerView *)pickerView rowHeightForComponent:(NSInteger)component {
    return _itemSpace;
}

- (UIView *)pickerView:(UIPickerView *)pickerView
            viewForRow:(NSInteger)row
          forComponent:(NSInteger)component
           reusingView:(UILabel *)label {
  // 修改分割线颜色
  for(UIView *singleLine in pickerView.subviews) {
      if (singleLine.frame.size.height < 1) {
          singleLine.backgroundColor = _separatorColor;
      }
  }
  // iOS14背景效果去除
  if (@available(iOS 14.0, *)) {
    pickerView.subviews.lastObject.backgroundColor = [UIColor clearColor];
  }
  if (!label) {
    label = [[UILabel alloc] initWithFrame:(CGRect){
      CGPointZero,
      {
        [pickerView rowSizeForComponent:component].width,
        [pickerView rowSizeForComponent:component].height,
      }
    }];
  }
  label.font = _font;
  label.textColor = [RCTConvert UIColor:_items[row][@"textColor"]] ?: _color;
  if(_currentTextColor && _selectedIndex == row){
      UILabel * l = [pickerView viewForRow:row forComponent:component];
      l.textColor = _currentTextColor;
  }
  label.textAlignment = _textAlign;
  label.text = [self pickerView:pickerView titleForRow:row forComponent:component];
  return label;
}

- (void)pickerView:(__unused UIPickerView *)pickerView
      didSelectRow:(NSInteger)row inComponent:(__unused NSInteger)component {
  _selectedIndex = row;
  if (_currentTextColor) {
     UILabel * l = [pickerView viewForRow:row forComponent:component];
     l.textColor = _currentTextColor;
  }
  if (_onChange && _items.count > (NSUInteger)row) {
    _onChange(@{
      @"newIndex": @(row),
      @"newValue": RCTNullIfNil(_items[row][@"value"]),
    });
  }
}

@end
