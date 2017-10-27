import React from 'react'
import { View, Image } from 'react-native'
import Lightbox from 'react-native-lightbox'

const PanoramicImage = ({panoramicImageUrl}) => (
    /*  @params [panoramicImageUrl]
    *   panoramicImageUrl : url de l'image stockée en BDD
    */
    <View>
        <Lightbox>
            <Image
                style={{ width: '100%', height: 300 }}
                source={{ uri: panoramicImageUrl }}
            />
        </Lightbox>
    </View>
   
);
   
export default PanoramicImage