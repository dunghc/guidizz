/**
 * Importation des modules nécessaires depuis React Native
 */
import React from 'react'
import { TouchableHighlight, ActivityIndicator, ListView, Image, ScrollView, View, Text, StyleSheet } from 'react-native'

import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'
/**
 * Importation des modules persos depuis nos différents dossiers
 */
import {colors, fontSize} from '../config/styles'
import Header from '../components/Header'
import Footer from '../components/Footer'
import {SETTINGS} from '../config/settings'
import Map from '../components/Map'

/**
 * URL D'importation des données depuis l'API
 */
const REQUEST_URL = `${SETTINGS.SITEURL}${SETTINGS.APIURL}${SETTINGS.VERSION}/gooddeal`


export default class GoodDeal extends React.Component {

    static navigationOptions = {
        title: 'Bons plans',
    }

    constructor(props) {
        super(props)
        // On initalise le state
        this.state = {
            isLoading: true,
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            isClicked: false,
            idGoodDeal: 0,
            locationlat: 0,
            locationlong: 0
        }
        
        //this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {

        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((responseJson) => {
            // On met à jour le state avec les données reçues
            this.setState({
                isLoading: false,
                dataSource: this.state.dataSource.cloneWithRows(responseJson),
            }, function() {
            })
        })
        .catch((error) => {
            console.error(error);
        })
        .done(() => {

        })

    }

    handleClick(id, locationlat, locationlong, description) {

        this.setState({
            isClicked: true,
            idGoodDeal: Number(id), 
            locationlat: Number(locationlat),
            locationlong: Number(locationlong),
            description: description
        })

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

                            <Header subtitle='Les bons plans !' />

                            <View style={{padding: 25}}>
                                <View style={styles.divTexteHaut}>
                                    <View style={{textAlign: 'center'}}>
                                        <Text style={styles.fenetreTitre}>Découvrez les bons plans du moment !</Text>
                                    </View>
                                </View>
                            </View>

                            <ListView
                                dataSource={this.state.dataSource}
                                renderRow={(rowData) =>
                                <View style={styles.divContainer}>
                                    <TouchableHighlight style={styles.divContainer} onPress={() => navigate('GoodDealDetails', {id: rowData.ID})}>
                                        <View style={styles.divFlex}>

                                            <View style={styles.divImg}>
                                                <Image style={{width: undefined, height: undefined, flex: 1, resizeMode: 'cover'}} source={{uri:rowData.imageurl}} />
                                            </View>

                                            <View style={styles.divTexte}>
                                                <Image style={{width: undefined, height: undefined, flex: 1, resizeMode: 'cover'}} source={require('../images/tag_big.png')}>
                                                    <View style={styles.divDescription}>
                                                        <Text style={styles.texteDescription}>{rowData.description}</Text>
                                                    </View>

                                                    <View style={styles.divDate}>                                                    
                                                        <Text style={{textAlign: 'right', color: '#fff'}}>
                                                        Valable du {new Date(rowData.begindate).toLocaleDateString()} au {new Date(rowData.enddate).toLocaleDateString()}
                                                        </Text> 
                                                    </View>
                                                </Image>
                                            </View>

                                        </View>
                                    </TouchableHighlight>
                                </View>
                                }
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