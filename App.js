/**
 * importation des modules nécessaires
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {HomeStack} from './config/routes'

console.disableYellowBox = true;

export default class App extends React.Component {
  
  render() {
    return (
      <HomeStack />
      
    )
  }
}