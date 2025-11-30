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
            <AppHeader title="Add Class Fees" rightIcon="edit" onRightPress={() => navigation.navigate("FeesForm", { headerTitle: "Add Class Fees" })}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView
                    className="px-4 pt-4"
                    contentContainerStyle={{ paddingBottom: 120 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >




                    <Text className="text-[15px] text-[#111827] font-medium mb-2 mt-3">Standard</Text>
                    <View className="border border-[#E5E6EA] rounded-xl px-2">
                        <Picker
                            selectedValue={standard}
                            onValueChange={setStandard}
                            style={{ height: 50 }}
                        >
                            <Picker.Item label="Select Standard" value="" />
                            {standards.map((item) => (
                                <Picker.Item key={item} label={item} value={item} />
                            ))}
                        </Picker>
                    </View>



                    {/* Phone */}
                    <Text className="text-[15px] text-[#111827] font-medium mb-2 mt-3">Amount</Text>
                    <TextInput
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="Phone number"
                        keyboardType="phone-pad"
                        className="border border-[#E0E5E9] rounded-xl p-3 text-[#000]"
                    />








                    <View
                        style={{
                            position: "absolute",
                            bottom: insets.bottom || 10,
                            left: 0,
                            right: 0,
                            backgroundColor: "#fff",
                            paddingVertical: 10,
                            paddingHorizontal: 20,
                            borderTopWidth: 1,
                            borderColor: "#ddd",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            zIndex: 100,
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                marginRight: 8,
                                backgroundColor: "#ccc",
                                paddingVertical: 12,
                                borderRadius: 10,
                                alignItems: "center",
                            }}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={{ color: "#333", fontWeight: "600" }}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            disabled={loading}
                            style={{
                                flex: 1,
                                marginLeft: 8,
                                backgroundColor: loading ? "#9CA3AF" : "#007BFF",
                                paddingVertical: 12,
                                borderRadius: 10,
                                alignItems: "center",
                                opacity: loading ? 0.8 : 1,
                            }}
                        >
                            <Text style={{ color: "#fff", fontWeight: "600" }}>
                                {loading ? "Processing..." : "Publish"}
                            </Text>
                        </TouchableOpacity>
                    </View>



                </ScrollView>

            </KeyboardAvoidingView>


        </View>
    )
}

export default AddClassFees