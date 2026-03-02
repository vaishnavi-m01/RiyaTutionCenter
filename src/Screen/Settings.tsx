import React from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import AppHeader from "../utils/AppBar"
import { useNavigation } from "@react-navigation/core";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";

const Settings = () => {
    const navigation = useNavigation<any>();

    return (
        <View className="flex-1 bg-white">
            {/* <AppHeader title="Settings" /> */}

            <View className="bg-white rounded-xl p-4 mb-4 shadow mx-4 mt-4">

                {/* Section Header */}
                <View className="flex-row items-center mb-3">
                    <Text className="text-[16px] font-semibold">⚙️</Text>
                    <Text className="text-[16px] font-semibold ml-3">Tuition Settings</Text>
                </View>

                {/* Class Fees */}
                <Pressable className="flex-row items-center py-3 border-b border-gray-200">
                    <View className="w-10 h-10 rounded-xl bg-sky-50 items-center justify-center mr-3">
                        <Text>📚</Text>
                    </View>
                    <TouchableOpacity className="flex-1" onPress={() => navigation.navigate("ClassFees")}>
                        <Text className="text-[15px] font-semibold text-gray-800">Class Fees</Text>
                        <Text className="text-[12px] text-gray-500 mt-1">Set fees for each class</Text>
                    </TouchableOpacity>
                    <Text className="text-[18px] text-gray-400 ml-2">›</Text>
                </Pressable>

                {/* Medium Settings */}
                <Pressable className="flex-row items-center py-3 border-b border-gray-200">
                    <View className="w-10 h-10 rounded-xl bg-purple-50 items-center justify-center mr-3">
                        <Text>🌐</Text>
                    </View>
                    <TouchableOpacity className="flex-1" onPress={() => navigation.navigate("Medium")}>
                        <Text className="text-[15px] font-semibold text-gray-800">Medium</Text>
                        <Text className="text-[12px] text-gray-500 mt-1">Manage language mediums</Text>
                    </TouchableOpacity>
                    <Text className="text-[18px] text-gray-400 ml-2">›</Text>
                </Pressable>

                {/* Birthday Template */}
                <Pressable className="flex-row items-center py-3 border-b border-gray-200">
                    <View className="w-10 h-10 rounded-xl bg-pink-50 items-center justify-center mr-3">
                        <Text>🎂</Text>
                    </View>
                    <TouchableOpacity className="flex-1" onPress={() => navigation.navigate("BirthdayTemplateSettings")}>
                        <Text className="text-[15px] font-semibold text-gray-800">Birthday Template</Text>
                        <Text className="text-[12px] text-gray-500 mt-1">Customize WhatsApp wishes</Text>
                    </TouchableOpacity>
                    <Text className="text-[18px] text-gray-400 ml-2">›</Text>
                </Pressable>

                {/* Earning & Reports */}
                <Pressable className="flex-row items-center py-3 border-b border-gray-200">
                    <View className="w-10 h-10 rounded-xl bg-sky-50 items-center justify-center mr-3">
                        <Text>📊</Text>
                    </View>
                    <TouchableOpacity className="flex-1" onPress={() => navigation.navigate("Tabs", { screen: "Reports" })}>
                        <Text className="text-[15px] font-semibold text-gray-800">Earning & Reports</Text>
                        <Text className="text-[12px] text-gray-500 mt-1">Insights & performance</Text>
                    </TouchableOpacity>
                    <Text className="text-[18px] text-gray-400 ml-2">›</Text>
                </Pressable>


                {/* Logout */}
                <TouchableOpacity
                    className="flex-row items-center py-4 mt-6 bg-red-50 rounded-xl px-4"
                    onPress={async () => {
                        await AsyncStorage.clear();
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'SignIn' }],
                        });
                    }}
                >
                    <Ionicons name="log-out-outline" size={22} color="#EF4444" />
                    <Text className="text-[15px] font-bold text-red-600 ml-3">Logout</Text>
                </TouchableOpacity>

            </View>


        </View>
    )
}

export default Settings
