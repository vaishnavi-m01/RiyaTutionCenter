import { Image, Pressable, Text, TouchableOpacity, View } from "react-native"
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from "@react-navigation/core";



type data = {
    id: number;
    name: string;
    gender: string;
    phone: string;
    status: string;
}


const StudentsCard = ({ id, name, gender, phone, status }: data) => {
    const navigation = useNavigation<any>();
    return (
        <View className="w-full">
            <Pressable
                android_ripple={{ color: 'transparent' }}
                onPress={() => navigation.navigate("StudentDetails")}

            >
                <View className="border border-[#E5E6EA] rounded-2xl p-4 mb-4 bg-white shadow-sm">

                    <View className="flex-row justify-between items-start">

                        {/* Avatar + Gender */}
                        <View className="items-center ">
                            <Image
                                source={require("../assets/image/Person.png")}
                                style={{ width: 58, height: 58 }}
                                className="rounded-full"
                            />
                            <Text className="pt-2 text-[#6B7280] text-[13px] font-medium font-Jost">
                                {gender}
                            </Text>
                        </View>

                        {/* Name + Phone + Class */}
                        <View className="flex-1 px-3">
                            <Text className="font-Jost font-semibold text-[16px] text-[#111827]">
                                {name}
                            </Text>

                            <Text className="mt-1 font-Jost text-[13px] text-[#374151]">
                                +{phone}
                            </Text>

                            <Text className="mt-1 font-Jost text-[13px] text-[#4B5563]">
                                12th Standard
                            </Text>
                        </View>

                        {/* Edit/Delete + Status */}
                        <View className="items-end justify-between">

                            {/* Icons */}
                            <View className="flex-row gap-3 mb-3">
                                <AntDesign name="delete" color="#EF4444" size={22} />
                                <Feather name="edit" color="#3B82F6" size={22} />
                            </View>

                            {/* Status Badge */}
                            <View className="flex-row items-center self-start bg-green-50 border border-green-300 px-3 py-1.5 rounded-full mt-6">

                                {/* Status Dot */}
                                <View className="w-2 h-2 rounded-full bg-green-600 mr-2" />

                                {/* Status Text */}
                                <Text className="text-[12px] font-semibold text-green-700">
                                    {status}
                                </Text>

                            </View>


                        </View>

                    </View>

                </View>
            </Pressable>
        </View>

    )
}

export default StudentsCard