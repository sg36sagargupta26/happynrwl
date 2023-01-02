import {useState, useEffect, useMemo} from 'react';
import {deepSearchInArr} from '../helpers/deepSearchInArr';

const isExist = value => {
  if (value !== undefined && value != null) {
    return true;
  }
  return false;
};

export const useSelectDropdown = (data, defaultValueByIndex, defaultValue, disabledInternalSearch) => {
  const [selectedItem, setSelectedItem] = useState(null); // selected item from dropdown
  const [selectedIndex, setSelectedIndex] = useState(-1); // index of selected item from dropdown
  const [searchTxt, setSearchTxt] = useState('');

  
  // data array changes
  useEffect(() => {
    if (!data || data.length === 0) {
      reset();
    }
  }, [data]);

  // default value by index added or changed
  useEffect(() => {
    // defaultValueByIndex may be equals zero
    if (isExist(defaultValueByIndex)) {
      if (data && isExist(data[defaultValueByIndex])) {
        selectItem(defaultValueByIndex);
      }
    }
  }, [defaultValueByIndex]);
  // default value added or changed


  const dataArr = useMemo(() => {
    if (disabledInternalSearch) {
      return data;
    }
    return searchTxt ? deepSearchInArr(searchTxt, data) : data;
  }, [data, searchTxt,disabledInternalSearch]);

  const selectItem = index => {
    setSelectedItem(data[index]);
    setSelectedIndex(index);
  };

  const reset = () => {
    setSelectedItem(null);
    setSelectedIndex(-1);
  };

  return {
    dataArr,
    selectedItem,
    selectedIndex,
    selectItem,
    reset,
    searchTxt,
    setSearchTxt,
  };
};
