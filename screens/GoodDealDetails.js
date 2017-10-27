/**
 * Importation des modules nécessaires depuis React Native
 */
import React from 'react'
import { TouchableHighlight, ActivityIndicator, ListView, Image, ScrollView, View, Text, StyleSheet } from 'react-native'
/**
 * Importation des modules persos depuis nos différents dossiers
 */
import {colors, fontSize} from '../config/styles'
import Header from '../components/Header'
import Footer from '../components/Footer'
import {SETTINGS} from '../config/settings'
import Map from '../components/Map'

export default class GoodDealDetails extends React.Component {

    static navigationOptions = {
        title: 'Bon plan',
    }

    constructor(props) {
        super(props)
        // On initalise le state
        this.state = {
            isLoading: true,
            description: '',
            imageurl: '',
            locationlat: 0,
            locationlong: 0,
            begindate: null,
            enddate: null
        }
        
    }

    componentWillReceiveProps(nextProps) {
        this.props.navigation.setOptions({
            id: nextProps.navigation.state.params.id,
            townUrl: nextProps.navigation.state.params.townUrl
        })
    }

    componentDidMount() {

        /**
         * URL D'importation des données depuis l'API
         */
        const REQUEST_URL = `${this.props.navigation.state.params.townUrl}${SETTINGS.APIURL}${SETTINGS.VERSION}/gooddeal/${this.props.navigation.state.params.id}`

        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((responseJson) => {
            // On met à jour le state avec les données reçues
            this.setState({
                isLoading: false,
                description: responseJson[0].description,
                imageurl: responseJson[0].imageurl,
                locationlat: responseJson[0].locationlat,
                locationlong: responseJson[0].locationlong,
                begindate: responseJson[0].begindate,
                enddate: responseJson[0].enddate
            })
        })
        .catch((error) => {
            console.error(error);
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
            )
        } else {
            return (
                <View style={{flex: 1}}>
                    <ScrollView>
                        <View>

                            <Header subtitle='Les bons plans !' />

                            <View style={{padding: 25}}>
                                <View style={styles.divTexteHaut}>
                                    <View style={{textAlign: 'center'}}>
                                        <Text style={styles.fenetreTitre}>Découvrez ce bon plan !</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.divContainer}>
                                    <View style={styles.divFlex}>

                                        <View style={styles.divImg}>
                                            <Image style={{width: undefined, height: undefined, flex: 1, resizeMode: 'cover'}} source={{uri:this.state.imageurl}} />
                                        </View>

                                        <View style={styles.divTexte}>
                                            <Image style={{width: undefined, height: undefined, flex: 1, resizeMode: 'cover'}} source={require('../images/tag_big.png')}>
                                                <View style={styles.divDescription}>
                                                    <Text style={styles.texteDescription}>{this.state.description}</Text>
                                                </View>

                                                <View style={styles.divDate}>                                                    
                                                    <Text style={{textAlign: 'right', color: '#fff'}}>
                                                    Valable du {new Date(this.state.begindate).toLocaleDateString()} au {new Date(this.state.enddate).toLocaleDateString()}
                                                    </Text> 
                                                </View>
                                            </Image>
                                        </View>

                                    </View>
                            </View>

                            <Map 
                                positionLat={this.state.locationlat} 
                                positionLong={this.state.locationlong}
                                markerCoordinates={{latitude:Number(this.state.locationlat), longitude:Number(this.state.locationlong)}}
                                markerName={this.state.description}
                            />
                            
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
    fenetreTitre: {
        fontSize: 22,
        textAlign: 'center'
    },
    level: {
        width: 25,
        height: 25
    },
    divContainer: {
        width: '100%',
        minHeight: 180,
        backgroundColor: colors.violet,
        marginTop: 5,
        marginBottom: 5
    },
    divFlex: {
        flex: 1,
        flexDirection: 'row'
    },
    divImg : {
        width: '30%',
        minHeight: 180
    },
    divTexte : {
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        minHeight: 180
    },
    texteTitre : {
        color: '#fff',
        fontSize: 20,
        marginLeft: 20,
        marginTop: 10,
        backgroundColor: 'transparent'
    },
    divTitre : {
        width: '100%'
    },
    divDescription: {
        width: '100%'
    },
    texteDescription : {
        color: '#fff',
        fontSize: 14,
        marginLeft: 20,
        marginTop: 10,
        marginBottom: 30,
        backgroundColor: 'transparent'
    },
    divDate: {
        position: 'absolute',
        bottom: 0,
        margin: 5
    }
})