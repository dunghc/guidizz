/**
 * Fichier contenant certains éléments de style récurrents pour l'application
 */

import React from 'react'
import { PixelRatio, Dimensions } from 'react-native'

let subTitleFont = 0
let titleFont = 0

const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
} = Dimensions.get('window');


if(SCREEN_WIDTH < 250) {
    titleFont = 16
    subTitleFont = 12
} else if (SCREEN_WIDTH < 400) {
    titleFont = 20
    subTitleFont = 14
} else if (SCREEN_WIDTH > 400) {
    titleFont = 30
    subTitleFont = 20
}

export const colors = {
    violet : '#a3268c',
    noir : '#131313',
    blanc : '#fff'
}

export const fontSize = {
    title :  titleFont,  
    subTitle : subTitleFont
}