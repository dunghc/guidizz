/**
 * importation des modules nécessaires
 */
import React from 'react'
import {View, Image} from 'react-native'
import {StackNavigator} from 'react-navigation'

import Home from '../screens/Home'
import Summary from '../screens/Summary'
import Informations from '../screens/Informations'
import Diary from '../screens/Diary'
import GuidedTour from '../screens/GuidedTour'
import GoodDeal from '../screens/GoodDeal'
import Parking from '../screens/Parking'
import PointOfInterest from '../screens/PointOfInterest'
import PointsOfInterest from '../screens/PointsOfInterest'
import NeverLost from '../screens/NeverLost'
import GoodDealDetails from '../screens/GoodDealDetails'

/* écran d'accueil */
export const HomeStack =  StackNavigator({
    Home : {
        screen : Home

    },
    Summary : {
        screen : Summary
    },
    Informations : {
        screen : Informations,
    },
    Diary : {
        screen : Diary,
    },
    GuidedTour : {
        screen : GuidedTour,
    },
    GoodDeal : {
        screen : GoodDeal,
    },
    Parking : {
        screen : Parking,
    },
    PointOfInterest : {
        screen : PointOfInterest,
    },
    PointsOfInterest : {
        screen : PointsOfInterest,
    },
    NeverLost : {
        screen: NeverLost,
    },
    GoodDealDetails: {
        screen: GoodDealDetails
    }
})