import React, {forwardRef, useImperativeHandle} from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import styles from './styles';
import {isExist} from './helpers/isExist';
import DropdownOverlay from './components/DropdownOverlay';
import DropdownModal from './components/DropdownModal';
import DropdownWindow from './components/DropdownWindow';
import {useSelectDropdown} from './hooks/useSelectDropdown';
import {useLayoutDropdown} from './hooks/useLayoutDropdown';
import {useRefs} from './hooks/useRefs';

const SelectDropdown = (
  {
    data /* array */,
    onSelect /* function  */,
    defaultButtonText /* String */,
    buttonTextAfterSelection /* function */,
    rowTextForSelection /* function */,
    defaultValue /* any */,
    defaultValueByIndex /* integer */,
    disabled /* boolean */,
    disableAutoScroll /* boolean */,
    disabledIndexs /* array of disabled Row index */,
    onFocus /* function  */,
    onBlur /* function  */,
    onScrollEndReached /* function  */,
    /////////////////////////////
    buttonStyle /* style object for button */,
    buttonTextStyle /* style object for button text */,
    renderCustomizedButtonChild /* function returns React component for customized button */,
    /////////////////////////////
    renderDropdownIcon,
    dropdownIconPosition,
    statusBarTranslucent,
    dropdownStyle,
    dropdownOverlayColor /* string */,
    /////////////////////////////
    rowStyle /* style object for row */,
    rowTextStyle /* style object for row text */,
    selectedRowStyle /* style object for selected row */,
    selectedRowTextStyle /* style object for selected row text */,
    renderCustomizedRowChild /* function returns React component for customized row */,
    /////////////////////////////
    search ,
    onChangeSearchInputText /* function callback when the search input text changes, this will automatically disable the dropdown's interna search to be implemented manually outside the component  */,
  },
  ref,
) => {
  const disabledInternalSearch = !!onChangeSearchInputText;
  /* ******************* hooks ******************* */
  const {dropdownButtonRef, dropDownFlatlistRef} = useRefs();
  const {
    dataArr, //
    selectedItem,
    selectedIndex,
    selectItem,
    reset,
    setSearchTxt,
  } = useSelectDropdown(data, defaultValueByIndex, defaultValue, disabledInternalSearch);
  const {
    isVisible, //
    setIsVisible,
    onDropdownButtonLayout,
    getItemLayout,
    dropdownWindowStyle,
  } = useLayoutDropdown(data, dropdownStyle, rowStyle, search);
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
    dropdownButtonRef.current.measure((fx, fy, w, h, px, py) => {
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
          disabled={disabledIndexs?.includes(index)}
          activeOpacity={0.8}
          style={{...styles.dropdownRow, ...rowStyle, ...(isSelected && selectedRowStyle)}}
          onPress={() => onSelectItem(item, index)}>
          {renderCustomizedRowChild ? (
            <View style={styles.dropdownCustomizedRowParent}>{renderCustomizedRowChild(item, index, isSelected)}</View>
          ) : (
            <Text
              numberOfLines={1}
              allowFontScaling={false}
              style={{...styles.dropdownRowText, ...rowTextStyle, ...(isSelected && selectedRowTextStyle)}}>
              {rowTextForSelection ? rowTextForSelection(item, index) : item.toString()}
            </Text>
          )}
        </TouchableOpacity>
      )
    );
  };
  const renderDropdown = () => {
    return (
      isVisible && (
        <DropdownModal statusBarTranslucent={statusBarTranslucent} visible={isVisible}>
          <DropdownOverlay onPress={closeDropdown} backgroundColor={dropdownOverlayColor} />
          <DropdownWindow layoutStyle={dropdownWindowStyle}>
            <FlatList
              data={dataArr}
              keyExtractor={(item, index) => index.toString()}
              ref={dropDownFlatlistRef}
              renderItem={renderFlatlistItem}
              getItemLayout={getItemLayout}
              onLayout={onLayout}
              stickyHeaderIndices={search && [0]}
              keyboardShouldPersistTaps="always"
              onEndReached={() => onScrollEndReached && onScrollEndReached()}
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
      activeOpacity={0.8}
      ref={dropdownButtonRef}
      disabled={disabled}
      onPress={openDropdown}
      style={{
        ...styles.dropdownButton,
        ...(dropdownIconPosition === 'left' ? styles.row : styles.rowRevese),
        ...buttonStyle,
      }}>
      {renderDropdown()}
      {renderDropdownIcon && renderDropdownIcon(isVisible)}
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