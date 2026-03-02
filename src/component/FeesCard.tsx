import { Image, Text, TouchableOpacity, View, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type data = {
    id: string | number;
    name: string;
    image?: string;
    standard: string;
    status: string;
    date: string;
    amount?: number;
    paid?: number;
    pending?: number;
    paymentType?: string;
    studentId?: number;
    studentData?: any; // Full student object for navigation
};

const FeesCard = ({
    id,
    name,
    standard,
    status,
    date,
    amount,
    paid,
    pending,
    paymentType,
    studentId,
    studentData
}: data) => {

    const navigation = useNavigation<any>();

    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case "paid":
                return { backgroundColor: "#DCFCE7", textColor: "#16A34A", borderColor: "#16A34A" };
            case "pending":
                return { backgroundColor: "#FEF3C7", textColor: "#D97706", borderColor: "#F59E0B" };
            case "overdue":
                return { backgroundColor: "#FEE2E2", textColor: "#DC2626", borderColor: "#EF4444" };
            default:
                return { backgroundColor: "#F3F4F6", textColor: "#6B7280", borderColor: "#9CA3AF" };
        }
    };

    const { backgroundColor, textColor, borderColor } = getStatusStyle(status);

    const handleCardPress = () => {
        if (studentData) {
            navigation.navigate("StudentDetails", { student: studentData });
        } else {
            Alert.alert("Info", "Student details not available");
        }
    };

    return (
        <TouchableOpacity
            className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-[#E5E6EA]"
            onPress={handleCardPress}
            activeOpacity={0.7}
        >
            {/* Header Row - Name and Status */}
            <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center flex-1">
                    <Image
                        source={require("../assets/image/Person.png")}
                        style={{ width: 50, height: 50 }}
                        className="rounded-full"
                    />
                    <View className="ml-3 flex-1">
                        <Text className="font-Jost font-bold text-[17px] text-[#111827]" numberOfLines={1}>
                            {name}
                        </Text>
                        <Text className="font-Jost text-[13px] text-[#6B7280] mt-0.5">
                            {standard}
                        </Text>
                    </View>
                </View>

                {/* Status Badge */}
                <View
                    style={{
                        backgroundColor,
                        borderWidth: 1,
                        borderColor,
                        paddingVertical: 6,
                        paddingHorizontal: 14,
                        borderRadius: 20,
                    }}
                >
                    <Text style={{ fontSize: 13, fontWeight: "700", color: textColor }}>
                        {status}
                    </Text>
                </View>
            </View>

            {/* Divider */}
            <View className="h-[1px] bg-[#E5E6EA] mb-3" />

            {/* Payment Details Grid */}
            <View className="flex-row justify-between mb-3">
                {/* Total Amount */}
                <View className="flex-1">
                    <Text className="text-[11px] text-[#9CA3AF] font-Jost font-medium mb-1">TOTAL AMOUNT</Text>
                    <View className="flex-row items-center">
                        <FontAwesome name="rupee" size={14} color="#111827" />
                        <Text className="ml-1 text-[16px] font-Jost font-bold text-[#111827]">
                            {amount || 0}
                        </Text>
                    </View>
                </View>

                {/* Paid Amount */}
                <View className="flex-1">
                    <Text className="text-[11px] text-[#9CA3AF] font-Jost font-medium mb-1">PAID</Text>
                    <View className="flex-row items-center">
                        <FontAwesome name="rupee" size={14} color="#16A34A" />
                        <Text className="ml-1 text-[16px] font-Jost font-bold text-[#16A34A]">
                            {paid || 0}
                        </Text>
                    </View>
                </View>

                {/* Pending Amount */}
                <View className="flex-1">
                    <Text className="text-[11px] text-[#9CA3AF] font-Jost font-medium mb-1">PENDING</Text>
                    <View className="flex-row items-center">
                        <FontAwesome name="rupee" size={14} color={pending && pending > 0 ? "#EF4444" : "#6B7280"} />
                        <Text className={`ml-1 text-[16px] font-Jost font-bold ${pending && pending > 0 ? "text-[#EF4444]" : "text-[#6B7280]"}`}>
                            {pending || 0}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Footer Row - Payment Type and Date */}
            <View className="flex-row items-center justify-between pt-2 border-t border-[#F3F4F6]">
                {/* Payment Type */}
                {paymentType && (
                    <View className="flex-row items-center">
                        <MaterialIcons
                            name={paymentType.toLowerCase() === "cash" ? "payments" : "account-balance-wallet"}
                            size={16}
                            color="#6B7280"
                        />
                        <Text className="ml-1.5 text-[13px] text-[#6B7280] font-Jost font-medium">
                            {paymentType}
                        </Text>
                    </View>
                )}

                {/* Date */}
                <View className="flex-row items-center">
                    <MaterialIcons name="event" size={16} color="#6B7280" />
                    <Text className="ml-1.5 text-[13px] text-[#6B7280] font-Jost font-medium">
                        {date}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default FeesCard;
