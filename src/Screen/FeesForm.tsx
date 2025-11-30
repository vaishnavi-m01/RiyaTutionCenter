import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform, Image, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../utils/AppBar';
import { Picker } from "@react-native-picker/picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CameraOptions, ImageLibraryOptions, launchCamera, launchImageLibrary, MediaType } from 'react-native-image-picker';
import { RadioButton } from 'react-native-paper';


const CreateStudent = () => {
    const insets = useSafeAreaInsets();

    const navigation = useNavigation<any>();
    const [name, setName] = useState('');

    const [amount, setAmount] = useState('');

    const [medium, setMedium] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("cash");

   
    const [status, setStatus] = useState('Active');
    const [joingingDate, setJoingingDate] = useState("");
    const [standard, setStandard] = useState("");
    
    const [loading, setLoading] = useState(false); 
    const [showJoinPicker, setShowJoinPicker] = useState(false);


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
        <View className='flex-1 bg-white'>
            <AppHeader title='Fees Form' />

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


                    <Text className="text-[15px] text-[#111827] font-medium mb-2 mt-3">Name</Text>
                    <View className="border border-[#E5E6EA] rounded-xl">
                        <Picker selectedValue={medium} onValueChange={setMedium} style={{ height: 50 }}>
                            <Picker.Item label="Select Student" value="" />
                            <Picker.Item label="Vaishnavi" value="Vaishnavi" />
                            <Picker.Item label="Sabi" value="Sabi" />
                        </Picker>
                    </View>

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

                    <Text className="text-[15px] text-[#111827] font-medium mb-2 mt-3">Payment Method</Text>

                    <View className="border border-[#E0E5E9] rounded-xl p-3 text-[#000] ">
                        <RadioButton.Group
                            onValueChange={value => setPaymentMethod(value)}
                            value={paymentMethod}
                        >
                            <View className="flex-row items-center mb-2 ">
                                <RadioButton
                                    value="cash"
                                    color="#007BFF"
                                    uncheckedColor="#9CA3AF"
                                />
                                <Text className="text-[#111827] text-[14px] font-Jost font-regular pr-4">Cash</Text>
                                <RadioButton
                                    value="online"
                                    color="#007BFF"
                                    uncheckedColor="#9CA3AF"
                                />
                                <Text className="text-[#111827] text-[14px] font-Jost font-regular ml-2">UPI</Text>
                            </View>


                        </RadioButton.Group>
                    </View>


                    {/* payment status */}

                    <Text className="text-[15px] text-[#111827] font-medium mb-2 mt-3">Payment status</Text>
                    <View className="border border-[#E5E6EA] rounded-xl">
                        <Picker selectedValue={medium} onValueChange={setMedium} style={{ height: 50 }}>
                            <Picker.Item label="Select Medium" value="" />
                            <Picker.Item label="Paid" value="Paid" />
                            <Picker.Item label="Pending" value="Pending" />
                        </Picker>
                    </View>

                    {/* Joining Date */}
                    <Text className="text-[15px] text-[#111827] font-medium mb-2 mt-3">Payment Date</Text>
                    <TouchableOpacity onPress={() => setShowJoinPicker(true)} className="border border-[#E0E5E9] rounded-xl p-3">
                        <Text className="text-[#000]">{joingingDate || "Select Joining Date"}</Text>
                    </TouchableOpacity>

                    {showJoinPicker && (
                        <DateTimePicker
                            value={joingingDate ? new Date(joingingDate) : new Date()}
                            mode="date"
                            display="calendar"
                            onChange={(e, date) => {
                                setShowJoinPicker(false);
                                if (date) setJoingingDate(date.toISOString().slice(0, 10));
                            }}
                        />
                    )}



                </ScrollView>

            </KeyboardAvoidingView>


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




        </View>

    );
};

export default CreateStudent;
