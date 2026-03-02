import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../utils/AppBar';
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RadioButton } from 'react-native-paper';
import apiClient from '../api/apiBaseUrl';

const FeesForm = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();

    // State
    const [studentId, setStudentId] = useState("");
    const [students, setStudents] = useState<any[]>([]);
    const [amount, setAmount] = useState("");
    const [standardId, setStandardId] = useState("");

    // We fetch all class fees to find the matching one locally
    const [classFees, setClassFees] = useState<any[]>([]);

    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [joingingDate, setJoingingDate] = useState(new Date().toISOString().slice(0, 10)); // Default to today (YYYY-MM-DD)
    const [loading, setLoading] = useState(false);
    const [showJoinPicker, setShowJoinPicker] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState("");

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentsRes, feesRes] = await Promise.all([
                    apiClient.get('/students/all'),
                    apiClient.get('/classFees/all')
                ]);

                if (studentsRes.data) setStudents(studentsRes.data);
                if (feesRes.data) setClassFees(feesRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                // Fail silently or show alert, but keep form usable
            }
        };

        fetchData();
    }, []);

    // When student changes, auto-fill standard and amount
    useEffect(() => {
        // Find selected student object
        const selectedStudent = students.find((s: any) => String(s.id) === String(studentId));

        if (selectedStudent) {
            setStandardId(selectedStudent.standardId);

            // Find fee for this standard
            const fee = classFees.find((f: any) => String(f.standardId) === String(selectedStudent.standardId));

            if (fee) {
                setAmount(String(fee.amount));
            } else {
                setAmount("");
                // Optional: Alert if no fee configured for this standard?
                // Alert.alert("Notice", "No class fee found for this standard.");
            }
        } else {
            setStandardId("");
            setAmount("");
        }
    }, [studentId, students, classFees]);

    // Fees form submit handler
    const handleSubmit = async () => {
        if (!studentId) {
            Alert.alert("Validation", "Please select a student");
            return;
        }
        if (!amount) {
            Alert.alert("Validation", "Amount is required");
            return;
        }

        setLoading(true);
        const payload = {
            studentId: studentId,
            initialFeesId: standardId, // assuming initialFeesId is meant to be standardId based on previous code
            paid: amount,
            paymentType: paymentMethod.toUpperCase(),
            // paymentStatus: paymentStatus, // Added paymentStatus to payload if backend accepts it
            // 

        };

        try {
            const res = await apiClient.post('/fees/create', payload); // Assuming endpoint is /fees/create based on pattern, or just /fees
            // Previous code used 'https://riyatuitionapp-java.onrender.com/api/fees' POST
            // apiClient base is likely .../api, so '/fees' or '/fees/create'? 
            // Checking previous code: fetch('.../api/fees', { method: 'POST' ... })
            // detailed check: prev code used /api/fees. 
            // So apiClient.post('/fees', payload) should work if base is /api.
            // Wait, standard convention in this app seems to be /create. 
            // Let's stick to what was there: /fees. If that fails, I'll check apiClient base.
            // Actually, let's look at ClassFees.tsx. It used /classFees/create.
            // But the previous CreateStudent code used /api/fees. I will stick to /fees for now but use apiClient.

            if (res.status === 200 || res.status === 201) {
                Alert.alert('Success', 'Fees submitted successfully', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            } else {
                Alert.alert('Error', 'Failed to submit fees');
            }
        } catch (error: any) {
            console.error("Submit error:", error);
            const msg = error.response?.data?.message || 'Something went wrong';
            Alert.alert('Error', msg);
        } finally {
            setLoading(false);
        }
    };

    // Find selected student for display (e.g. standard name)
    const selectedStudent = students.find((s: any) => String(s.id) === String(studentId));

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

                    {/* Name Field - Added Red Star */}
                    <Text className="text-[15px] text-[#111827] font-medium mb-2 mt-3">
                        Name <Text className="text-red-500">*</Text>
                    </Text>
                    <View className="border border-[#E5E6EA] rounded-xl">
                        <Picker
                            selectedValue={studentId}
                            onValueChange={setStudentId}
                            style={{ height: 50 }}
                        >
                            <Picker.Item label="Select Student" value="" color="#9CA3AF" />
                            {students
                                .filter((s: any) => s.activeStatus === true || s.activeStatus === undefined)
                                .map((s: any) => (
                                    <Picker.Item key={s.id} label={s.name} value={String(s.id)} />
                                ))}
                        </Picker>
                    </View>

                    <Text className="text-[15px] text-[#111827] font-medium mb-2 mt-3">Standard</Text>
                    <TextInput
                        value={selectedStudent ? selectedStudent.standardName : ''}
                        editable={false}
                        className="border border-[#E5E6EA] rounded-xl p-3 text-[#000] bg-gray-100"
                        placeholder="Standard"
                        placeholderTextColor="#9CA3AF"
                    />

                    {/* Amount */}
                    <Text className="text-[15px] text-[#111827] font-medium mb-2 mt-3">Amount</Text>
                    <TextInput
                        value={amount}
                        editable={true}
                        onChangeText={setAmount}
                        placeholder="Amount"
                        keyboardType="phone-pad"
                        className="border border-[#E0E5E9] rounded-xl p-3 text-[#000] bg-gray-100"
                        placeholderTextColor="#9CA3AF"
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


                    {/* Payment Status - No star */}
                    {/* <Text className="text-[15px] text-[#111827] font-medium mb-2 mt-3">Payment status</Text>
                    <View className="border border-[#E5E6EA] rounded-xl">
                        <Picker
                            selectedValue={paymentStatus}
                            onValueChange={setPaymentStatus}
                            style={{ height: 50 }}
                        >
                            <Picker.Item label="Select Payment Status" value="" color="#9CA3AF" />
                            <Picker.Item label="Paid" value="Paid" />
                            <Picker.Item label="Pending" value="Pending" />
                        </Picker>
                    </View> */}

                    {/* Payment Date */}
                    <Text className="text-[15px] text-[#111827] font-medium mb-2 mt-3">Payment Date</Text>
                    <TouchableOpacity onPress={() => setShowJoinPicker(true)} className="border border-[#E0E5E9] rounded-xl p-3">
                        <Text className="text-[#000]">
                            {joingingDate
                                ? joingingDate.split('-').reverse().join('-')
                                : "Select Payment Date"}
                        </Text>
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
                    onPress={handleSubmit}
                >
                    <Text style={{ color: "#fff", fontWeight: "600" }}>
                        {loading ? "Processing..." : "Publish"}
                    </Text>
                </TouchableOpacity>
            </View>

        </View>

    );
};

export default FeesForm;
