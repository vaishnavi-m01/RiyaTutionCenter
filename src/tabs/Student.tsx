import React, { useState, useEffect, useMemo } from "react";
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator, RefreshControl, Alert, ToastAndroid } from "react-native";
import StudentsCard from "../component/studentsCard";
import AppHeader from "../utils/AppBar";
import { useNavigation, useIsFocused, useRoute } from "@react-navigation/native";
import apiClient from "../api/apiBaseUrl";
import { Student } from "../type/type";
const StudentTab = () => {
    const route = useRoute<any>();
    const { initialSearch } = route.params || {} as { initialSearch?: string };

    const [selected, setSelected] = useState("All Student");
    const [students, setStudents] = useState<Student[]>([]);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [totalStudents, setTotalStudents] = useState(0);

    const navigation = useNavigation<any>();
    const isFocused = useIsFocused();

    const fetchStudents = async (isRefreshing = false) => {
        if (!isRefreshing) setLoading(true);
        try {
            const response = await apiClient.get('/students/all');
            if (Array.isArray(response.data)) {
                let processedStudents = response.data;

                if (initialSearch === 'birthday') {
                    const today = new Date();
                    const bdayStudents = response.data.filter((s: Student) => {
                        if (!s.dateOfBirth) return false;
                        const dob = new Date(s.dateOfBirth);
                        return dob.getDate() === today.getDate() && dob.getMonth() === today.getMonth();
                    });
                    processedStudents = bdayStudents;
                }

                // Sort by ID descending (newest first)
                const sorted = processedStudents.sort((a, b) => b.id - a.id);
                setStudents(sorted);
                setTotalStudents(sorted.length); // Set totalStudents based on processed and sorted students
            }
        } catch (error) {
            console.error('Failed to fetch students:', error);
            // No need to set students or totalStudents here, as it's an error state
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            fetchStudents();
        }
    }, [isFocused]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchStudents(true);
    };

    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            const matchesFilter =
                selected === "All Student" ||
                (selected === "Male" && student.gender === "Male") ||
                (selected === "Female" && student.gender === "Female");

            const matchesSearch =
                student.name.toLowerCase().includes(searchText.toLowerCase()) ||
                student.phone.includes(searchText) ||
                student.standardName?.toLowerCase().includes(searchText.toLowerCase());

            return matchesFilter && matchesSearch;
        });
    }, [students, selected, searchText]);

    const stats = useMemo(() => {
        const total = students.length;
        const male = students.filter(s => s.gender === "Male").length;
        const female = students.filter(s => s.gender === "Female").length;
        return [
            { label: "All Student", count: total },
            { label: "Female", count: female },
            { label: "Male", count: male },
        ];
    }, [students]);

    const handleDelete = async (id: number) => {
        Alert.alert(
            "Delete Student",
            "Are you sure you want to delete this student?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const response = await apiClient.delete(`/students/delete/${id}`);
                            if (response.status === 200) {
                                ToastAndroid.show("Student deleted successfully", ToastAndroid.SHORT);
                                fetchStudents(); // Refresh list
                            }
                        } catch (error) {
                            console.error("Failed to delete student:", error);
                            Alert.alert("Error", "Failed to delete student. Please try again.");
                        }
                    }
                }
            ]
        );
    };

    const themeColor = "#007BFF";

    return (
        <View className="flex-1 bg-white">
            <AppHeader
                title="Students"
                showSearch={true}
                searchValue={searchText}
                onSearchChange={setSearchText}
                searchPlaceholder="Search by Name, Phone, Class..."
                rightIcon="add-outline"
                onRightPress={() => navigation.navigate("CreateStudent", { headerTitle: "New Student" })}
            />

            <View className="flex flex-row px-2 border border-[#E5E6EA] py-2">
                {stats.map((btn) => {
                    const isSelected = selected === btn.label;

                    return (
                        <TouchableOpacity
                            key={btn.label}
                            onPress={() => setSelected(btn.label)}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 4,
                                paddingVertical: 8,
                                paddingHorizontal: 20,
                                borderBottomWidth: isSelected ? 2 : 0,
                                borderColor: isSelected ? themeColor : "transparent",
                            }}
                        >
                            <Text
                                style={{
                                    color: isSelected ? themeColor : "#111827",
                                    fontWeight: "500",
                                }}
                            >
                                {btn.label}
                            </Text>

                            <View
                                style={{
                                    backgroundColor: isSelected ? themeColor : "#E5E6EA",
                                    paddingHorizontal: 8,
                                    paddingVertical: 2,
                                    borderRadius: 999,
                                }}
                            >
                                <Text
                                    style={{
                                        color: isSelected ? "white" : "#111827",
                                        fontSize: 12,
                                    }}
                                >
                                    {btn.count}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color={themeColor} />
                </View>
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    className="px-3 mt-4"
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map((item) => (
                            <StudentsCard
                                key={item.id}
                                student={item}
                                onDelete={() => handleDelete(item.id)}
                            />
                        ))
                    ) : (
                        <View className="items-center mt-20">
                            <Text className="text-gray-400">No students found</Text>
                        </View>
                    )
                    }
                </ScrollView>
            )}
        </View>
    );
};

export default StudentTab;
