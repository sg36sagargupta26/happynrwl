import { useState, useMemo} from 'react';
import {I18nManager, Dimensions} from 'react-native';
const {height} = Dimensions.get('window');

export const useLayoutDropdown = (data, dropdownStyle, rowStyle) => {
  const [isVisible, setIsVisible] = useState(false); // dropdown visible ?
  const [buttonLayout, setButtonLayout] = useState(null);
  const [dropdownPX, setDropdownPX] = useState(0); // position x
  const [dropdownPY, setDropdownPY] = useState(0); // position y
  
  const [dropdownWIDTH, setDropdownWIDTH] = useState(0); 

  
  const onDropdownButtonLayout = (w, h, px, py) => {
    setButtonLayout({w, h, px, py});
    if (height - 18 < py + h ) {
      setDropdownPX(px);
      setDropdownPY(py - 2 );
    } else {
      setDropdownPX(px);
      setDropdownPY(py + h + 2);
    }
    setDropdownWIDTH(dropdownStyle?.width || w);
  };

  const getItemLayout = (flatlistData, index) => ({
    index,
    length: flatlistData?.length || 0,
    offset: rowStyle && rowStyle.height ? rowStyle.height * index : 50 * index,
  });

  const dropdownWindowStyle = useMemo(() => {
    const top =
       dropdownPY ;
    return {
      ...{
        borderTopWidth: 0,
        overflow: 'hidden',
      },
      ...dropdownStyle,
      ...{
        position: 'absolute',
        top: top,
        width: dropdownWIDTH,
      },
      ...(I18nManager.isRTL ? {right: dropdownStyle?.right || dropdownPX} : {left: dropdownStyle?.left || dropdownPX}),
    };
  }, [dropdownStyle, dropdownPX, dropdownPY, dropdownWIDTH]);

  return {
    isVisible,
    setIsVisible,
    buttonLayout,
    onDropdownButtonLayout,
    getItemLayout,
    dropdownWindowStyle,
  };
};
