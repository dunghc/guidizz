import React from 'react'
import { View, Image } from 'react-native'

const Footer = () => (

    <View style={{width: '100%', height: 50, marginTop: 10}}>
        <Image  source={require('../images/logo_guidizz.png')}
                style={{flex: 1, width: undefined, height: undefined}}
                resizeMode='contain' />
    </View>
   
);
   
export default Footer;