/**
 * Importation des modules nécessaires depuis React Native
 */
import React from 'react'
import { Image, ScrollView, TouchableHighlight, ListView, ActivityIndicator, Button, View, Text, StyleSheet } from 'react-native'
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'
import Geolib from 'geolib'
import {getDistance} from 'geolib'
/**
 * Importation des modules persos depuis nos différents dossiers
 */
import {colors, fontSize} from '../config/styles'
import {SETTINGS} from '../config/settings'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default class PointsOfInterest extends React.Component {

    static navigationOptions = {
        title : "Points d'intérêt"
    }


    constructor(props) {
        super(props)
        // On initialise le state
        this.state = {
            myPosition: 0,
            isLoading: true,
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            markers : [],
            listOfOrderNumber: [],
            circuitID: 0,
            circuitName : '',
            myPositionLat: 0,
            myPositionLong: 0
        }
    }



    // On récupère les données passées en paramètres dans la navigation
    componentWillReceiveProps(nextProps) {
        this.props.navigation.setOptions({
            circuitID: nextProps.navigation.state.params.circuitID,
            circuitName : nextProps.navigation.state.params.circuitName,
            myPositionLong: nextProps.navigation.state.params.myPositionLong,
            myPositionLat: nextProps.navigation.state.params.myPositionLat
        })
    }

    componentDidMount() {        
        
        
        // On récupère la position du visiteur
        this.watchID = navigator.geolocation.watchPosition((position) => {
            this.setState({ 
                myPositionLat : Number(position.coords.latitude).toFixed(6), 
                myPositionLong : Number(position.coords.longitude).toFixed(6)
            })
        })

        // URL de récupération des données depuis l'API
        const REQUEST_URL = `${SETTINGS.SITEURL}${SETTINGS.APIURL}${SETTINGS.VERSION}/circuit/${this.props.navigation.state.params.circuitID}/latitude/${Number(this.props.navigation.state.params.myPositionLat)}/longitude/${Number(this.props.navigation.state.params.myPositionLong)}`

        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((responseJson) => {

            // On récupère la liste des numéro d'ordre qu'on ajoute dans un tableau afin de les envoyer vers l'écran de détails via le state
            let tabAllOrderNumber = []
            for(var i = 0; i < responseJson.length; i++) {
                tabAllOrderNumber.push(responseJson[i].ordernumber)
            }

            // Ici on construit un array avec la lat/lng des différents points afin de créer un Polyline sur la map
            let coordinates = responseJson.map(point => (
                {
                    id: point.ID,
                    coordinates : {
                        latitude: Number(point.locationlat),
                        longitude: Number(point.locationlong)
                    },
                    name: point.name
                    
                }
            ))

            // On met à jour le state avec les données reçues
            this.setState({
            myPosition: null,
            isLoading: false,
            dataSource: this.state.dataSource.cloneWithRows(responseJson),
            listOfOrderNumber: tabAllOrderNumber,
            markers: coordinates,
            circuitName : this.props.navigation.state.params.circuitName,
            circuitID: this.props.navigation.state.params.circuitID  
            }, function() {

            })
        })
        .catch((error) => {
            console.error(error);
        })
        .done(() => {
        }) 
    }
    
    // Calcul des distances et affichage dans le render
    calculerDistance(pointLat, pointLong) {

        distance = Geolib.getDistance(
            {latitude: Number(this.state.myPositionLat), longitude: Number(this.state.myPositionLong)},
            {latitude: pointLat, longitude: pointLong}, 
            1, 
            1
        ) / 1000

        if(distance >= 1) {
            return 'à ' + distance.toFixed(1) + ' km'    
        } else {
            // todo : modifier afin que cela prenne en compte des distances différentes de 0.X
            return 'à ' + distance.toFixed(3).replace('0.', '') + ' mètres'
        }
    }

    render() {
        // On récupère la navigation afin de pouvoir dispatcher sur les boutons ci-dessous
        const { navigate } = this.props.navigation
        // Si la page est en cours de chargement, on affiche le loader
        if(this.state.isLoading) {
            return (
                <View style={{flex: 1, paddingTop: 50}}>
                    <ActivityIndicator />
                </View>
            )
        } else {
            return (
                <View style={{flex: 1}}>
                    <ScrollView>
                        <View>
                            <Header subtitle={this.state.circuitName}/>

                            <View>
                                <ListView
                                    dataSource={this.state.dataSource}
                                    renderRow={(rowData) =>
                                        
                                        <TouchableHighlight onPress={ () => navigate('PointOfInterest', {orderNumber: rowData.ordernumber, allOrderNumber: this.state.listOfOrderNumber, myPositionLat: this.state.myPositionLat, myPositionLong: this.state.myPositionLong, circuitID: this.state.circuitID})}>
                                                <View style={styles.button}>
                                                    <Text style={styles.buttonText}> {` ${this.calculerDistance(Number(rowData.locationlat).toFixed(6), Number(rowData.locationlong).toFixed(6) )} | ${rowData.name}`}                             
                                                    </Text>
                                                    <Text style={{textAlign: 'right'}}>
                                                        {rowData.withpanoramicview == 1 && <Image style={{width: 25, height: 25, marginRight: 5}} source={require('../images/panoramic.png')} /> }
                                                    </Text>
                                                </View>
                                        </TouchableHighlight>
                                    }
                                />
                            </View>
                            <View style={{height: 400}}>
                                <MapView
                                    provider={PROVIDER_GOOGLE}
                                    style={styles.map}
                                    region={{
                                        latitude: 43.788631,
                                        longitude: 4.096214,
                                        latitudeDelta: 0.0200,
                                        longitudeDelta: 0.0200,
                                    }}
                                    showsUserLocation= {true}
                                >
                                {this.state.markers.map(marker =>(
                                <MapView.Marker
                                    key={marker.id}
                                    coordinate= {marker.coordinates}
                                    description= {marker.name}
                                />
                                ))}
                                </MapView>
                            </View>
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
      height: 400,
      width: '100%'
    },
    button : {
        width: '99%',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: '.5%',
        backgroundColor: colors.violet,
        padding: 10,
        paddingTop: 20,
        paddingBottom: 20
    },
    buttonText : {
        color: colors.blanc,
        fontSize: 16,
        textAlign: 'left'
    },
    title : {
        color: colors.blanc,
        fontSize : fontSize.title,
        padding: 5,
        textAlign: 'center'
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