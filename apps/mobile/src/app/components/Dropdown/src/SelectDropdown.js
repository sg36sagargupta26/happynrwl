import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {View, Text, TouchableOpacity, FlatList , Modal} from 'react-native';
import styles from './styles';
import {useSelectDropdown} from './hooks/useSelectDropdown';
import {useLayoutDropdown} from './hooks/useLayoutDropdown';

const isExist = value => {
  if (value !== undefined && value != null) {
    return true;
  }
  return false;
};

const DropdownWindow = ({ children}) => {
  return <View >{children}</View>;
};

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

const DropdownOverlay = ({onPress}) => {
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
    />
  );
};

const SelectDropdown = (
  {
    data /* array */,
    onSelect /* function  */,
    defaultButtonText /* String */,
    buttonTextAfterSelection /* function */,
    disabled /* boolean */,
    disableAutoScroll /* boolean */,
    disabledIndexs /* array of disabled Row index */,
    onFocus /* function  */,
    onBlur /* function  */,
    /////////////////////////////
    buttonStyle /* style object for button */,
    buttonTextStyle /* style object for button text */,
    renderCustomizedButtonChild /* function returns React component for customized button */,
    /////////////////////////////
    dropdownStyle,
    dropdownOverlayColor /* string */,
    /////////////////////////////
    rowStyle /* style object for row */,
    selectedRowStyle /* style object for selected row */,
    selectedRowTextStyle /* style object for selected row text */,
    
    
  },
  ref,
) => {
  /* ******************* hooks ******************* */
  const dropdownButtonRef = useRef(); // button ref to get positions
  const dropDownFlatlistRef = useRef(null); // ref to the drop down flatlist
  const {
    dataArr, //
    selectedItem,
    selectedIndex,
    selectItem,
    reset,
    setSearchTxt,
  } = useSelectDropdown(data);
  const {
    isVisible, //
    setIsVisible,
    onDropdownButtonLayout,
    getItemLayout,
    dropdownWindowStyle,
  } = useLayoutDropdown(data, dropdownStyle, rowStyle);
  useImperativeHandle(ref, () => ({
    reset: () => {
      reset();
    },
    openDropdown: () => {
      openDropdown();
    },
    closeDropdown: () => {
      closeDropdown();
    },
    selectIndex: index => {
      selectItem(index);
    },
  }));
  /* ******************* Methods ******************* */
  const openDropdown = () => {
    dropdownButtonRef.current.measure(( w, h, px, py) => {
      onDropdownButtonLayout(w, h, px, py);
      setIsVisible(true);
      onFocus && onFocus();
    });
  };
  const closeDropdown = () => {
    setIsVisible(false);
    setSearchTxt('');
    onBlur && onBlur();
  };
  const onLayout = () => {
    if (disableAutoScroll) {
      return;
    }
    if (selectedIndex >= 3 && dropDownFlatlistRef) {
      dropDownFlatlistRef.current.scrollToOffset({
        offset: rowStyle && rowStyle.height ? rowStyle.height * selectedIndex : 50 * selectedIndex,
        animated: true,
      });
    }
  };
  const onSelectItem = (item, index) => {
    closeDropdown();
    onSelect && onSelect(item, index);
    selectItem(index);
  };
  /* ******************** Render Methods ******************** */
  
  const renderFlatlistItem = ({item, index}) => {
    const isSelected = index === selectedIndex;
    return (
      isExist(item) && (
        <TouchableOpacity
          style={{...styles.dropdownRow, ...rowStyle, ...(isSelected && selectedRowStyle)}}
          onPress={() => onSelectItem(item, index)}>
            <Text
              style={{ ...(isSelected && selectedRowTextStyle)}}>
              {item.toString()}
            </Text>
        </TouchableOpacity>
      )
    );
  };
  const renderDropdown = () => {
    return (
      isVisible && (
        <DropdownModal  visible={isVisible}>
          <DropdownOverlay onPress={closeDropdown} backgroundColor={dropdownOverlayColor} />
          <DropdownWindow layoutStyle={dropdownWindowStyle}>
            <FlatList
              data={dataArr}
              keyExtractor={(item, index) => index.toString()}
              ref={dropDownFlatlistRef}
              renderItem={renderFlatlistItem}
              getItemLayout={getItemLayout}
              onLayout={onLayout}
              stickyHeaderIndices={ [0]}
              keyboardShouldPersistTaps="always"
              onEndReachedThreshold={0.5}
            />
          </DropdownWindow>
        </DropdownModal>
      )
    );
  };
  ///////////////////////////////////////////////////////
  return (
    <TouchableOpacity
      ref={dropdownButtonRef}
      disabled={disabled}
      onPress={openDropdown}
      style={{
        ...styles.dropdownButton,
        ... styles.row,
        ...buttonStyle,
      }}>
      {renderDropdown()}
      {renderCustomizedButtonChild ? (
        <View style={styles.dropdownCustomizedButtonParent}>
          {renderCustomizedButtonChild(selectedItem, selectedIndex)}
        </View>
      ) : (
        <Text numberOfLines={1} allowFontScaling={false} style={{...styles.dropdownButtonText, ...buttonTextStyle}}>
          {isExist(selectedItem)
            ? buttonTextAfterSelection
              ? buttonTextAfterSelection(selectedItem, selectedIndex)
              : selectedItem.toString()
            : defaultButtonText || 'Select an option.'}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default forwardRef((props, ref) => SelectDropdown(props, ref));
