import { Image, Text, TouchableOpacity, View } from "react-native"
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import { useRef } from "react";
import RBSheet from "react-native-raw-bottom-sheet";


interface RBSheetRef {
    open: () => void;
    close: () => void;
}

const StudentInfo = () => {
    const refRBSheet = useRef<RBSheetRef>(null);

    const openFilterSheet = () => refRBSheet.current?.open();
    return (
        <View className="w-full">
            <TouchableOpacity onPress={openFilterSheet}>
                <View className="border border-[#E5E6EA] rounded-xl p-3 mb-4 bg-white">
                    <View className="flex-row gap-1 justify-between items-start pb-2">

                        <View className="items-center">
                            <Image source={require("../assets/image/Person.png")} style={{ width: 73, height: 73 }}></Image>
                        </View>


                        <View className="flex-1 py-2">
                            <Text className="font-Jost font-medium text-[14px]">Vaishnavi</Text>
                            <Text className="font-Jost text-[#151515] font-medium text-[12px]">+919876543210</Text>


                            <View className="flex-row gap-3 mt-6">

                                {/* Active Filter */}
                                <View className="bg-[#EFF0F4] rounded-full px-4 py-2 flex-row items-center">
                                    <View
                                        style={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: 10,
                                            backgroundColor: "#22C55E",
                                            marginRight: 6,
                                        }}
                                    />
                                    <Text className="text-sm text-gray-800 font-medium">Active</Text>
                                </View>

                                {/* Inactive Filter */}
                                <View className="bg-[#EFF0F4] rounded-full px-4 py-2 flex-row items-center">
                                    <Text className="text-sm text-gray-800 font-medium">Inactive</Text>
                                </View>

                            </View>


                        </View>

                        <View className="items-end pt-2">
                            <View className="flex-row gap-2 mb-2">
                                <Fontisto name="whatsapp" color="#25D366" size={26} />

                                {/* <Entypo name="dots-three-vertical" color="#000" size={20} /> */}


                            </View>
                            <View className="pt-6">

                            </View>
                        </View>

                    </View>
                </View>

            </TouchableOpacity>


            {/* Bottom Sheet */}
            <RBSheet
                ref={refRBSheet}
                height={450}
                openDuration={250}
                draggable
                closeOnPressMask
                customStyles={{
                    wrapper: { backgroundColor: "rgba(0,0,0,0.5)" },
                    container: {
                        backgroundColor: "#fff",
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        // paddingBottom: 20,
                        overflow: "visible"
                    },
                    draggableIcon: { backgroundColor: "#cbd5e1" },
                }}
            >
                {/* Header */}
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingHorizontal: 20,
                        paddingTop: 10,
                        paddingBottom: 12,
                        borderBottomWidth: 1,
                        borderBottomColor: "#e2e8f0"
                    }}
                >
                    <Text className="text-[#111827] font-Jost text-[20px] font-medium">
                        Student Info
                    </Text>
                </View>

                {/* 2 COLUMNS */}
                <View className="flex-row px-4 mt-4 gap-4">

                    {/* LEFT COLUMN */}
                    <View className="w-1/2">
                        <Text className="text-[#111827] font-Jost text-md">School</Text>
                        <Text
                            className="text-[#111827] font-Jost font-medium text-[16px] flex-wrap"
                        >
                            Baren Bruck Higher Secondary School
                        </Text>

                        <Text className="mt-4 text-[#111827] font-Jost text-md">Gender</Text>
                        <Text className="text-[#111827] font-Jost font-medium text-[16px]">
                            Female
                        </Text>

                        <Text className="mt-4 text-[#111827] font-Jost text-md">Age</Text>
                        <Text className="text-[#111827] font-Jost font-medium text-[16px]">
                            16
                        </Text>

                        <Text className="mt-4 text-[#111827] font-Jost text-md">Gender</Text>
                        <Text className="text-[#111827] font-Jost font-medium text-[16px]">
                            Female
                        </Text>


                        <Text className="mt-4 text-[#111827] font-Jost text-md">Phone</Text>
                        <Text className="text-[#111827] font-Jost font-medium text-[16px]">
                            +91 6385542771
                        </Text>
                    </View>

                    {/* RIGHT COLUMN */}
                    <View className="w-1/2">
                        <Text className="text-[#111827] font-Jost text-md">Class</Text>
                        <Text className="text-[#111827] font-Jost font-medium text-[16px]">
                            11th Standard
                        </Text>

                        <Text className="mt-4 text-[#111827] font-Jost text-md">Fees</Text>
                        <Text className="text-[#111827] font-Jost font-medium text-[16px]">
                            ₹3000 / Month
                        </Text>


                        <Text className="mt-4 text-[#111827] font-Jost text-md">Place</Text>
                        <Text className="text-[#111827] font-Jost font-medium text-[16px]">
                            Surandai
                        </Text>



                        <Text className="mt-4 text-[#111827] font-Jost text-md">Address</Text>
                        <Text className="text-[#111827] font-Jost font-medium text-[16px] flex-wrap">
                            5-4-57(1) KamaRaj Nagar
                        </Text>

            
                    </View>
                </View>

            </RBSheet>

        </View>
    )
}


export default StudentInfo