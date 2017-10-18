/**
 * Importation des modules nécessaires depuis React Native
 */
import React from 'react'
import { TouchableHighlight, Image, Button, StyleSheet, View, Text } from 'react-native'
/**
 * Importation des modules persos depuis nos différents dossiers
 */
import Summary from './Summary'
import {colors, fontSize} from '../config/styles'

export default class Home extends React.Component {

    static navigationOptions = {
        title: 'Accueil',
    }

    constructor(props) {
        super(props)
        this.buttonPress = this.buttonPress.bind(this)
    }

    buttonPress() {
        this.props.navigation.navigate('Summary')
    }

    render() {
        return (
            <View>
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
                    <View style={styles.flexDiv}>
                        <Text style={styles.text}>
                            - Choisissez la ville à découvrir -
                        </Text>
                        <TouchableHighlight onPress={this.buttonPress}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>Villevieille</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={this.buttonPress}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>Localisez-moi !</Text>
                            </View>
                        </TouchableHighlight>
                        
                    </View>
                </View>
            </View>
        )
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
        height: 45,
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