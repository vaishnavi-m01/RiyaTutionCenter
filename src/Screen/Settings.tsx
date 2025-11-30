import { Pressable, Text, TouchableOpacity, View } from "react-native"
import AppHeader from "../utils/AppBar"
import { useNavigation } from "@react-navigation/core";

const Settings = () => {
    const navigation = useNavigation<any>();

    return (
        <View className="flex-1 bg-white">
           
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

                {/* Earning & Reports */}
                <Pressable className="flex-row items-center py-3 border-b border-gray-200">
                    <View className="w-10 h-10 rounded-xl bg-sky-50 items-center justify-center mr-3">
                        <Text>📊</Text>
                    </View>
                    <TouchableOpacity className="flex-1" onPress={() => navigation.navigate("Reports")}>
                        <Text className="text-[15px] font-semibold text-gray-800">Earning & Reports</Text>
                        <Text className="text-[12px] text-gray-500 mt-1">Insights & performance</Text>
                    </TouchableOpacity>
                    <Text className="text-[18px] text-gray-400 ml-2">›</Text>
                </Pressable>

            </View>


        </View>
    )
}

export default Settings