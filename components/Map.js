import React from 'react'
import { View, Image, StyleSheet, Text } from 'react-native'
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'

const Map = ({positionLat, positionLong, markerCoordinates, markerName, multipleMarkers, markers, isParking}) => (

    <View>
        <View style={{height: 400}}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={{
                    latitude: Number(positionLat),
                    longitude: Number(positionLong),
                    latitudeDelta: 0.0200,
                    longitudeDelta: 0.0200,
                }}
                showsUserLocation= {true}
                toolbarEnabled={true}
            >
            {/* 
            *   @params [positionLat, positionLong, markerCoordinates, markerName, multipleMarkers, markers, isParking]
            *   positionLat/positionLong : coordonnées géographiques de la ville
            *   markerCoordinates/markerName : Informations sur le pin (uniquement si pin unique)
            *   multipleMarkers : boolean pour définir si la map affiche plusieurs pins
            *   markers : objets de coordonnées des différents marqueurs
            *   isParking : boolean pour définir si on affiche une liste de parking, car nous avons différentes données à afficher dans ce cas
            */}
            {!multipleMarkers ?
                <MapView.Marker
                    coordinate={markerCoordinates}
                    description={markerName}
                />
            :
                markers.map(marker =>(
                    <MapView.Marker
                        key={marker.id}
                        coordinate={marker.coordinates}
                        description={!isParking ? marker.name : 
                        `${marker.name} 
                        Prix : ${marker.isFree == 0 && marker.prix || marker.isFree == 1 && 'Parking gratuit'} 
                        Horaires : ${marker.horaires}`}
                        pinColor={isParking ? marker.isFree == 1 && '#2894F2' || marker.isFree == 0 && '#FA2B1A' : null}
                    />
                ))

            }
            </MapView>
        </View>
        <View style={{padding: 10}}>
            <Text><Image source={require('../images/icone_position.png')}
                        style={{ flex: 1, width: 25, height: 25 }}
                        resizeMode='contain' /> Cet icône représente votre position actuelle en temps réel
            </Text>
        </View>
    </View>
   
);

const styles = StyleSheet.create({
    map : {
      ...StyleSheet.absoluteFillObject,
      height: 400,
      width: '100%'
    }
})
   
export default Map


