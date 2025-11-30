import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import AntDesign from 'react-native-vector-icons/AntDesign';
import StudentsCard from "../component/studentsCard";
import AppHeader from "../utils/AppBar";
import { useNavigation } from "@react-navigation/core";



type data = {
    id: number;
    name: string;
    gender: string;
    phone: string;
    status: string;
}
const dummyStudents: data[] = [
    {
        id: 1,
        name: "Aarav Sharma",
        gender: "Male",
        phone: "919876543210",
        status: "Active",
    },
    {
        id: 2,
        name: "Diya Patel",
        gender: "Female",
        phone: "919812345678",
        status: "Inactive",
    },
    {
        id: 3,
        name: "Kavin Raj",
        gender: "Male",
        phone: "919900112233",
        status: "Active",
    },
    {
        id: 4,
        name: "Sahana Reddy",
        gender: "Female",
        phone: "919955667788",
        status: "Active",
    },
    {
        id: 5,
        name: "Vikram Kumar",
        gender: "Male",
        phone: "919944556677",
        status: "Inactive",
    },
];

const Student = () => {
    const [selected, setSelected] = useState("All Student");
    const navigation = useNavigation<any>()

    const totalCount = dummyStudents.length;
    const maleCount = dummyStudents.filter(s => s.gender === "Male").length;
    const femaleCount = dummyStudents.filter(s => s.gender === "Female").length;

    const buttons = [
        { label: "All Student", count: totalCount },
        { label: "Female", count: femaleCount },
        { label: "Male", count: maleCount },
    ]; const themeColor = "#007BFF";

    return (
        <View className="flex-1 bg-white ">
            <AppHeader title="Students" showSearch={true} rightIcon="add-outline" onRightPress={() => navigation.navigate("CreateStudent", { headerTitle: "New Student" })}
            />

            <View className="flex flex-row  px-2 border border-[#E5E6EA] py-2">
                {buttons.map((btn) => {
                    const isSelected = selected === btn.label;

                    return (
                        <TouchableOpacity
                            key={btn.label}
                            onPress={() => setSelected(btn.label)}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 4,
                                paddingVertical: 8,
                                paddingHorizontal: 20,
                                borderBottomWidth: isSelected ? 2 : 0,
                                borderColor: isSelected ? themeColor : "transparent",
                            }}
                        >
                            <Text
                                style={{
                                    color: isSelected ? themeColor : "#111827",
                                    fontWeight: "500",
                                }}
                            >
                                {btn.label}
                            </Text>

                            {/* COUNT BADGE */}
                            <View
                                style={{
                                    backgroundColor: isSelected ? themeColor : "#E5E6EA",
                                    paddingHorizontal: 8,
                                    paddingVertical: 2,
                                    borderRadius: 999,
                                }}
                            >
                                <Text
                                    style={{
                                        color: isSelected ? "white" : "#111827",
                                        fontSize: 12,
                                    }}
                                >
                                    {btn.count}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>



            {/* <Text className="mt-4 text-[#000000] font-bold font-Jost font-600 mb-4 px-3 text-[16px]">Showing 5 Students</Text> */}

            <ScrollView showsVerticalScrollIndicator={false} className="px-3 mt-4">
                {dummyStudents.map((item) => (
                    <StudentsCard
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        gender={item.gender}
                        phone={item.phone}
                        status={item.status}
                    />
                ))}
            </ScrollView>


        </View>
    );
};

export default Student;
