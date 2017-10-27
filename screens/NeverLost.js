/**
 * Importation des modules nécessaires depuis React Native
 */
import React from 'react'
import { Alert, TouchableHighlight, Image, ScrollView, ActivityIndicator, View, Text, StyleSheet } from 'react-native'
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'
/**
 * Importation des modules persos depuis nos différents dossiers
 */
import {colors, fontSize} from '../config/styles'
import {SETTINGS} from '../config/settings'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Map from '../components/Map'

// J'initialise une variable state
let state = {
    myPositionLat : 0, 
    myPositionLong : 0,
    isPositionSaved: false
}

export default class NeverLost extends React.Component {

    constructor(props) {
        super(props)
        // On initialise le state en récupérant ce qui était sauvegardé dans le state auparavant
        this.state = state

        this.handleClick = this.handleClick.bind(this);
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
        this.setState({
            isLoading: false,
            townName: this.props.navigation.state.params.townName,
            townLat: this.props.navigation.state.params.townLat,
            townLong: this.props.navigation.state.params.townLong,
        })
    }

    componentWillUnmount() {
        // On garde le state dans une variable afin de le récupérer lorsque l'on fera de nouveau appel à ce screen
        state = this.state
    }

    handleClick(action) {

        if(action == 'register' || action == 'update') {
            // On récupère la position du visiteur
            this.watchID = navigator.geolocation.watchPosition((position) => {
                this.setState({ 
                    myPositionLat : Number(position.coords.latitude).toFixed(6), 
                    myPositionLong : Number(position.coords.longitude).toFixed(6),
                    isPositionSaved: true
                })
            })
        } else {
            this.setState({ 
                myPositionLat : 0, 
                myPositionLong : 0,
                isPositionSaved: false
            })
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
        )} else {
        return (
            <View style={{flex: 1}}>
                <ScrollView>
                    
                    <Header subtitle='Je ne me perds plus !'/>

                    
                    <View>
                        {!this.state.isPositionSaved ?
                        <View>
                            <View style={{padding: 25}}>
                                <View style={styles.divTexteHaut}>
                                    <View style={{textAlign: 'center'}}>
                                        <Text style={styles.fenetreTitre}>Je ne me perds plus !</Text>
                                    </View>
                                    <View style={{textAlign: 'center'}}>
                                        <Text style={styles.fenetreSousTitre}>Enregistrer votre position actuelle afin de pouvoir y revenir facilement à la fin de votre promenade !</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={{flex: 1, alignItems: 'center'}}>
                                <View style={styles.button}>
                                    <TouchableHighlight onPress={() => this.handleClick('register')}>
                                        <View>
                                            <Text style={styles.buttonText}>J'enregistre ma position actuelle</Text>
                                        </View>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </View>
                        :
                            <View>

                                <View style={{padding: 25}}>
                                    <View style={styles.divTexteHaut}>
                                        <View style={{textAlign: 'center'}}>
                                            <Text style={styles.fenetreTitre}>Je modifie ou j'efface la position sauvegardée</Text>
                                        </View>
                                        <View style={{textAlign: 'center'}}>
                                            <Text style={styles.fenetreSousTitre}>Vous pouvez enregistrer et modifier à tout moment votre position afin d'y revenir facilement !</Text>
                                        </View>
                                    </View>
                                </View>                              
                                
                                <Map 
                                    positionLat={this.state.townLat} 
                                    positionLong={this.state.townLong}
                                    markerCoordinates={{latitude:Number(this.state.myPositionLat), longitude:Number(this.state.myPositionLong)}}
                                    markerName='Ma position sauvegardée'
                                />

                                <View style={styles.flexDiv}> 
                                    <View style={styles.button}>
                                        <TouchableHighlight onPress={() => Alert.alert(
                                                    'Confirmation',
                                                    'Souhaitez-vous effacer votre position enregistrée précédemment ?',
                                                    [
                                                        {text: 'Non', onPress: () => console.log('Non'), style: 'cancel'},
                                                        {text: 'Oui', onPress: () => this.handleClick('delete')},
                                                    ],
                                                    { cancelable: false }
                                                )}>
                                            <View>
                                                <Text style={styles.buttonText}>J'efface ma position sauvegardée</Text>
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                    <View style={styles.buttonSimple}>
                                        <TouchableHighlight onPress= {() => Alert.alert(
                                                    'Confirmation',
                                                    'Revenir au menu principal ?',
                                                    [
                                                        {text: 'Non', onPress: () => console.log('Non'), style: 'cancel'},
                                                        {text: 'Oui', onPress: () => navigate('Summary', {townUrl: this.props.navigation.state.params.townUrl, town : this.state.town})},
                                                    ],
                                                    { cancelable: false }
                                                )}
                                            >
                                            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
                                                <View style={{width: '100%', height: 25, marginBottom: 5}}>
                                                    <Image source={require('../images/menu.png')}
                                                        style={{flex: 1, width: undefined, height: undefined}}
                                                        resizeMode='contain' />
                                                </View>
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                    <View style={styles.button}>
                                    <TouchableHighlight onPress={() => Alert.alert(
                                        'Confirmation',
                                        'Souhaitez-vous modifier votre position sauvegardée par votre position actuelle ?',
                                        [
                                            {text: 'Non', onPress: () => console.log('Non'), style: 'cancel'},
                                            {text: 'Oui', onPress: () => this.handleClick('update')},
                                        ],
                                        { cancelable: false }
                                    )}>
                                <View>
                                    <Text style={styles.buttonText}>Je mets à jour ma position sauvegardée</Text>
                                </View>
                            </TouchableHighlight>
                                    </View>
                                </View>

                            </View>
                        }
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
    fenetreTitre: {
        fontSize: 22,
        textAlign: 'center'
    },
    fenetreSousTitre: {
        fontSize: 16,
        textAlign: 'center',
        padding: 5
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
    },
    button : {
        backgroundColor: colors.violet,
        justifyContent: 'center',
        width: '38%',
        height: 100,
        padding: 5,
        margin: '1%',
    },
    buttonText : {
        color: colors.blanc,
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 16
    },
    flexDiv : {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 25,
        marginBottom: 25
    },
    buttonSimple: {
        width: '18%',
        height: 100,
        backgroundColor: colors.violet,
        justifyContent: 'center',
        padding: 5,
        margin: '1%'
    },
})