/**
 * Importation des modules nécessaires depuis React Native
 */
import React from 'react'
import { ActivityIndicator, ListView, Image, ScrollView, View, Text, StyleSheet } from 'react-native'
/**
 * Importation des modules persos depuis nos différents dossiers
 */
import {colors, fontSize} from '../config/styles'
import Header from '../components/Header'
import Footer from '../components/Footer'
import {SETTINGS} from '../config/settings'

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
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        }
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
                                        <Text style={styles.fenetreTitre}>Découvrez les bons plans du moment !</Text>
                                    </View>
                                </View>
                            </View>

                            <ListView
                                dataSource={this.state.dataSource}
                                renderRow={(rowData) =>
                                <View style={styles.divContainer}>
                                    <View style={styles.divFlex}>

                                        <View style={styles.divImg}>
                                            <Image style={{width: undefined, height: undefined, flex: 1, resizeMode: 'cover'}} source={{uri:rowData.imageurl}} />
                                        </View>

                                        <View style={styles.divTexte}>

                                            <View style={styles.divDescription}>
                                                <Text style={styles.texteDescription}>{rowData.description}</Text>
                                            </View>


                                            <View style={styles.divDate}>                                                    
                                                <Text style={{textAlign: 'right', color: '#fff'}}>
                                                Valable du {new Date(rowData.begindate).toLocaleDateString()} au {new Date(rowData.enddate).toLocaleDateString()}
                                                </Text> 
                                            </View>

                                        </View>

                                    </View>
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
        height: 180,
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
        height: 180
    },
    divTexte : {
        flex: 1,
        flexDirection: 'column'
    },
    texteTitre : {
        color: '#fff',
        fontSize: 20,
        marginLeft: 20,
        marginTop: 10
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
        marginTop: 10
    },
    divDate: {
        position: 'absolute',
        bottom: 0,
        margin: 5
    }
})