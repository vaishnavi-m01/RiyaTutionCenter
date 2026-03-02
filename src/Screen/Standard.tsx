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

interface Standard {
    id: number;
    name: string;
    createdDate?: string;
    modifiedDate?: string;
}

const Standard = () => {
    const navigation = useNavigation<any>();
    const refRBSheet = useRef<RBSheetRef>(null);

    const [standards, setStandards] = useState<Standard[]>([]);
    const [name, setName] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchStandards = async () => {
        try {
            setFetching(true);
            const response = await apiClient.get("/standard/all");
            if (Array.isArray(response.data)) {
                setStandards(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch standards:", error);
            Alert.alert("Error", "Failed to load standards");
        } finally {
            setFetching(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchStandards();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchStandards();
    };

    const handleOpenSheet = (item?: Standard) => {
        if (item) {
            setEditingId(item.id);
            setName(item.name);
        } else {
            setEditingId(null);
            setName("");
        }
        refRBSheet.current?.open();
    };

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert("Validation", "Please enter standard name");
            return;
        }

        try {
            setLoading(true);
            let response;
            const currentDate = new Date().toISOString();

            if (editingId) {
                response = await apiClient.put(`/standard/update/${editingId}`, {
                    id: editingId,
                    name: name.trim(),
                    modifiedDate: currentDate
                });
            } else {
                response = await apiClient.post("/standard/create", {
                    name: name.trim(),
                    createdDate: currentDate,
                    modifiedDate: currentDate
                });
            }

            if (response.status === 200 || response.status === 201) {
                ToastAndroid.show(`Standard ${editingId ? "updated" : "added"} successfully`, ToastAndroid.LONG);
                refRBSheet.current?.close();
                setEditingId(null);
                setName("");
                fetchStandards();
            }
        } catch (error: any) {
            console.error("Failed to save standard:", error);
            const errorMessage = error.response?.data?.message || error.message || "Failed to save standard";
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
            "Are you sure you want to delete this standard?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setFetching(true);
                            const response = await apiClient.delete(`/standard/delete/${id}`);
                            if (response.status === 200) {
                                ToastAndroid.show("Standard deleted successfully", ToastAndroid.LONG);
                                fetchStandards();
                            }
                        } catch (error: any) {
                            console.error("Failed to delete standard:", error);
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
                title="Standards"
                rightIcon="add-outline"
                onRightPress={() => handleOpenSheet()}
            />

            {fetching && !refreshing ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#007BFF" />
                </View>
            ) : (
                <ScrollView
                    className="px-4 mt-4"
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    {standards.length === 0 ? (
                        <View className="flex-1 justify-center items-center mt-20">
                            <Ionicons name="school-outline" size={64} color="#D1D5DB" />
                            <Text className="text-gray-500 mt-4">No standards found</Text>
                        </View>
                    ) : (
                        standards.map((item) => (
                            <View
                                key={item.id}
                                className="mb-3 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm"
                            >
                                <View className="flex-row justify-between items-center mb-2">
                                    <Text className="text-[17px] font-bold text-gray-900 flex-1">
                                        {item.name}
                                    </Text>

                                    <View className="flex-row gap-2">
                                        <TouchableOpacity
                                            onPress={() => handleOpenSheet(item)}
                                            className="p-2 bg-blue-50 rounded-full"
                                        >
                                            <Feather name="edit" color="#3B82F6" size={19} />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => handleDelete(item.id)}
                                            className="p-2 bg-red-50 rounded-full"
                                        >
                                            <AntDesign name="delete" color="#EF4444" size={19} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {item.createdDate && (
                                    <Text className="text-[12px] text-gray-500">
                                        Created: {formatDate(item.createdDate)}
                                    </Text>
                                )}
                            </View>
                        ))
                    )}
                </ScrollView>
            )}

            <RBSheet
                ref={refRBSheet}
                height={300}
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
                    {editingId ? "Update Standard" : "Add New Standard"}
                </Text>

                <View className="mb-8">
                    <Text className="text-[15px] font-semibold text-gray-700 mb-2">Standard Name</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="e.g. 1st Standard, LKG"
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

export default Standard;
