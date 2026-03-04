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
                    createdDate: "",
                    modifiedDate: ""
                });
            } else {
                response = await apiClient.post("/standard/create", {
                    id: 0,
                    name: name.trim(),
                    createdDate: "",
                    modifiedDate: ""
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
                        <View className="flex-1 justify-center items-center mt-32 px-10">
                            <View className="bg-orange-50 p-8 rounded-full mb-6">
                                <Ionicons name="school-outline" size={80} color="#F97316" />
                            </View>
                            <Text className="text-xl font-bold text-gray-900 text-center">No Standards Yet</Text>
                            <Text className="text-gray-500 mt-2 text-center leading-5">Add your first standard/class to get started.</Text>
                            <TouchableOpacity
                                onPress={() => handleOpenSheet()}
                                className="mt-8 bg-orange-600 px-8 py-4 rounded-2xl shadow-lg shadow-orange-200"
                            >
                                <Text className="text-white font-bold text-lg">Add First Standard</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        standards.map((item) => (
                            <View
                                key={item.id}
                                className="mb-4 flex-row items-center p-4 bg-white rounded-2xl border border-gray-100"
                            >
                                {/* Left Icon */}
                                <View className="w-12 h-12 rounded-xl bg-orange-50 items-center justify-center">
                                    <Ionicons name="school-outline" size={24} color="#F97316" />
                                </View>

                                {/* Center Content */}
                                <View className="flex-1 ml-4">
                                    <Text className="text-[17px] font-bold text-gray-900">
                                        {item.name}
                                    </Text>
                                    <Text className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mt-0.5">
                                        Academic Class
                                    </Text>
                                </View>

                                {/* Right Actions */}
                                <View className="flex-row gap-2">
                                    <TouchableOpacity
                                        onPress={() => handleOpenSheet(item)}
                                        className="w-10 h-10 items-center justify-center rounded-full"
                                    >
                                        <Feather name="edit" color="#3B82F6" size={22} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => handleDelete(item.id)}
                                        className="w-10 h-10 items-center justify-center rounded-full"
                                    >
                                        <AntDesign name="delete" color="#EF4444" size={22} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    )}
                </ScrollView>
            )}

            <RBSheet
                ref={refRBSheet}
                height={320}
                openDuration={250}
                draggable
                closeOnPressMask
                customStyles={{
                    wrapper: { backgroundColor: "rgba(0,0,0,0.4)" },
                    container: {
                        backgroundColor: "#fff",
                        borderTopLeftRadius: 40,
                        borderTopRightRadius: 40,
                        paddingHorizontal: 28,
                        paddingTop: 12,
                        paddingBottom: 32,
                    },
                    draggableIcon: { backgroundColor: "#E5E7EB", width: 50, height: 5, borderRadius: 10 },
                }}
            >
                <View className="flex-row justify-between items-center mt-2 mb-8">
                    <Text className="text-[22px] font-black text-gray-900">
                        {editingId ? "Update Standard" : "New Standard"}
                    </Text>
                    <TouchableOpacity onPress={() => refRBSheet.current?.close()}>
                        <Ionicons name="close-circle" size={28} color="#D1D5DB" />
                    </TouchableOpacity>
                </View>

                <View className="mb-10">
                    <Text className="text-[14px] font-bold text-gray-500 mb-3 ml-1 uppercase tracking-widest">Name</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="e.g. 1st Standard, LKG"
                        placeholderTextColor="#A0AEC0"
                        className="border-2 border-gray-50 rounded-2xl px-5 py-4 text-[17px] bg-gray-50 text-gray-900 font-semibold"
                    />
                </View>

                <View className="flex-row gap-4">
                    <TouchableOpacity
                        className="flex-1 py-4.5 bg-gray-100 rounded-2xl items-center justify-center p-4"
                        onPress={() => refRBSheet.current?.close()}
                    >
                        <Text className="text-gray-500 font-extrabold text-[16px]">Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        disabled={loading}
                        onPress={handleSave}
                        className={`flex-1 py-4.5 rounded-2xl items-center justify-center p-4 shadow-xl ${loading ? "bg-orange-400" : "bg-orange-600 shadow-orange-200"}`}
                    >
                        <Text className="text-white font-extrabold text-[16px]">
                            {loading ? "Processing..." : editingId ? "Update" : "Create"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </RBSheet>
        </View>
    );
};

export default Standard;
