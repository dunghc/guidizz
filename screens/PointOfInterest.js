/**
 * Importation des modules nécessaires depuis React Native
 */
import React from 'react'
import { Alert, Image, TouchableHighlight, ScrollView, ActivityIndicator, Button, View, Text, StyleSheet } from 'react-native'
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'
import Lightbox from 'react-native-lightbox'
/**
 * Importation des modules persos depuis nos différents dossiers
 */
import {colors, fontSize} from '../config/styles'
import {SETTINGS} from '../config/settings'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Map from '../components/Map'

export default class PointOfInterest extends React.Component {


    constructor(props) {
        super(props)
        // On initialise le state
        this.state = {
            isLoading: true,
            data: {
                id: 0,
                name: '',
                orderNumber: 0,
                locationLat: 0,
                locationLong: 0,
                imageUrl: '',
                isPanoramic: false,
                panoramicImageUrl: '',
                description: '',
                videoUrl: '',
            },
            nextPoint: 0,
            prevPoint: 0,
            myPositionLat: 0,
            myPositionLong: 0,
            circuitID: 0,
            townName: '',
            townLat: 0,
            townLong: 0
        }

        this.handleClick = this.handleClick.bind(this);
    }

    // On récupère les données passées en paramètres dans la navigation
    componentWillReceiveProps(nextProps) {
        this.props.navigation.setOptions({
            orderNumber: nextProps.navigation.state.params.orderNumber,
            allOrderNumber : nextProps.navigation.state.params.allOrderNumber,
            myPositionLat: nextProps.navigation.state.paramas.myPositionLat,
            myPositionLong: nextProps.navigation.state.params.myPositionLong,
            circuitID: nextProps.navigation.state.params.circuitID,
            townName: nextProps.navigation.state.params.townName,
            townLat: nextProps.navigation.state.params.townLat,
            townLong: nextProps.navigation.state.params.townLong
        })
    }

    componentDidMount() {
        // URL de requête de l'API
        const REQUEST_URL = `${SETTINGS.SITEURL}${SETTINGS.APIURL}${SETTINGS.VERSION}/pointofinterest/${this.props.navigation.state.params.orderNumber}`

        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((responseData) => {
            // On met à jour le state avec les données reçues
            // afin de les envoyer vers la vue
            this.setState({
                isLoading: false,
                data: {
                    id: responseData[0].ID,
                    name: responseData[0].name,
                    orderNumber: responseData[0].ordernumber,
                    locationLat: responseData[0].locationlat,
                    locationLong: responseData[0].locationlong,
                    imageUrl: responseData[0].imageurl,
                    isPanoramic: responseData[0].withpanoramicview,
                    panoramicImageUrl: responseData[0].panoramicimageurl,
                    description: responseData[0].description,
                    videoUrl: responseData[0].videourl,
                    circuitID: responseData[0].idcircuit

                },
                myPositionLat: this.props.navigation.state.params.myPositionLat,
                myPositionLong: this.props.navigation.state.params.myPositionLong,
                circuitID: this.props.navigation.state.params.circuitID,
                townName: this.props.navigation.state.params.townName,
                townLat: this.props.navigation.state.params.townLat,
                townLong: this.props.navigation.state.params.townLong,
            })
        }, function() {
            
        })
        .catch((error) => {
            console.error(error);
        })
        .done(() => {
            // On détermine quel sont les prochains/précédents points à visiter
            this.getNextPrev()
        })
    }

    // On détermine quel sont les prochains/précédents points à visiter
    getNextPrev() {

        // on récupère le numéro d'ordre courant et la liste de tous les numéros d'ordre récupérés depuis la navigation
        let currentOrderNumber = this.props.navigation.state.params.orderNumber
        let allOrderNumber = this.props.navigation.state.params.allOrderNumber

        // on initialise les variables devant recevoir les prochains index de points
    

        // on détermine à quel index du tableau se situe notre numéro d'ordre courant
        function findIndexCurrentOrderNumber(element) {
            return element === currentOrderNumber
        }

        let indexOfMyCurrentOrderNumber = allOrderNumber.findIndex(findIndexCurrentOrderNumber)

        // on va ici déterminer quel est le prochain point à visiter en respectant les numéros d'ordre
        if(indexOfMyCurrentOrderNumber != allOrderNumber.length - 1) {
            // si ce n'est pas le dernier index du tableau on affiche le prochain index
            nextPoint = allOrderNumber[indexOfMyCurrentOrderNumber + 1]
        } else {
            // sinon, si nous sommes actuellement sur le dernier index du tableau,
            // nous affichons le premier point afin de faire une boucle
            nextPoint = allOrderNumber[0]
        }

        // on va ici déterminer quel est le précédent point à visiter en respectant les numéros d'ordre
        if(indexOfMyCurrentOrderNumber != 0) {
            // si ce n'est pas le premier index du tableau on affiche le précédent index
            prevPoint = allOrderNumber[indexOfMyCurrentOrderNumber - 1]
        } else {
            // sinon, si nous sommes actuellement sur le dernier index du tableau,
            // nous affichons le premier point afin de faire une boucle
            prevPoint = allOrderNumber[allOrderNumber.length - 1]
        }

        // on met à jour le state, afin de recevoir ces données dans le render
        this.setState({
            nextPoint : nextPoint,
            prevPoint : prevPoint
        })


    }

