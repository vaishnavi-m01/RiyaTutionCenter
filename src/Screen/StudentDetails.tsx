import { Pressable, Text, TextInput, TouchableOpacity, View, ScrollView, Alert, ActivityIndicator, Linking } from "react-native";
import StudentInfo from "../component/StudentInfo";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useCallback, useEffect, useRef, useState } from "react";
import RBSheet from "react-native-raw-bottom-sheet";
import { RadioButton } from 'react-native-paper';
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { Student } from "../type/type";
import { formatDate } from "../utils/dateFormatter";
import apiClient from "../api/apiBaseUrl";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';

interface RBSheetRef {
    open: () => void;
    close: () => void;
}

const StudentDetails = () => {
    const route = useRoute<any>();
    const { student } = route.params as { student: Student };

    const [amount, setAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [loading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [fetchingTransactions, setFetchingTransactions] = useState(false);
    const [birthdayTemplate, setBirthdayTemplate] = useState("Happy Birthday {name}!");

    const navigation = useNavigation<any>();

    const refRBSheet = useRef<RBSheetRef>(null);
    const refRBSheetSettleBalance = useRef<RBSheetRef>(null);

    const openFilterSheet = () => refRBSheet.current?.open();
    const closeSheet = () => refRBSheet.current?.close();

    const openSettleBalance = () => {
        refRBSheet.current?.close();
        setTimeout(() => {
            refRBSheetSettleBalance.current?.open();
        }, 300);
    };

    const fetchTransactions = async () => {
        try {
            setFetchingTransactions(true);
            const response = await apiClient.get(`/fees/recent/${student.id}`);
            if (response.data) {
                setTransactions(response.data);
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setFetchingTransactions(false);
        }
    };

    const fetchBirthdayTemplate = async () => {
        try {
            const res = await apiClient.get('/settings/get/birthday_template');
            if (res.data && res.data.configValue) {
                setBirthdayTemplate(res.data.configValue);
            }
        } catch (error) {
            console.log("No birthday template found, using default");
        }
    };

    useEffect(() => {
        fetchTransactions();
        fetchBirthdayTemplate();
    }, [student.id]);

    useFocusEffect(
        useCallback(() => {
            fetchTransactions();
        }, [student.id])
    );

    const handleSettle = async () => {
        if (!amount || isNaN(Number(amount))) {
            Alert.alert("Error", "Please enter a valid amount");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                studentId: student.id,
                paid: amount,
                paymentType: paymentMethod.toUpperCase()
            };
            const response = await apiClient.post('/fees/settle', payload);
            if (response.status === 200 || response.status === 201) {
                Alert.alert("Success", "Balance settled successfully");
                setAmount("");
                refRBSheetSettleBalance.current?.close();
                fetchTransactions();
            }
        } catch (error: any) {
            console.error("Settle error:", error);
            Alert.alert("Error", error.response?.data?.message || "Failed to settle balance");
        } finally {
            setLoading(false);
        }
    };

    const closeSettleSheet = () => refRBSheetSettleBalance.current?.close();

    const sendBirthdayWish = () => {
        const message = birthdayTemplate.replace("{name}", student.name);
        const url = `whatsapp://send?phone=${student.phone}&text=${encodeURIComponent(message)}`;
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Alert.alert("Error", "WhatsApp is not installed on this device");
            }
        });
    };

    const isBirthdayToday = () => {
        if (!student.dateOfBirth) return false;
        const dob = new Date(student.dateOfBirth);
        const today = new Date();
        return dob.getDate() === today.getDate() && dob.getMonth() === today.getMonth();
    };

    return (
        <View className="flex-1 bg-white px-2 pt-4">
            <StudentInfo student={student} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
                <View className="flex-row gap-4 w-full">
                    {/* Balance Box */}
                    <TouchableOpacity className="flex-1 border border-[#E0E5E9] rounded-lg p-4" onPress={openFilterSheet}>
                        <View className="flex-row gap-2 items-center pl-2 pb-1">
                            <FontAwesome name="rupee" color="#000" size={20} />
                            <Text className="text-[#111827] font-[Jost] font-medium text-[17px]">Balance</Text>
                        </View>
                        <Text className={`font-bold text-[18px] mt-1 ${transactions.length > 0 && transactions[0].status === "Paid" ? "text-green-600" : "text-amber-500"}`}>
                            {transactions.length > 0 ? transactions[0].status : "N/A"}
                        </Text>
                    </TouchableOpacity>

                    {/* Joined Date Box */}
                    <View className="flex-1 border border-[#E0E5E9] rounded-lg p-4">
                        <View className="flex-row items-center pb-1 pl-2">
                            <Text className="text-[#111827] font-[Jost] font-medium text-[17px]">Joined Date</Text>
                        </View>
                        <Text className="text-[#111827] font-bold text-[18px] mt-1">{student.joiningDate || "N/A"}</Text>
                    </View>
                </View>

                <Text className="mt-9 font-[Jost] text-[#111827] font-bold text-[16px]">Class</Text>
                <View className="border border-[#E0E5E9] rounded-2xl p-4 mt-4 bg-white shadow-sm">
                    <Text className="text-base font-semibold text-[#111827] mb-1">📘 {student.standardName || "N/A"} Standard</Text>
                    <Text className="text-sm text-[#4B5563] mb-1">💰 Medium: <Text className="font-medium text-[#111827]">{student.mediumName || "N/A"}</Text></Text>
                    {student.place && <Text className="text-sm text-[#4B5563] mb-1">📍 Place: <Text className="font-medium text-[#111827]">{student.place}</Text></Text>}
                    {student.school && <Text className="text-sm text-[#4B5563]">🏫 School: <Text className="font-medium text-[#111827]">{student.school}</Text></Text>}
                </View>

                <View className="flex-row items-center justify-between mt-12 mb-4">
                    <Text className="text-[#111827] text-[19px] font-[Jost] font-medium">Recent transaction</Text>
                    {isBirthdayToday() && (
                        <TouchableOpacity onPress={sendBirthdayWish} className="bg-pink-100 px-3 py-1.5 rounded-full flex-row items-center gap-1.5 border border-pink-200">
                            <Fontisto name="birthday-cake" color="#E91E63" size={14} />
                            <Text className="text-[#E91E63] font-bold text-[12px]">Wish Birthday</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {fetchingTransactions ? <ActivityIndicator color="#007BFF" /> : transactions.length === 0 ? (
                    <View className="border border-[#E0E5E9] rounded-lg p-6 items-center"><Text className="text-gray-400">No transactions found</Text></View>
                ) : transactions.slice(0, 3).map((tx, idx) => (
                    <View key={idx} className="border border-[#E0E5E9] rounded-lg p-2 mt-2">
                        <View className="flex-row px-2 justify-between">
                            <Text className="font-[Jost] text-[#111827] text-[14px] font-bold">{tx.standardName || "Tuition Fee"}</Text>
                            <View className="flex-row items-end gap-2">
                                <View className="border border-[#E3E4E8] rounded-full px-4 bg-[#E3E4E8]"><Text className="font-[Jost] text-[#090A0E] font-medium">{tx.paymentType}</Text></View>
                                <Text className="text-[#111827] font-[Jost] font-medium">₹{tx.paid}</Text>
                            </View>
                        </View>
                        <View className="mt-4 flex-row justify-between items-center">
                            <Text className="text-[#666A75]">{new Date(tx.createdDate).toLocaleDateString()}</Text>
                            <Text className={`text-[12px] font-medium ${tx.status === "Paid" ? "text-green-600" : "text-amber-500"}`}>{tx.status}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <RBSheet ref={refRBSheet} height={200} openDuration={250} draggable customStyles={{ wrapper: { backgroundColor: "rgba(0,0,0,0.5)" }, container: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 } }}>
                <Text className="text-[#111827] font-medium text-[20px]">Balance</Text>
                <View className="flex-row justify-between mt-4">
                    <Text className="text-[#111827] font-Jost text-[15px] font-medium">Pending Amount</Text>
                    <Text className="text-[#111827] font-Jost text-[18px] font-bold">₹{transactions.length > 0 ? transactions[0].pending : "0"}</Text>
                </View>
                <TouchableOpacity className={`rounded-lg py-4 mt-8 ${transactions.length > 0 && transactions[0].pending > 0 ? "bg-[#007BFF]" : "bg-gray-300"}`} disabled={!(transactions.length > 0 && transactions[0].pending > 0)} onPress={openSettleBalance}>
                    <Text className="text-center text-white font-bold text-xl">Settle Balance</Text>
                </TouchableOpacity>
            </RBSheet>

            <RBSheet ref={refRBSheetSettleBalance} height={400} openDuration={250} draggable customStyles={{ container: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 } }}>
                <Text className="text-[#111827] font-medium text-[20px]">Settle Balance</Text>
                <View className="mt-6">
                    <Text className="text-[#111827] mb-2">Amount</Text>
                    <TextInput value={amount} onChangeText={setAmount} placeholder="Enter Amount" keyboardType="numeric" className="border border-[#E0E5E9] rounded-xl p-3" />
                    <Text className="text-[#111827] mt-4 mb-2">Payment Method</Text>
                    <RadioButton.Group onValueChange={setPaymentMethod} value={paymentMethod}>
                        <View className="flex-row items-center"><RadioButton value="cash" color="#007BFF" /><Text>Cash</Text></View>
                        <View className="flex-row items-center"><RadioButton value="upi" color="#007BFF" /><Text>UPI</Text></View>
                    </RadioButton.Group>
                    <View className="mt-4 flex-row gap-2">
                        <TouchableOpacity onPress={closeSettleSheet} className="flex-1 bg-gray-200 py-3 rounded-lg items-center"><Text>Cancel</Text></TouchableOpacity>
                        <TouchableOpacity disabled={loading} onPress={handleSettle} className={`flex-1 ${loading ? "bg-gray-400" : "bg-[#007BFF]"} py-3 rounded-lg items-center`}><Text className="text-white">Publish</Text></TouchableOpacity>
                    </View>
                </View>
            </RBSheet>
        </View>
    );
};

export default StudentDetails;
