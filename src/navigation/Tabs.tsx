import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import Foundation from "react-native-vector-icons/Foundation";
import AntDesign from "react-native-vector-icons/AntDesign";

import Dashboard from "../tabs/Dashboard";
import Student from "../tabs/Student";
import Attendance from "../tabs/Attendance";
import Fees from "../tabs/Fees";
import Reports from "../tabs/Reports";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,

                tabBarActiveTintColor: "#007BFF",
                tabBarInactiveTintColor: "gray",

                tabBarStyle: {
                    height: 65 + insets.bottom,
                    paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
                },

                tabBarIcon: ({ color, focused }) => {
                    let IconComponent: any;
                    let iconName;

                    switch (route.name) {
                        case "Dashboard":
                            IconComponent = MaterialIcons;
                            iconName = "dashboard";
                            break;
                        case "Student":
                            IconComponent = SimpleLineIcons;
                            iconName = "graduation";
                            break;
                        case "Attendance":
                            IconComponent = Foundation;
                            iconName = "clipboard-notes";
                            break;
                        case "Fees":
                            IconComponent = AntDesign;
                            iconName = "wallet";
                            break;
                        case "Reports":
                            IconComponent = AntDesign;
                            iconName = "barschart";
                            break;
                    }

                    return (
                        <View style={{ alignItems: "center" }}>
                            {/* 🔵 TOP LINE — Placeholder always (fix icon movement) */}
                            <View
                                style={{
                                    height: 3,
                                    width: 50,
                                    borderRadius: 3,
                                    marginBottom: 6,
                                    backgroundColor: focused ? "#007BFF" : "transparent",
                                }}
                            />

                            <IconComponent name={iconName} size={22} color={color} />
                        </View>
                    );
                },

                tabBarLabel: ({ focused, color }) => (
                    <Text
                        style={{
                            fontSize: 11,
                            color,
                            fontWeight: focused ? "700" : "500",
                            marginTop: 2,
                        }}
                    >
                        {route.name}
                    </Text>
                ),
            })}
        >
            <Tab.Screen name="Dashboard" component={Dashboard} />
            <Tab.Screen name="Student" component={Student} />
            <Tab.Screen name="Attendance" component={Attendance} />
            <Tab.Screen name="Fees" component={Fees} />
            <Tab.Screen name="Reports" component={Reports} />
        </Tab.Navigator>
    );
};

export default TabNavigator;
