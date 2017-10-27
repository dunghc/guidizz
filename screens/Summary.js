/**
 * Importation des modules nécessaires depuis React Native
 */
import React from 'react'
import { ScrollView, TouchableHighlight, ActivityIndicator, View, Text, StyleSheet, Image, Button } from 'react-native'

/**
 * Importation des modules persos depuis nos différents dossiers
 */
import {colors, fontSize} from '../config/styles'
import {SETTINGS} from '../config/settings'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default class Summary extends React.Component {

   
    constructor(props) {
        super(props)
        // On initialise le state (qui servira à stocker les données récupérées afin de les afficher dans le render)
        this.state = {
            isLoading : true,
            data : {
                name: '',
                subTitle: '',
                description: '',
                websiteUrl: '',
                locationLat: 0,
                locationLong: 0,
                openingTime: '',
                imageBackgroundUrl:''
            }
        }
    }

    // On récupère les données passées en paramètres dans la navigation
    componentWillReceiveProps(nextProps) {
        this.props.navigation.setOptions({
            townUrl: nextProps.navigation.state.params.townUrl
        })
    }

    componentDidMount() {

        /**
         * URL D'importation des données depuis l'API
         */
        const REQUEST_URL = `${this.props.navigation.state.params.townUrl}${SETTINGS.APIURL}${SETTINGS.VERSION}/settings`


        // On récupère les données depuis l'API WP grâce à la méthode fetch
        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((responseData) => {
            // On met à jour le state avec les données reçues
            this.setState({
                isLoading : false,
                data : {
                    name : responseData[0].name,
                    subTitle : responseData[0].subtitle,
                    description: responseData[0].description,
                    websiteUrl: responseData[0].websiteurl,
                    locationLat: responseData[0].locationlat,
                    locationLong: responseData[0].locationlong,
                    openingTime: responseData[0].openingtime,
                    imageBackgroundUrl: responseData[0].imageBackgroundUrl
                }
            })
        })
        .done(() => {
        })

    }

    render() {
        
        const { navigate } = this.props.navigation
        if(this.state.isLoading) {
        return (
            <View style={{flex: 1, paddingTop: 50}}>
              <ActivityIndicator />
            </View>
        )} else {
        return (
            <View style={{flex: 1}}>
        
                <ScrollView>

                    <Header subtitle={this.state.data.subTitle} home={true} />

                   

                    <View style={styles.flexDiv}>
                        <View style={styles.summaryBoutonsNavigation}>
                            <TouchableHighlight onPress= {() => navigate('GuidedTour', { townUrl: this.props.navigation.state.params.townUrl, townName: this.state.data.name, townLat: Number(this.state.data.locationLat), townLong: Number(this.state.data.locationLong) })}>
                                <View style={{flex: 0, flexDirection: 'column', justifyContent: 'center'}}>
                                    <View style={{width: '100%', height: 50, marginBottom: 5}}>
                                        <Image source={require('../images/route.png')}
                                            style={{flex: 1, width: undefined, height: undefined}}
                                            resizeMode='contain' />
                                    </View>
                                    <Text style={styles.buttonText}>Visites guidées</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.summaryBoutonsNavigation}>
                            <TouchableHighlight onPress= {() => navigate('GoodDeal', { townUrl: this.props.navigation.state.params.townUrl, townName: this.state.data.name, townLat: Number(this.state.data.locationLat), townLong: Number(this.state.data.locationLong) })}>
                                <View style={{flex: 0, flexDirection: 'column', justifyContent: 'center'}}>
                                    <View style={{width: '100%', height: 50, marginBottom: 5}}>
                                        <Image source={require('../images/tag.png')}
                                            style={{flex: 1, width: undefined, height: undefined}}
                                            resizeMode='contain' />
                                    </View>
                                    <Text style={styles.buttonText}>Bons plans</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.summaryBoutonsNavigation}>
                            <TouchableHighlight onPress= {() => navigate('Informations', { townUrl: this.props.navigation.state.params.townUrl, townName: this.state.data.name, townLat: Number(this.state.data.locationLat), townLong: Number(this.state.data.locationLong) })}>
                                <View style={{flex: 0, flexDirection: 'column', justifyContent: 'center'}}>
                                    <View style={{width: '100%', height: 50, marginBottom: 5}}>
                                        <Image source={require('../images/infos.png')}
                                            style={{flex: 1, width: undefined, height: undefined}}
                                            resizeMode='contain' />
                                    </View>
                                    <Text style={styles.buttonText}>Informations utiles</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.summaryBoutonsNavigation}>
                            <TouchableHighlight onPress= {() => navigate('Diary', { townUrl: this.props.navigation.state.params.townUrl, townName: this.state.data.name, townLat: Number(this.state.data.locationLat), townLong: Number(this.state.data.locationLong) })}>
                                <View style={{flex: 0, flexDirection: 'column', justifyContent: 'center'}}>
                                    <View style={{width: '100%', height: 50, marginBottom: 5}}>
                                        <Image source={require('../images/calendar.png')}
                                            style={{flex: 1, width: undefined, height: undefined}}
                                            resizeMode='contain' />
                                    </View>
                                    <Text style={styles.buttonText}>Agenda</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.summaryBoutonsNavigation}>
                            <TouchableHighlight onPress= {() => navigate('Parking', { townUrl: this.props.navigation.state.params.townUrl, townName: this.state.data.name, townLat: Number(this.state.data.locationLat), townLong: Number(this.state.data.locationLong) })}>
                                <View style={{flex: 0, flexDirection: 'column', justifyContent: 'center'}}>
                                    <View style={{width: '100%', height: 50, marginBottom: 5}}>
                                        <Image source={require('../images/parking.png')}
                                            style={{flex: 1, width: undefined, height: undefined}}
                                            resizeMode='contain' />
                                    </View>
                                    <Text style={styles.buttonText}>Trouver un parking</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.summaryBoutonsNavigation}>
                            <TouchableHighlight onPress= {() => navigate('NeverLost', { townUrl: this.props.navigation.state.params.townUrl, townName: this.state.data.name, townLat: Number(this.state.data.locationLat), townLong: Number(this.state.data.locationLong) })}>
                                <View style={{flex: 0, flexDirection: 'column', justifyContent: 'center'}}>
                                    <View style={{width: '100%', height: 50, marginBottom: 5}}>
                                        <Image source={require('../images/perdsplus.png')}
                                            style={{flex: 1, width: undefined, height: undefined}}
                                            resizeMode='contain' />
                                    </View>
                                    <Text style={styles.buttonText}>Je ne me perds plus !</Text>
                                </View>
                            </TouchableHighlight>
                        </View>

                    </View>

                    <View style={styles.descriptionDiv}>

                        <Text style={styles.descriptionTitre}>{this.state.data.name} - description :</Text>
                        <Text style={styles.descriptionTexte}>{this.state.data.description}</Text>
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
    descriptionDiv: {
        margin: '0.5%'
    },
    descriptionTitre: {
        fontSize: 22
    },
    descriptionTexte: {
        fontSize: 18
    },
    flexDiv: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    summaryBoutonsNavigation : {
        width: '49%',
        justifyContent: 'space-around',
        backgroundColor: colors.violet,
        height: 100,
        margin: '0.5%',
    },
    summaryDescription : {
        marginBottom: 10,
        marginTop: 10,
        padding: 2
    },
    buttonText : {
        color: colors.blanc,
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 16
    },
})