    handleClick(panoramicUrl) {

        console.log(panoramicUrl)
        
    }


    render() {
        // On récupère le module de navigation
        const { navigate } = this.props.navigation
        // Si la page est en cours de chargement, on affiche le loader
        if(this.state.isLoading) {
            return (
                <View style={{flex: 1, paddingTop: 50}}>
                    <ActivityIndicator />
                </View>
            )
        } else {
            return (// #TODO Vérifier les paramètres à envoyer vers la page du prochain/précédent point d'intérêt
                <View style={{flex: 1}}>
                    <ScrollView>

                        <Header subtitle={this.state.data.name} />

                        <View><Text style={styles.titrePage}>{this.state.data.name}</Text></View>
                        
                        <View style={{width: '100%', height: 200, marginTop: 10, marginBottom: 10}}><Image style={{width: undefined, height: undefined, flex: 1, resizeMode: 'cover'}} source={{uri:this.state.data.imageUrl}} /></View>
                        
                        <View style={styles.longText}><Text>{this.state.data.description}</Text></View>

                        {/* Si le point d'intérêt dispose d'une image panoramic, nous affichons un bouton afin de proposer à l'utilisateur de la voir */}
                        <View>{this.state.data.isPanoramic == 1 && <Button title='Voir la photo panoramique' onPress={this.handleClick(this.state.data.panoramicImageUrl)}/>}</View>
                        
                        <View style={styles.buttonContainer}>
                            <View style={styles.button}>
                                <TouchableHighlight onPress={() => navigate('PointOfInterest', {town: this.state.town, circuitID : this.state.data.circuitID, id: this.state.prevPoint, allOrderNumber : this.props.navigation.state.params.allOrderNumber,  orderNumber: this.state.prevPoint} )}>
                                    <View>
                                        <Text style={styles.buttonText}>Précédent</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                            <View style={styles.buttonSimple}>
                                <TouchableHighlight onPress= {() => Alert.alert(
                                        'Confirmation',
                                        'Revenir à la liste des points d\'intérêts ?',
                                        [
                                            {text: 'Non', onPress: () => console.log('Non'), style: 'cancel'},
                                            {text: 'Oui', onPress: () => navigate('PointsOfInterest', {town : this.state.town, myPositionLat: this.state.myPositionLat, myPositionLong: this.state.myPositionLong, circuitID: this.state.circuitID})},
                                        ],
                                        { cancelable: false }
                                    )}
                                >
                                    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
                                        <View style={{width: '100%', height: 25, marginBottom: 5}}>
                                            <Image source={require('../images/route.png')}
                                                style={{flex: 1, width: undefined, height: undefined}}
                                                resizeMode='contain' />
                                        </View>
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
                                <TouchableHighlight onPress={() => navigate('PointOfInterest', {town: this.state.town, circuitID : this.state.data.circuitID, id: this.state.nextPoint, allOrderNumber : this.props.navigation.state.params.allOrderNumber, orderNumber: this.state.nextPoint} )}>
                                    <View>
                                        <Text style={styles.buttonText}>Suivant</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        </View>

                        <Map 
                            positionLat={this.state.townLat} 
                            positionLong={this.state.townLong}
                            markerCoordinates={{latitude:Number(this.state.data.locationLat), longitude:Number(this.state.data.locationLong)}}
                            markerName={this.state.data.name}
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
        height: 400,
        width: '100%'
    },
    titrePage: {
        fontSize: 22,
        textAlign: 'center',
        color: colors.noir,
        marginTop: 25,
        marginBottom: 25
    },
    buttonContainer : {
        flex: 1,
        flexDirection: 'row'
    },
    button : {
        backgroundColor: colors.violet,
        justifyContent: 'center',
        width: '38%',
        height: 50,
        padding: 5,
        margin: '1%',
    },
    buttonSimple: {
        width: '8%',
        height: 50,
        backgroundColor: colors.violet,
        justifyContent: 'center',
        padding: 5,
        margin: '1%'
    },
    buttonText : {
        color: colors.blanc,
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 16
    },
    buttonPetitText : {
        color: colors.blanc,
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 12
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
    },
    longText : {
        padding: 5
    }
})