import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import AppHeader from "../utils/AppBar";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/core";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRef, useState } from "react";
import RBSheet from "react-native-raw-bottom-sheet";

interface RBSheetRef {
  open: () => void;
  close: () => void;
}

const ClassFees = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const refRBSheet = useRef<RBSheetRef>(null);

  const [standard, setStandard] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // List of standards LKG–12th
  const standards = [
    "LKG",
    "UKG",
    ...Array.from({ length: 12 }, (_, i) => {
      const num = i + 1;
      const suffix =
        num === 1 ? "st" : num === 2 ? "nd" : num === 3 ? "rd" : "th";
      return `${num}${suffix}`;
    }),
  ];

  // Sample list shown on screen
  const classFeesList = [
    { standard: "1st", amount: 150 },
    { standard: "5th", amount: 200 },
    { standard: "10th", amount: 300 },
  ];

  return (
    <View className="flex-1 bg-white">
      {/* HEADER */}
      <AppHeader
        title="Class Fees"
        rightIcon="add-outline"
        onRightPress={() => refRBSheet.current?.open()}
      />

      {/* CLASS FEES LIST */}
      <ScrollView className="px-4 mt-4">
        {classFeesList.map((item, index) => (
          <View
            key={index}
            className="mb-4 p-4 rounded-2xl bg-white border border-gray-200 shadow-sm flex-row justify-between items-center"
          >
            <View>
              <Text className="text-[16px] font-semibold text-gray-900">
                {item.standard} Standard
              </Text>
              <Text className="text-[13px] text-gray-500 mt-1">
                ₹{item.amount}
              </Text>
            </View>

            <Text className="text-[22px] text-gray-400">›</Text>
          </View>
        ))}
      </ScrollView>

      {/* ====================== RBSHEET ====================== */}
      <RBSheet
        ref={refRBSheet}
        height={380}
        openDuration={250}
        closeOnPressMask={true}
        draggable={true}
        customStyles={{
          wrapper: { backgroundColor: "rgba(0,0,0,0.5)" },
          container: {
            backgroundColor: "#fff",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 20,
          },
          draggableIcon: { backgroundColor: "#cbd5e1" },
        }}
      >
        <Text className="text-[18px] font-semibold mb-4">
          Add Class Fees
        </Text>

        <ScrollView>
          {/* Standard Picker */}
          <Text className="text-[15px] mb-1 font-medium">Standard</Text>
          <View className="border border-gray-300 rounded-xl mb-3">
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

          {/* Amount */}
          <Text className="text-[15px] mb-1 font-medium">Amount</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter fees"
            keyboardType="numeric"
            className="border border-gray-300 rounded-xl p-3 mb-3"
          />

          {/* BUTTONS */}
          <View className="mt-4 flex-row">
            {/* Cancel */}
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "#E5E7EB",
                paddingVertical: 12,
                borderRadius: 10,
                marginRight: 8,
                alignItems: "center",
              }}
              onPress={() => refRBSheet.current?.close()}
            >
              <Text className="text-gray-700 font-semibold">Cancel</Text>
            </TouchableOpacity>

            {/* Save */}
            <TouchableOpacity
              disabled={loading}
              style={{
                flex: 1,
                backgroundColor: loading ? "#9CA3AF" : "#007BFF",
                paddingVertical: 12,
                borderRadius: 10,
                marginLeft: 8,
                alignItems: "center",
              }}
            >
              <Text className="text-white font-semibold">
                {loading ? "Saving..." : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </RBSheet>
      {/* ====================================================== */}
    </View>
  );
};

export default ClassFees;
