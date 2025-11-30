import { useNavigation } from "@react-navigation/core";
import { Image, Text, TouchableOpacity, View } from "react-native";

type data = {
    id: string;
    name: string;
    image: string;
    standard: string;
    status: string;
    date: string;
};

const FeesCard = ({ id, name, standard, status, date }: data) => {

    const navigation = useNavigation<any>();

    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case "paid":
                return { backgroundColor: "#16A34A", textColor: "#FFFFFF" };
            case "pending":
                return { backgroundColor: "#FBBF24", textColor: "#111827" };
            case "overdue":
                return { backgroundColor: "#EF4444", textColor: "#FFFFFF" };
            default:
                return { backgroundColor: "#6B7280", textColor: "#FFFFFF" };
        }
    };

    const { backgroundColor, textColor } = getStatusStyle(status);

    return (
        <TouchableOpacity className="bg-white rounded-2xl p-4 mb-2 shadow-md border border-[#E5E6EA]" onPress={() => navigation.navigate("StudentDetails")}>
            <View className="flex-row items-start justify-between">

                {/* Avatar + Info */}
                <View className="flex-row">
                    <Image
                        source={require("../assets/image/Person.png")}
                        style={{ width: 68, height: 68 }}
                        className="rounded-full"
                    />
                    <View className="flex-col px-1">
                        <Text className="font-Jost font-semibold text-[16px] text-[#111827]">
                            {name}
                        </Text>
                        <Text className="mt-1 font-Jost text-[13px] text-[#4B5563]">
                            {standard}
                        </Text>
                        <Text className="pt-2 text-[13px] text-[#6B7280] font-Jost font-medium">
                            {date}
                        </Text>
                    </View>
                </View>

                {/* Status Badge */}
                <View className="items-end justify-between mt-2">
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor,
                            paddingVertical: 4,
                            paddingHorizontal: 16,
                            borderRadius: 999,
                        }}
                    >
                        <Text style={{ fontSize: 14, fontWeight: "600", color: textColor }}>
                            {status}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default FeesCard;
