/**
 * Importation des modules nécessaires depuis React Native
 */
import React from 'react'
import { ListView, Picker, ActivityIndicator, ScrollView, TouchableHighlight, Image, Button, StyleSheet, View, Text } from 'react-native'
/**
 * Importation des modules persos depuis nos différents dossiers
 */
import Summary from './Summary'
import {colors, fontSize} from '../config/styles'
import {SETTINGS} from '../config/settings'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ListViewSelect from 'react-native-list-view-select';

export default class Home extends React.Component {

    static navigationOptions = {
        title: 'Accueil',
    }

    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            towns: [],
            townUrl: '',
            town: '',
            myPositionLat: 0,
            myPositionLong: 0
        }
    }

    componentDidMount() {

        /**
         * URL API
         */
        const REQUEST_URL = `http://www.indexld.com${SETTINGS.APIURL}${SETTINGS.VERSION}/customer/latitude/43.788308/longitude/4.097317`


        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((responseJson) => {
            
            
            let towns = responseJson.map(city => {

                return <Picker.Item key={city.url} value={city.name} label={city.name} />
               
            })
            console.log(`JSON: ${JSON.stringify(towns)}`)
            // On met à jour le state avec les données reçues
            this.setState({
                isLoading: false,
                towns: towns
            }, function() {
            })
        })
        .catch((error) => {
            console.error(error);
        })
        .done(() => {
            
        })


    }

    componentDidUpdate() {
        SETTINGS.SITEURL = this.state.townUrl
    }

    render() {

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
                        <View style={{width: '100%', height: 200}}>
                            <Image  source={require('../images/logo_guidizz.png')}
                                    style={{flex: 1, width: undefined, height: undefined}}
                                    resizeMode='contain' 
                        />
                        </View>
                        <Text style={styles.titre}>
                            Avec Guidizz, laissez-vous guider...
                        </Text>

                        <View>
                            
                            <Picker
                                selectedValue={this.state.town != '' ? this.state.town : null}
                                onValueChange={(itemValue, itemIndex) => this.setState({town: itemValue, townUrl: this.state.towns[itemIndex].key})}>
                                {this.state.towns}
                            </Picker>
                            {this.state.town == '' || this.state.town == null ?
                            <Text style={styles.titre}>1. Sélectionnez une ville dans la liste</Text>
                            :
                            <Text style={styles.titre}>2. Validez votre choix !</Text>
                            }
                        </View>

                        {this.state.town != '' &&
                        <View style={styles.flexDiv}
                        >
                                <TouchableHighlight onPress={() => navigate('Summary', {townUrl: this.state.townUrl})}>
                                    <View style={styles.button}>
                                        <Text style={styles.buttonText}>Découvrir {this.state.town}</Text>
                                    </View>
                                </TouchableHighlight>

                        </View>
                        }

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
    flexDiv: {
        flex: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    titre: {
        fontSize: 20,
        textAlign: 'center',
    },
    text : {
        color: colors.noir,
        textAlign: 'center'
    },
    button : {
        backgroundColor: colors.violet,
        width: 200,
        height: 100,
        justifyContent: 'center',
        margin: 5
    },
    buttonText : {
        color: colors.blanc,
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 16
    }
})