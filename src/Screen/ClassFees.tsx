import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
  ToastAndroid,
} from "react-native";
import AppHeader from "../utils/AppBar";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/core";
import RBSheet from "react-native-raw-bottom-sheet";
import apiClient from "../api/apiBaseUrl";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { formatDate } from "../utils/dateFormatter";


interface RBSheetRef {
  open: () => void;
  close: () => void;
}

interface ClassFee {
  id: number;
  standardId: number;
  standardName: string;
  amount: number;
  createdDate?: string;
  modifiedDate?: string;
}

interface Standard {
  id: number;
  name: string;
}

const ClassFees = () => {
  const navigation = useNavigation<any>();
  const refRBSheet = useRef<RBSheetRef>(null);

  const [fees, setFees] = useState<ClassFee[]>([]);
  const [standards, setStandards] = useState<Standard[]>([]);
  const [selectedStandardId, setSelectedStandardId] = useState<number | "">("");
  const [amount, setAmount] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [standardName, setStandardName] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setFetching(true);
      const [feesRes, standardsRes] = await Promise.all([
        apiClient.get("/classFees/all"),
        apiClient.get("/standard/all"),
      ]);

      if (Array.isArray(feesRes.data)) {
        // Sort by ID descending (newest first)
        const sorted = feesRes.data.sort((a: any, b: any) => b.id - a.id);
        setFees(sorted);
      }
      if (Array.isArray(standardsRes.data)) setStandards(standardsRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      Alert.alert("Error", "Failed to load class fees or standards");
    } finally {
      setFetching(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleOpenSheet = (fee?: ClassFee) => {
    if (fee) {
      setEditingId(fee.id);
      setSelectedStandardId(fee.standardId);
      setAmount(fee.amount.toString());
      setStandardName(fee.standardName);
    } else {
      setEditingId(null);
      setSelectedStandardId("");
      setAmount("");
      setStandardName("");
    }
    refRBSheet.current?.open();
  };

  const handleSave = async () => {
    if (!selectedStandardId) {
      Alert.alert("Validation", "Please select a standard");
      return;
    }
    if (!amount.trim() || isNaN(Number(amount))) {
      Alert.alert("Validation", "Please enter a valid amount");
      return;
    }

    try {
      setLoading(true);
      const currentDate = new Date().toISOString();
      let payload;

      if (editingId) {
        // PUT request includes id and standardName
        payload = {
          id: editingId,
          standardId: selectedStandardId,
          standardName: standardName,
          amount: parseFloat(amount),
          modifiedDate: currentDate,
        };
      } else {
        // POST request - only standardId and amount
        payload = {
          standardId: selectedStandardId,
          amount: parseFloat(amount),
          createdDate: currentDate,
          modifiedDate: currentDate,
        };
      }

      let response;
      if (editingId) {
        response = await apiClient.put(`/classFees/update/${editingId}`, payload);
      } else {
        response = await apiClient.post("/classFees/create", payload);
      }

      if (response.status === 200 || response.status === 201) {
        ToastAndroid.show(`Class fee ${editingId ? "updated" : "added"} successfully`, ToastAndroid.LONG);
        refRBSheet.current?.close();
        setEditingId(null);
        setSelectedStandardId("");
        setAmount("");
        setStandardName("");
        fetchData();
      }
    } catch (error: any) {
      console.error("Failed to save class fee:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to save class fee";
      if (error.response?.status === 500) {
        Alert.alert("Server Error", "500 Error: " + errorMessage);
      } else {
        ToastAndroid.show(errorMessage, ToastAndroid.LONG);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this class fee?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setFetching(true);
              const response = await apiClient.delete(`/classFees/delete/${id}`);
              if (response.status === 200) {
                ToastAndroid.show("Class fee deleted successfully", ToastAndroid.LONG);
                fetchData();
              }
            } catch (error: any) {
              console.error("Failed to delete class fee:", error);
              const errorMessage = error.response?.data?.message || "Failed to delete";
              if (error.response?.status === 500) {
                Alert.alert("Server Error", "500 Error: " + errorMessage);
              } else {
                ToastAndroid.show(errorMessage, ToastAndroid.LONG);
              }
            } finally {
              setFetching(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-[#F9FAFB]">
      <AppHeader
        title="Class Fees"
        rightIcon="add-outline"
        onRightPress={() => handleOpenSheet()}
      />

      {fetching && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#007BFF" />
          <Text className="mt-2 text-gray-500">Loading fees...</Text>
        </View>
      ) : (
        <ScrollView
          className="px-4 mt-4"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {fees.length === 0 ? (
            <View className="items-center mt-20">
              <Ionicons name="receipt-outline" size={64} color="#D1D5DB" />
              <Text className="text-gray-500 mt-4 text-[16px]">No class fees configured yet</Text>
              <TouchableOpacity
                className="mt-6 bg-blue-50 px-6 py-3 rounded-full"
                onPress={() => handleOpenSheet()}
              >
                <Text className="text-blue-600 font-semibold">+ Add First Entry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            fees.map((item) => (
              <View
                key={item.id}
                className="mb-4 p-5 rounded-3xl bg-white border border-gray-100 shadow-sm"
              >
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <View className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                      <Text className="text-[17px] font-bold text-gray-900">
                        {item.standardName}
                      </Text>
                    </View>
                    <Text className="text-[14px] text-gray-500 ml-4 font-medium">
                      Monthly Fees: <Text className="text-blue-600 font-bold">₹{item.amount}</Text>
                    </Text>
                  </View>

                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => handleOpenSheet(item)}
                      className="p-2 bg-blue-50 rounded-full"
                    >
                      <Feather name="edit" color="#3B82F6" size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(item.id)}
                      className="p-2 bg-red-50 rounded-full"
                    >
                      <AntDesign name="delete" color="#EF4444" size={20} />
                    </TouchableOpacity>
                  </View>
                </View>

                {item.createdDate && (
                  <Text className="text-[12px] text-gray-500 ml-4">
                    Created: {formatDate(item.createdDate)}
                  </Text>
                )}
              </View>
            ))
          )}
          <View className="h-20" />
        </ScrollView>
      )}

      <RBSheet
        ref={refRBSheet}
        height={400}
        openDuration={250}
        draggable
        closeOnPressMask
        customStyles={{
          wrapper: { backgroundColor: "rgba(0,0,0,0.5)" },
          container: {
            backgroundColor: "#fff",
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            padding: 24,
          },
          draggableIcon: { backgroundColor: "#E5E7EB", width: 40 },
        }}
      >
        <Text className="text-[20px] font-bold text-gray-900 mb-6">
          {editingId ? "Update Class Fees" : "Add New Fees"}
        </Text>

        <View className="mb-4">
          <Text className="text-[15px] font-semibold text-gray-700 mb-2">Standard</Text>
          <View className="border border-gray-200 rounded-2xl bg-gray-50 overflow-hidden">
            <Picker
              selectedValue={selectedStandardId}
              onValueChange={(val) => setSelectedStandardId(val)}
              style={{ height: 55 }}
              dropdownIconColor="#6B7280"
            >
              <Picker.Item label="Select standard..." value="" color="#9CA3AF" />
              {standards.map((s) => (
                <Picker.Item key={s.id} label={s.name} value={s.id} color="#111827" />
              ))}
            </Picker>
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-[15px] font-semibold text-gray-700 mb-2">Amount (₹)</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="e.g. 500"
            keyboardType="numeric"
            placeholderTextColor="#9CA3AF"
            className="border border-gray-200 rounded-2xl p-4 text-[16px] bg-gray-50 text-gray-900 font-medium"
          />
        </View>

        <View className="flex-row gap-4">
          <TouchableOpacity
            className="flex-1 py-4 bg-gray-100 rounded-2xl items-center"
            onPress={() => refRBSheet.current?.close()}
          >
            <Text className="text-gray-600 font-bold text-[16px]">Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={loading}
            onPress={handleSave}
            className={`flex-1 py-4 rounded-2xl items-center ${loading ? "bg-gray-300" : "bg-blue-600 shadow-lg shadow-blue-200"}`}
          >
            <Text className="text-white font-bold text-[16px]">
              {loading ? "Saving..." : editingId ? "Update" : "Save"}
            </Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    </View>
  );
};

export default ClassFees;
