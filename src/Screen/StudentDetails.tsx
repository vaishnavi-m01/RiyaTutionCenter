import { Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";
import StudentInfo from "../component/StudentInfo";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useRef, useState } from "react";
import RBSheet from "react-native-raw-bottom-sheet";
import { RadioButton } from 'react-native-paper';
import { useNavigation } from "@react-navigation/core";


interface RBSheetRef {
    open: () => void;
    close: () => void;
}

const StudentDetails = () => {

    const [amount, setAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<any>();


    const refRBSheet = useRef<RBSheetRef>(null);
    const openFilterSheet = () => refRBSheet.current?.open();
    const closeSheet = () => refRBSheet.current?.close();

    const refRBSheetSettleBalance = useRef<RBSheetRef>(null);

    const openSettleBalance = () => {

        refRBSheet.current?.close();


        setTimeout(() => {
            refRBSheetSettleBalance.current?.open();
        }, 300);
    };

    return (
        <View className="flex-1 bg-white px-2 pt-4">



            <StudentInfo />


            <View className="flex-row gap-4 w-full">

                {/* Balance Box */}
                <TouchableOpacity className="flex-1 border border-[#E0E5E9] rounded-lg p-4" onPress={openFilterSheet}>
                    <View className="flex-row gap-2 items-center pl-2 pb-1">
                        <FontAwesome name="rupee" color="#000" size={20} />
                        <Text className="text-[#111827] font-[Jost] font-medium text-[17px]">
                            Balance
                        </Text>
                    </View>

                    <Text className="text-[#111827] font-bold text-[18px] mt-1">
                        Fully Paid
                    </Text>
                </TouchableOpacity>

                {/* Joined Date Box */}
                <View className="flex-1 border border-[#E0E5E9] rounded-lg p-4">
                    <View className="flex-row items-center pb-1 pl-2">
                        <Text className="text-[#111827] font-[Jost] font-medium text-[17px]">
                            Joined Date
                        </Text>
                    </View>

                    <Text className="text-[#111827] font-bold text-[18px] mt-1">
                        22 March 2025
                    </Text>
                </View>
            </View>

            <Text className="mt-9 font-[Jost] text-[#111827] font-bold text-[16px]">
                Class
            </Text>

            <View className="border border-[#E0E5E9] rounded-2xl p-4 mt-4 bg-white shadow-sm">
                <Text className="text-base font-semibold text-[#111827] mb-1">📘 11th Standard</Text>

                <Text className="text-sm text-[#4B5563] mb-1">
                    💰 Fees: <Text className="font-medium text-[#111827]">₹3000 / Month</Text>
                </Text>

                <Text className="text-sm text-[#4B5563]">
                    ⏰ Time: <Text className="font-medium text-[#111827]">5:00 PM – 7:00 PM</Text>
                </Text>
            </View>

            <Text className="mt-12 text-[#111827] text-[19px] font-[Jost] font-medium">
                Recent transaction
            </Text>

            <View className="border border-[#E0E5E9] rounded-lg p-2 mt-4">
                <View className="flex-row px-2 justify-between">
                    <Text className="font-[Jost] text-[#111827] text-[14px] font-bold">12th Standard</Text>

                    <View className="flex-row items-end gap-2">
                        <View className="border border-[#E3E4E8] rounded-full px-4 bg-[#E3E4E8]">
                            <Text className="font-[Jost] text-[#090A0E] font-medium">UPI</Text>
                        </View>
                        <Text className="text-[#111827] font-[Jost] font-medium">INR300</Text>
                    </View>
                </View>

                <View className="mt-4 flex-row justify-between">
                    <Text className="text-[#666A75]"> 15 Jun 2025</Text>
                    <AntDesign name="arrowright" color="#111827" size={24} />
                </View>
            </View>


            <RBSheet
                ref={refRBSheet}
                height={200}
                openDuration={250}
                draggable
                closeOnPressMask
                customStyles={{
                    wrapper: { backgroundColor: "rgba(0,0,0,0.5)" },
                    container: {
                        backgroundColor: "#fff",
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        paddingBottom: 20,
                        overflow: "visible"
                    },
                    draggableIcon: { backgroundColor: "#cbd5e1" },
                }}
            >

                <View className="px-4 ">
                    <Text className="text-[#111827] font-medium text-[20px]">Balance</Text>

                    <View className="flex-row justify-between mt-4 ">
                        <Text className="text-[#111827] font-Jost text-[15px] font-medium ">Pending Amount</Text>
                        <Text className="text-[#111827] font-Jost text-[18px] font-bold pr-4 ">₹200</Text>
                    </View>


                    <TouchableOpacity className="bg-[#007BFF] rounded-lg px-4 py-4 mt-8" onPress={openSettleBalance}>
                        <Text className="text-center text-white font-bold text-xl">Settle Balance</Text>
                    </TouchableOpacity>
                </View>

            </RBSheet>


            {/* settle Balance */}


            <RBSheet
                ref={refRBSheetSettleBalance}
                height={400}
                openDuration={250}
                draggable
                closeOnPressMask
                customStyles={{
                    wrapper: { backgroundColor: "rgba(0,0,0,0.5)" },
                    container: {
                        backgroundColor: "#fff",
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        paddingBottom: 10,
                        overflow: "visible"
                    },
                    draggableIcon: { backgroundColor: "#cbd5e1" },
                }}
            >

                <View className="px-4 ">
                    <Text className="text-[#111827] font-medium text-[20px]">Settle Balance</Text>

                    <View className="mt-6 px-4">
                        <Text className="text-[#111827] font-Jost font-regular text-[15px] mb-2">Amount</Text>

                        <TextInput
                            value={amount}
                            onChangeText={setAmount}
                            placeholder="Place"
                            className="border border-[#E0E5E9] rounded-xl p-3 text-[#000]"
                        />

                        <Text className="text-[#111827] font-Jost font-regular text-[15px] mb-2 mt-4">Payment Method</Text>

                        <RadioButton.Group
                            onValueChange={value => setPaymentMethod(value)}
                            value={paymentMethod}
                        >
                            <View className="flex-row items-center mb-2">
                                <RadioButton
                                    value="cash"
                                    color="#007BFF"
                                    uncheckedColor="#9CA3AF"
                                />
                                <Text className="text-[#111827] text-[14px] font-Jost font-regular ml-2">Cash</Text>
                            </View>

                            <View className="flex-row items-center mb-2">
                                <RadioButton
                                    value="online"
                                    color="#007BFF"
                                    uncheckedColor="#9CA3AF"
                                />
                                <Text className="text-[#111827] text-[14px] font-Jost font-regular ml-2">UPI</Text>
                            </View>
                        </RadioButton.Group>


                        <View className="mt-4 flex-row gap-2">

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
                </View>

            </RBSheet>
        </View>
    );
};

export default StudentDetails;
