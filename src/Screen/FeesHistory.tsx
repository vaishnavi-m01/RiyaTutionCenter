import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, TextInput } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import AppHeader from "../utils/AppBar";
import apiClient from "../api/apiBaseUrl";
import FeesCard from "../component/FeesCard";

const FeesHistory = () => {
    const navigation = useNavigation<any>();
    const [historyData, setHistoryData] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [students, setStudents] = useState<any[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<number | null>(new Date().getMonth());
    const [totals, setTotals] = useState({ totalAmount: 0, totalPaid: 0, totalPending: 0, paidCount: 0, pendingCount: 0 });

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const [feesRes, studentsRes, summaryRes] = await Promise.all([
                apiClient.get('/fees/getAll'),
                apiClient.get('/students/all'),
                apiClient.get(`/fees/summary?month=${selectedMonth !== null ? selectedMonth + 1 : ""}&year=${new Date().getFullYear()}`)
            ]);

            if (feesRes.data) {
                let filtered = feesRes.data;
                if (selectedMonth !== null) {
                    filtered = filtered.filter((item: any) => {
                        const itemDate = new Date(item.createdDate);
                        return itemDate.getMonth() === selectedMonth;
                    });
                }
                // Sort by date descending
                const sorted = filtered.sort((a: any, b: any) =>
                    new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
                );
                setHistoryData(sorted);
                setFilteredData(sorted);
            }
            if (studentsRes.data) {
                setStudents(studentsRes.data);
            }
            if (summaryRes.data) {
                setTotals(summaryRes.data);
            }
        } catch (error) {
            console.error("Error fetching history:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [selectedMonth]);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredData(historyData);
        } else {
            const filtered = historyData.filter(item =>
                item.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.standardName?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredData(filtered);
        }
    }, [searchQuery, historyData]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchHistory();
    };

    // Grouping by Month
    const groupedData: { [key: string]: any[] } = filteredData.reduce((acc, item) => {
        const date = new Date(item.createdDate);
        const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        if (!acc[monthYear]) acc[monthYear] = [];
        acc[monthYear].push(item);
        return acc;
    }, {});

    return (
        <View className="flex-1 bg-white">
            <AppHeader
                title="Fees History"
                showSearch={true}
                onSearchChange={setSearchQuery}
                searchValue={searchQuery}
            />

            {/* Month Filter above summary */}
            <View className="border-b border-[#F2F4F6] bg-white py-3">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
                    <TouchableOpacity
                        onPress={() => setSelectedMonth(null)}
                        className={`mr-2 px-6 py-2 rounded-full border ${selectedMonth === null ? "bg-[#007BFF] border-[#007BFF]" : "bg-white border-gray-200"}`}
                    >
                        <Text className={selectedMonth === null ? "text-white font-bold" : "text-gray-600"}>All</Text>
                    </TouchableOpacity>
                    {months.map((month, index) => (
                        <TouchableOpacity
                            key={month}
                            onPress={() => setSelectedMonth(index)}
                            className={`mr-2 px-6 py-2 rounded-full border ${selectedMonth === index ? "bg-[#007BFF] border-[#007BFF]" : "bg-white border-gray-200"}`}
                        >
                            <Text className={selectedMonth === index ? "text-white font-bold" : "text-gray-600"}>{month}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Summary Card */}
            <View className="px-4 py-3">
                <View className="bg-[#007BFF] rounded-2xl p-4 shadow-lg shadow-blue-300">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-white/80 font-Jost font-medium text-[14px]">
                            {selectedMonth !== null ? `${months[selectedMonth]} Summary` : "Overall Summary"}
                        </Text>
                        <View className="bg-white/20 px-3 py-1 rounded-full">
                            <Text className="text-white text-[12px] font-bold">₹{totals.totalAmount}</Text>
                        </View>
                    </View>

                    <View className="flex-row justify-between">
                        <View className="items-center bg-white/10 p-2 rounded-lg flex-1 mr-1">
                            <Text className="text-white/70 text-[10px] font-Jost mb-1">PAID</Text>
                            <Text className="text-white text-[16px] font-bold">₹{totals.totalPaid}</Text>
                            <Text className="text-white/90 text-[11px] font-bold mt-1">
                                {historyData.filter(item => item.status?.toLowerCase() === 'paid').length} Students
                            </Text>
                        </View>

                        <View className="items-center bg-white/10 p-2 rounded-lg flex-1 mx-1">
                            <Text className="text-white/70 text-[10px] font-Jost mb-1">PENDING</Text>
                            <Text className="text-white text-[16px] font-bold">₹{totals.totalPending}</Text>
                            <Text className="text-white/90 text-[11px] font-bold mt-1">
                                {historyData.filter(item => item.status?.toLowerCase() === 'pending').length} Students
                            </Text>
                        </View>

                        <View className="items-center bg-white/10 p-2 rounded-lg flex-1 ml-1">
                            <Text className="text-white/70 text-[10px] font-Jost mb-1">RECORDS</Text>
                            <Text className="text-white text-[16px] font-bold">{filteredData.length}</Text>
                            <Text className="text-white/90 text-[11px] font-bold mt-1">Total Ent.</Text>
                        </View>
                    </View>
                </View>
            </View>

            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#007BFF" />
                </View>
            ) : (
                <ScrollView
                    className="px-4 pt-1"
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    {filteredData.length === 0 ? (
                        <View className="items-center mt-20">
                            <Text className="text-gray-500 font-Jost">No history found</Text>
                        </View>
                    ) : (
                        selectedMonth !== null ? (
                            filteredData.map((item) => {
                                const studentData = students.find(s => s.id === item.studentId);
                                return (
                                    <FeesCard
                                        key={item.id}
                                        id={item.id}
                                        name={item.studentName}
                                        image={item.imageUrl}
                                        standard={item.standardName}
                                        status={item.status}
                                        amount={item.amount}
                                        paid={item.paid}
                                        pending={item.pending}
                                        paymentType={item.paymentType}
                                        studentId={item.studentId}
                                        studentData={studentData}
                                        date={new Date(item.createdDate).toLocaleDateString('en-GB')}
                                    />
                                );
                            })
                        ) : (
                            Object.keys(groupedData).map((monthYear) => (
                                <View key={monthYear} className="mb-6">
                                    <View className="bg-gray-50 px-4 py-2 rounded-lg mb-3 border-l-4 border-blue-500">
                                        <Text className="font-Jost font-bold text-blue-800 text-[16px]">
                                            {monthYear}
                                        </Text>
                                    </View>
                                    {groupedData[monthYear].map((item) => {
                                        const studentData = students.find(s => s.id === item.studentId);
                                        return (
                                            <FeesCard
                                                key={item.id}
                                                id={item.id}
                                                name={item.studentName}
                                                image={item.image || "../assets/image/Person.png"}
                                                standard={item.standardName}
                                                status={item.status}
                                                amount={item.amount}
                                                paid={item.paid}
                                                pending={item.pending}
                                                paymentType={item.paymentType}
                                                studentId={item.studentId}
                                                studentData={studentData}
                                                date={new Date(item.createdDate).toLocaleDateString('en-GB')}
                                            />
                                        );
                                    })}
                                </View>
                            ))
                        )
                    )}
                    <View className="h-10" />
                </ScrollView>
            )}

        </View>
    );
};

export default FeesHistory;
