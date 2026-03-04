import { Image, ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator, RefreshControl } from "react-native"
import AppHeader from "../utils/AppBar"
import { useNavigation } from "@react-navigation/core"
import React, { useState, useEffect, useCallback } from "react"

import { useFocusEffect } from '@react-navigation/native';
import FeesCard from "../component/FeesCard";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "react-native-vector-icons/Ionicons";
import apiClient from "../api/apiBaseUrl";

const Fees = () => {
  const navigation = useNavigation<any>()
  const [selectedTab, setSelectedTab] = useState("All");
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [feesData, setFeesData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();

  // Get current month only for this tab (safety check for createdDate)
  const currentMonthData = (feesData || []).filter(item => {
    if (!item.createdDate) return false;
    // Filter for active students only as requested
    if (item.activeStatus === false) return false;

    const itemDate = new Date(item.createdDate);
    const now = new Date();
    return itemDate.getMonth() === now.getMonth() &&
      itemDate.getFullYear() === now.getFullYear();
  });

  const paidCount = currentMonthData.filter(item => item.status?.toLowerCase() === "paid").length;
  const pendingCount = currentMonthData.filter(item => item.status?.toLowerCase() === "pending").length;

  const tabs = [
    { label: "All", count: currentMonthData.length, value: "All" },
    { label: "Paid", count: paidCount, value: "Paid" },
    { label: "Pending", count: pendingCount, value: "Pending" }
  ];

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch fees data
  const fetchFees = useCallback(async () => {
    try {
      setLoading(true);
      const [feesResponse, studentsResponse] = await Promise.all([
        apiClient.get('/fees/getAll'),
        apiClient.get('/students/all')
      ]);

      if (feesResponse.data) {
        setFeesData(feesResponse.data);
        setFilteredData(feesResponse.data);
      }

      if (studentsResponse.data) {
        setStudents(studentsResponse.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Refresh fees when tab is focused
  useFocusEffect(
    useCallback(() => {
      fetchFees();
    }, [fetchFees])
  );

  // Filter data based on search and selected tab
  useEffect(() => {
    let filtered = currentMonthData;

    // Filter by status
    if (selectedTab === "Paid") {
      filtered = filtered.filter(item => item.status?.toLowerCase() === "paid");
    } else if (selectedTab === "Pending") {
      filtered = filtered.filter(item => item.status?.toLowerCase() === "pending");
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.studentName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by latest payment first (descending by createdDate)
    filtered = filtered.slice().sort((a, b) => {
      const dateA = new Date(a.createdDate || 0).getTime();
      const dateB = new Date(b.createdDate || 0).getTime();
      return dateB - dateA;
    });

    setFilteredData(filtered);
  }, [selectedTab, searchQuery, feesData]);

  const onDateChange = (event: any, date: any) => {
    setShowPicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFees();
  };

  const handleEdit = (feesId: number) => {
    // Navigate to edit screen or show edit modal
    navigation.navigate("FeesForm", { feesId, mode: "edit" });
  };

  const handleDelete = async (feesId: number) => {
    try {
      await apiClient.delete(`/fees/delete/${feesId}`);
      // Refresh the list after deletion
      fetchFees();
    } catch (error) {
      console.error("Error deleting fees:", error);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <AppHeader
        title="Fees"
        showSearch={true}
        rightIcon="add-outline"
        onRightPress={() => navigation.navigate("FeesForm", { headerTitle: "Fees Form" })}
        onSearchChange={setSearchQuery}
        searchValue={searchQuery}
      />

      <View className="px-4 py-2 bg-gray-50 flex-row justify-between items-center border-b border-[#E5E6EA]">
        <Text className="font-Jost font-bold text-[16px] text-[#111827]">
          {currentMonthName} {currentYear}
        </Text>
        <View className="bg-blue-100 px-2 py-0.5 rounded-md">
          <Text className="text-[10px] font-bold text-blue-700 uppercase">Current Month</Text>
        </View>
      </View>

      <View className="flex flex-row items-center px-2 py-2 border border-[#E5E6EA] bg-white">

        {/* Tabs */}
        <View className="flex flex-row flex-1">
          {tabs.map((item) => {
            const selected = selectedTab === item.value;
            return (
              <TouchableOpacity
                key={item.value}
                onPress={() => setSelectedTab(item.value)}
                className={`flex-1 mx-1 px-1 py-2 rounded-full items-center justify-center
            ${selected ? "bg-[#007BFF]" : "bg-transparent"}`}
              >
                <View className="flex-row items-center">
                  <Text
                    numberOfLines={1}
                    className={
                      selected
                        ? "text-white font-Jost font-medium text-[13px]"
                        : "text-gray-500 font-Jost font-medium text-[13px]"
                    }
                  >
                    {item.label}
                  </Text>
                  <Text
                    className={
                      selected
                        ? "text-white/80 font-Jost font-bold text-[11px] ml-1"
                        : "text-gray-400 font-Jost font-bold text-[11px] ml-1"
                    }
                  >
                    ({item.count})
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* History Icon */}
        <TouchableOpacity
          onPress={() => navigation.navigate("FeesHistory")}
          className="ml-1 p-2"
        >
          <Ionicons name="time-outline" size={24} color="#007BFF" />
        </TouchableOpacity>

        {/* Date Icon always visible on right side */}
        <TouchableOpacity
          onPress={() => setShowPicker(true)}
          className="ml-2 p-2"
        >
          <Ionicons name="calendar-outline" size={24} color="#007BFF" />
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
      </View>

      {loading ? (
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
          {filteredData.length === 0 ? (
            <View className="flex-1 justify-center items-center mt-20">
              <Text className="text-gray-500 text-[16px]">No fees records found</Text>
            </View>
          ) : (
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
                  date={item.createdDate ? new Date(item.createdDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : ""}
                />
              );
            })
          )}
        </ScrollView>
      )}

    </View>
  )
}

export default Fees