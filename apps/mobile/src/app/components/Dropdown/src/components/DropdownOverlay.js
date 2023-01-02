import {StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';

const DropdownOverlay = ({onPress, backgroundColor}) => {
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
    />
  );
};

export default DropdownOverlay;

