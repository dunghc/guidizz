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

    componentDidMount() {
        this.setState({
            isLoading: false
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
                            <View style={styles.button}>
                                <TouchableHighlight onPress={() => this.handleClick('register')}>
                                    <View>
                                        <Text style={styles.buttonText}>J'enregistre ma position</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        :
                            <View>
                                <View style={styles.flexDiv}> 
                                    <View style={styles.button}>
                                        <TouchableHighlight onPress={() => Alert.alert(
                                                    'Confirmation',
                                                    'Effacer la position enregistrée ?',
                                                    [
                                                        {text: 'Non', onPress: () => console.log('Non'), style: 'cancel'},
                                                        {text: 'Oui', onPress: () => this.handleClick('delete')},
                                                    ],
                                                    { cancelable: false }
                                                )}>
                                            <View>
                                                <Text style={styles.buttonText}>J'efface ma position</Text>
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                    <View style={styles.buttonSimple}>
                                        <TouchableHighlight onPress= {() => Alert.alert(
                                                    'Confirmation',
                                                    'Revenir au menu principal ?',
                                                    [
                                                        {text: 'Non', onPress: () => console.log('Non'), style: 'cancel'},
                                                        {text: 'Oui', onPress: () => navigate('Summary', {town : this.state.town})},
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
                                        <TouchableHighlight onPress={() => this.handleClick('update')}>
                                            <View>
                                                <Text style={styles.buttonText}>Je mets à jour ma position</Text>
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                </View>

                                <View style={{height: 400}}>
                                    <MapView                            
                                        provider={PROVIDER_GOOGLE}
                                        style={styles.map}
                                        region={{
                                            latitude: Number(this.state.myPositionLat),
                                            longitude: Number(this.state.myPositionLong),
                                            latitudeDelta: 0.0400,
                                            longitudeDelta: 0.0200,
                                        }}
                                        showsUserLocation= {true}
                                    >
                                    <MapView.Marker
                                        coordinate={{latitude:Number(this.state.myPositionLat), longitude:Number(this.state.myPositionLong)}}
                                    />
                                    </MapView>
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
        height: 50,
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
        width: '8%',
        height: 50,
        backgroundColor: colors.violet,
        justifyContent: 'center',
        padding: 5,
        margin: '1%'
    },
})