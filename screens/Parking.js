/**
 * Importation des modules nécessaires depuis React Native
 */
import React from 'react'
import { Image, ScrollView, ActivityIndicator, View, Text, StyleSheet } from 'react-native'
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'
/**
 * Importation des modules persos depuis nos différents dossiers
 */
import {colors, fontSize} from '../config/styles'
import {SETTINGS} from '../config/settings'
import Header from '../components/Header'
import Footer from '../components/Footer'

// URL d'importation des données depuis l'API WP
const REQUEST_URL = `${SETTINGS.SITEURL}${SETTINGS.APIURL}${SETTINGS.VERSION}/parking`

export default class Parking extends React.Component {

    constructor(props) {
        super(props)
        // On initialise le state
        this.state = {
            isLoading : true,
            town : '',
            markers: null
        }
    }

    // On récupère les données passées en paramètres dans la navigation
    componentWillReceiveProps(nextProps) {
        this.props.navigation.setOptions({
            town: nextProps.navigation.state.params.town
        })
    }

    componentDidMount() {
        // URL de récupération des données depuis l'API
        const REQUEST_URL = `${SETTINGS.SITEURL}${SETTINGS.APIURL}${SETTINGS.VERSION}/parking`

        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((responseJson) => {

            // Ici on construit un array avec la lat/lng des différents points afin de créer un Polyline sur la map
            let coordinates = responseJson.map(point => (
                {
                    id: point.ID,
                    coordinates : {
                        latitude: Number(point.locationlat),
                        longitude: Number(point.locationlong)
                    },
                    isFree: point.free,
                    horaires: point.openinghours,
                    prix: point.prices,
                    description: point.description
                    
                }
            ))

            // On met à jour le state avec les données reçues
            this.setState({
                isLoading : false,
                town: this.props.navigation.state.params.town,
                markers: coordinates
            })
        })
        .done(() => {
        })

    }

    render() {

        // Si la page est en cours de chargement, on affiche le loader
        if(this.state.isLoading) {
        return (
            <View style={{flex: 1, paddingTop: 50}}>
                <ActivityIndicator />
            </View>
        )} else {
        return (
            <View style={{flex: 1}}>
                <ScrollView>
                    
                    <Header subtitle='Liste des parkings'/>

                    <View style={{padding: 25}}>

                        <Text style={styles.title}>Liste des parkings à {this.state.town}</Text>

                        <Text><Image source={require('../images/pin.png')}
                               style={{flex: 1, width: 25, height: 25, tintColor: '#2894F2' }}
                               resizeMode='contain' /> Parking <Text style={{fontWeight: '700'}}>gratuit</Text>
                        </Text>
                        <Text><Image source={require('../images/pin.png')}
                               style={{flex: 1, width: 25, height: 25, tintColor: '#FA2B1A' }}
                               resizeMode='contain' /> Parking <Text style={{fontWeight: '700'}}>payant</Text>
                        </Text>
                    </View>
                    
                    <View>
                        <MapView
                            provider={PROVIDER_GOOGLE}
                            style={styles.map}
                            region={{
                                latitude: 43.788631,
                                longitude: 4.096214,
                                latitudeDelta: 0.0400,
                                longitudeDelta: 0.0200,
                            }}
                            showsUserLocation= {true}
                            toolbarEnabled={true}
                        >
                        {this.state.markers.map(marker =>(
                        <MapView.Marker
                            key={marker.id}
                            coordinate= {marker.coordinates}
                            pinColor={marker.isFree == 1 && '#2894F2' || marker.isFree == 0 && '#FA2B1A'}
                            description={`${marker.description} | Prix : ${marker.isFree == 0 && marker.prix || marker.isFree == 1 && 'Parking gratuit'} | Horaires : ${marker.horaires}`}
                        />
                        ))}
                        </MapView>
                    </View>

                    

                </ScrollView>
                <Footer />
            </View>
        )
        }
    }
}

/**
 * Style de l'écran
 */

const styles = StyleSheet.create({
    map : {
      ...StyleSheet.absoluteFillObject,
      height: 400
    },
    title : {
        color: colors.noir,
        fontSize : fontSize.subTitle,
        padding: 5,
    },
    subTitle: {
        color: colors.blanc,
        textAlign: 'center',
        fontSize: fontSize.subTitle
    },
    header : {
        backgroundColor: colors.violet,
        padding: 5
    }
})