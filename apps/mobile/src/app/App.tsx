/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import {  View  } from 'react-native';


import SelectDropdown from './components/Dropdown/src/SelectDropdown';

export const App = () => {
  const countries = [
    'us',
    'England',
    'Dubai',
    'France',
    'Germany',
    'Saudi Arabia',
    'Argentina',
    'India',
  ];

  return (
    <View>
      <SelectDropdown
            data={countries}
            onSelect={(selectedItem, index) => {
              console.log(selectedItem, index);
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
            onChangeSearchInputText={(text)=>{
              return text;
            }}
          />
    </View>
  );
};

export default App;
