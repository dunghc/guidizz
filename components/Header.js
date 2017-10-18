/**
 * Importation des modules nécessaires depuis React Native
 */
import React from 'react'
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native'
/**
 * Importation des modules persos depuis nos différents dossiers
 */
import {colors, fontSize} from '../config/styles'
import {SETTINGS} from '../config/settings'

/**
 * URL D'importation des données depuis l'API
 */
const REQUEST_URL = `${SETTINGS.SITEURL}${SETTINGS.APIURL}${SETTINGS.VERSION}/settings`

export default class Header extends React.Component {
   
    constructor(props) {
        super(props)
        // On initialise le state (qui servira à stocker les données récupérées afin de les afficher dans le render)
        this.state = {
            logo : ' ',
            title : '',
            subtitle : this.props.subtitle,
            imageBackgroundUrl: 'null',
            isHome : this.props.home,
            image: '../images/'+this.props.image+'.png'
        }

    }

    componentDidMount() {
        // On récupère les données depuis l'API WP grâce à la méthode fetch
        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((responseData) => {
            // On met à jour le state avec les données reçues
            this.setState({
                logo : responseData[0].logourl,
                title : responseData[0].name,
                subtitle : this.state.subtitle,
                imageBackgroundUrl : responseData[0].imageBackgroundUrl,
                isHome: this.props.home,
                image: ''
            })
        })
        .done(() => {

        })

    }

    render() {

        // Si nous nous trouvons sur la page d'accueil, nous affichons un header différent
        if(this.state.isHome) {
            return (
            
                <View style={{width: '100%', height: Dimensions.get('window').height / 4 }}>
                    <Image style={{width: undefined, height: undefined, flex: 1, resizeMode: 'cover'}} source={{uri:this.state.imageBackgroundUrl}}>
                        <View style={styles.container}>
                            <View style={{width: '100%', height: 100}}>
                                <View style={{width: 100, height: 100, marginTop: 10}}>
                                    <Image  source={{uri: this.state.logo }}
                                            style={{width: undefined, height: undefined, flex: 1, resizeMode: 'contain'}} 
                                    />
                                </View>
                                <View style={{justifyContent: 'space-around', position: 'absolute', right: 10, top: 10, backgroundColor: '#fff', padding: 5, borderRadius: 5}}> 
                                    <Text style={styles.title}>{this.state.title}</Text>
                                    <Text style={styles.subtitle}>{this.state.subtitle}</Text>
                                </View>
                            </View>
                        </View>
                    </Image>
                </View>

            )
        } else {
            return (
                
                <View style={{width: '100%', height: Dimensions.get('window').height / 6 }}>
                    <Image style={{width: undefined, height: undefined, flex: 1, resizeMode: 'cover'}} source={{uri:this.state.imageBackgroundUrl}}>
                        <View style={styles.container}>
                            <View style={{width: '100%', height: 100}}>
                                <View style={{width: 100, height: 100, marginTop: 10}}>
                                    <Image  source={{uri: this.state.logo }}
                                            style={{width: undefined, height: undefined, flex: 1, resizeMode: 'contain'}} 
                                    />
                                </View>
                                <View style={{justifyContent: 'space-around', position: 'absolute', right: 10, top: 10, backgroundColor: '#fff', padding: 5, borderRadius: 5}}> 
                                    <Image source={{uri:'../images/'+this.props.image+'.png'}}
                                            style={{flex: 0, width: 30, height: 30, tintColor: '#000'}}
                                            resizeMode='contain' 
                                    />
                                    <Text style={styles.title}>{this.state.title}</Text>
                                    <Text style={styles.subtitle}>{this.state.subtitle}</Text>
                                </View>
                            </View>
                        </View>
                    </Image>
                </View>
    
            )
        }
    
        
    }
    

}

/**
 * Style du composant
 */
const styles = StyleSheet.create({
    container : {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    title : {
        fontWeight: '700',
        letterSpacing: 0.3,
        fontSize: fontSize.title,
        padding: 2,
        //textShadowColor: '#000',
        //textShadowOffset: {width: 1, height: 1},
        color: colors.noir,
        backgroundColor: 'transparent',
        textAlign: 'center'
    },
    subtitle : {
        fontSize: fontSize.subTitle,
        color: colors.noir,
        padding: 2,
        backgroundColor: 'transparent',
        textAlign: 'center',
        //textShadowColor: '#000',
        //textShadowOffset: {width: 1, height: 1},
    }
})