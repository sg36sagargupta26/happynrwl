import React from 'react';
import {Modal} from 'react-native';

const DropdownModal = ({visible, statusBarTranslucent, children}) => {
  
  return (
    <Modal
      supportedOrientations={['portrait', 'landscape']}
      animationType="none"
      transparent={true}
      statusBarTranslucent={statusBarTranslucent}
      visible={visible}>
      {children}
    </Modal>
  );
};

export default DropdownModal;
