import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"
import AppHeader from "../utils/AppBar"
import { useNavigation } from "@react-navigation/core";
import { Picker } from "@react-native-picker/picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";

const AddClassFees = () => {
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();



    const [amount, setAmount] = useState('');





    const [standard, setStandard] = useState("");

    const [loading, setLoading] = useState(false);



    const standards = [
        "LKG",
        "UKG",
        ...Array.from({ length: 12 }, (_, i) => {
            const num = i + 1;
            const suffix =
                num === 1 ? "st" :
                    num === 2 ? "nd" :
                        num === 3 ? "rd" : "th";
            return `${num}${suffix}`;
        }),
    ];
    return (
        <View className="flex-1 bg-white">
            <AppHeader
                title="Add Class Fees"
                rightIcon="edit"
                onRightPress={() => navigation.navigate("FeesForm", { headerTitle: "Add Class Fees" })}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView
                    className="px-6 pt-6"
                    contentContainerStyle={{ paddingBottom: 150 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="bg-blue-50/50 p-6 rounded-3xl mb-8 border border-blue-100/50">
                        <Text className="text-blue-600 font-bold text-lg mb-1">Set Class Pricing</Text>
                        <Text className="text-gray-500 leading-5">Define the monthly tuition fees for a specific standard.</Text>
                    </View>

                    <View className="mb-6">
                        <Text className="text-[14px] font-bold text-gray-500 mb-3 ml-1 uppercase tracking-widest">Select Standard</Text>
                        <View className="border-2 border-gray-50 rounded-2xl bg-gray-50 overflow-hidden">
                            <Picker
                                selectedValue={standard}
                                onValueChange={setStandard}
                                style={{ height: 60 }}
                                dropdownIconColor="#3B82F6"
                            >
                                <Picker.Item label="Choose from list..." value="" color="#A0AEC0" />
                                {standards.map((item) => (
                                    <Picker.Item key={item} label={`${item} Standard`} value={item} color="#1A202C" />
                                ))}
                            </Picker>
                        </View>
                    </View>

                    <View className="mb-8">
                        <Text className="text-[14px] font-bold text-gray-500 mb-3 ml-1 uppercase tracking-widest">Monthly Amount</Text>
                        <View className="flex-row items-center border-2 border-gray-50 rounded-2xl px-5 bg-gray-50">
                            <Text className="text-[18px] font-bold text-blue-600 mr-2">₹</Text>
                            <TextInput
                                value={amount}
                                onChangeText={setAmount}
                                placeholder="e.g. 500"
                                placeholderTextColor="#A0AEC0"
                                keyboardType="numeric"
                                className="flex-1 py-4 text-[18px] text-gray-900 font-bold"
                            />
                        </View>
                    </View>

                    {/* Bottom Action Bar */}
                    <View
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: "#fff",
                            paddingVertical: 24,
                            paddingHorizontal: 24,
                            borderTopWidth: 1,
                            borderColor: "#F7FAFC",
                            flexDirection: "row",
                            gap: 16,
                            zIndex: 100,
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: "#F7FAFC",
                                paddingVertical: 18,
                                borderRadius: 20,
                                alignItems: "center",
                                borderWidth: 1,
                                borderColor: "#EDF2F7"
                            }}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={{ color: "#718096", fontWeight: "800", fontSize: 16 }}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            disabled={loading}
                            style={{
                                flex: 1.5,
                                backgroundColor: loading ? "#CBD5E0" : "#2563EB",
                                paddingVertical: 18,
                                borderRadius: 20,
                                alignItems: "center",
                                elevation: 8,
                                shadowColor: "#2563EB",
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.2,
                                shadowRadius: 8,
                            }}
                        >
                            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>
                                {loading ? "Saving..." : "Save Pricing"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}

export default AddClassFees