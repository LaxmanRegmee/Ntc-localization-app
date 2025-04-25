import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import HomeScreen from '../screens/HomeScreen';
import RechargeScreen from '../screens/RechargeScreen';
import DataPackScreen from '../screens/DataPackScreen';
import BalanceTransferScreen from '../screens/BalanceTransferScreen';
import ComplainScreen from '../screens/ComplainScreen';
import FriendsFamilyScreen from '../screens/FriendsFamilyScreen';
import VASScreen from '../screens/VASScreen';
import UtilitiesScreen from '../screens/UtilitiesScreen';
import Enable4GScreen from '../screens/Enable4GScreen';
import CustomerCareScreen from '../screens/CustomerCareScreen';
import SettingsScreen from '../screens/SettingsScreen';


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name="Home" component={HomeScreen} />

                <Stack.Screen name="Recharge" component={RechargeScreen} />
                <Stack.Screen name="DataPack" component={DataPackScreen} />
                <Stack.Screen name="BalanceTransfer" component={BalanceTransferScreen} />
                <Stack.Screen name="Complain" component={ComplainScreen} />
                <Stack.Screen name="FriendsFamily" component={FriendsFamilyScreen} />
                <Stack.Screen name="VAS" component={VASScreen} />
                <Stack.Screen name="Utilities" component={UtilitiesScreen} />
                <Stack.Screen name="Enable4G" component={Enable4GScreen} />
                <Stack.Screen name="CustomerCare" component={CustomerCareScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}