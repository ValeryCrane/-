import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native"
import MainScreen from "../screens/MainScreen";
import StatsScreen from "../screens/StatsScreen/StatsScreen";
import AskScreen from "../screens/AskScreen";
import AuthScreen from "../screens/AuthScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Stack = createStackNavigator();

export default function Navigate() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Auth" component={AuthScreen} options={{headerShown: false}} />
                <Stack.Screen name="Main" component={MainScreen} options={{headerShown: false}} />
                <Stack.Screen name="Stats" component={StatsScreen} options={{headerShown: false}} />
                <Stack.Screen name="Ask" component={AskScreen} options={{headerShown: false}} />
                <Stack.Screen name="Settings" component={SettingsScreen} options={{headerShown: false}} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}