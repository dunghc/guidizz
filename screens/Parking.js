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
import Map from '../components/Map'



export default class Parking extends React.Component {

    constructor(props) {
        super(props)
        // On initialise le state
        this.state = {
            isLoading : true,
            townName : '',
            townLat: 0,
            townLong: 0,
            markers: null
        }
    }

    // On récupère les données passées en paramètres dans la navigation
    componentWillReceiveProps(nextProps) {
        this.props.navigation.setOptions({
            townName: nextProps.navigation.state.params.townName,
            townLat: nextProps.navigation.state.params.townLat,
            townLong: nextProps.navigation.state.params.townLong,
            townUrl: nextProps.navigation.state.params.townUrl
        })
    }

    componentDidMount() {

        // URL de récupération des données depuis l'API
        const REQUEST_URL = `${this.props.navigation.state.params.townUrl}${SETTINGS.APIURL}${SETTINGS.VERSION}/parking`

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
                    name: point.description
                    
                }
            ))

            // On met à jour le state avec les données reçues
            this.setState({
                isLoading : false,
                townName: this.props.navigation.state.params.townName,
                townLat: this.props.navigation.state.params.townLat,
                townLong: this.props.navigation.state.params.townLong,
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

                        <Text style={styles.title}>Liste des parkings à {this.state.townName}</Text>

                        <Text><Image source={require('../images/pin.png')}
                               style={{flex: 1, width: 25, height: 25, tintColor: '#2894F2' }}
                               resizeMode='contain' /> Parking <Text style={{fontWeight: '700'}}>gratuit</Text>
                        </Text>
                        <Text><Image source={require('../images/pin.png')}
                               style={{flex: 1, width: 25, height: 25, tintColor: '#FA2B1A' }}
                               resizeMode='contain' /> Parking <Text style={{fontWeight: '700'}}>payant</Text>
                        </Text>
                    </View>

                    <Map 
                        positionLat={this.state.townLat} 
                        positionLong={this.state.townLong}
                        multipleMarkers={true}
                        markers={this.state.markers}
                        isParking={true}
                    />

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