/**
 * Importation des modules nécessaires depuis React Native
 */
import React from 'react'
import { Image, ScrollView, ActivityIndicator, View, Text, StyleSheet } from 'react-native'
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'
/**
 * Importation des modules persos depuis nos différents dossiers
 */
import {colors, fontSize} from '../config/styles'
import {SETTINGS} from '../config/settings'
import Header from '../components/Header'
import Footer from '../components/Footer'

// URL d'importation des données depuis l'API WP
const REQUEST_URL = `${SETTINGS.SITEURL}${SETTINGS.APIURL}${SETTINGS.VERSION}/settings`

export default class Informations extends React.Component {

    static navigationOptions = ({navigation}) => {
        const { params = {} } = navigation.state
        return  { title : params.title }
    }


    constructor(props) {
        super(props)
        // On initialise le state
        this.state = {
            isLoading : true,
            data : {
                name : '',
                subTitle: '',
                imageUrl : '',
                locationLat : 1,
                locationLong : 1,
                description : '',
                type : '',
                address : '',
                phone : '',
                email : ''
            }
        }
    }

    componentDidMount() {
        
        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((responseData) => {
            // On met à jour le state avec les données reçues
            this.setState({
                isLoading : false,
                data : {
                    name : responseData[0].name,
                    subTitle : responseData[0].subtitle,
                    imageUrl : responseData[0].logourl,
                    locationLat : Number(responseData[0].locationlat),
                    locationLong : Number(responseData[0].locationlong),
                    description : responseData[0].description,
                    type: responseData[0].organization,
                    address: responseData[0].address,
                    phone: responseData[0].phone,
                    email: responseData[0].email
                }
            })
        })
        .done(() => {
            // On donne ici comme titre de l'écran le nom de la ville en question
            this.props.navigation.setParams({title: this.state.data.name})
        })

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

                    <Header subtitle={this.state.data.subTitle} />

                    <View>
                        <Text style={styles.title}> {this.state.data.name} </Text>
                        <Text style={{padding: 5, textAlign: 'center'}}>
                            {this.state.data.description}
                        </Text>
                    </View>

                    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center'}}>
                        <Text style={{padding: 5, justifyContent: 'center', fontSize: 18}}>
                            {this.state.data.type} de {this.state.data.name}
                        </Text>
                        <View style={{padding: 10, justifyContent: 'center'}}>
                            <Text><Text style={{fontWeight : '500'}} >Adresse :</Text> {this.state.data.address}</Text>
                            <Text><Text style={{fontWeight : '500'}} >Téléphone :</Text> {this.state.data.phone}</Text>
                            <Text><Text style={{fontWeight : '500'}} >Email :</Text> {this.state.data.email}</Text>
                        </View>
                    </View>

                    <View style={{height:400}}>
                        <MapView
                        provider={PROVIDER_GOOGLE} 
                        style={styles.map}
                        region={{
                            latitude: this.state.data.locationLat,
                            longitude: this.state.data.locationLong,
                            latitudeDelta: 0.0400,
                            longitudeDelta: 0.0200,
                        }}
                        showsUserLocation= {true}
                        >
                        <MapView.Marker
                        coordinate={{latitude: this.state.data.locationLat, longitude: this.state.data.locationLong}}
                        title={this.state.data.name}
                        description={`${this.state.data.type} de ${this.state.data.name} | ${this.state.data.address}`}
                        />
                        </MapView>
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
        fontSize : fontSize.title,
        padding: 5,
        textAlign: 'center'
    },
    subTitle: {
        color: colors.noir,
        textAlign: 'center',
        fontSize: fontSize.subTitle
    },
    header : {
        backgroundColor: colors.violet,
        padding: 5
    }
})

