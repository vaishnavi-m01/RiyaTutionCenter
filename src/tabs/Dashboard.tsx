import { Image, Text, TouchableOpacity, View, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Foundation from 'react-native-vector-icons/Foundation';
import { useNavigation } from "@react-navigation/core";
import { useState, useEffect, useCallback } from "react";
import apiClient from "../api/apiBaseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const Dashboard = () => {

  const navigation = useNavigation<any>();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [birthdays, setBirthdays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [adminProfile, setAdminProfile] = useState<any>(null);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardResponse, activitiesResponse, birthdaysResponse] = await Promise.all([
        apiClient.get('api/dashboard'),
        apiClient.get('api/dashboard/recent-activities'),
        apiClient.get('/students/birthdays/today')
      ]);

      if (dashboardResponse.data) {
        setDashboardData(dashboardResponse.data);
      }

      if (activitiesResponse.data) {
        setRecentActivities(activitiesResponse.data);
      }

      if (birthdaysResponse.data) {
        setBirthdays(birthdaysResponse.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch admin profile
  const fetchAdminProfile = async () => {
    try {
      const id = await AsyncStorage.getItem("adminId");
      if (id) {
        const response = await apiClient.get(`/admin/getbyid/${id}`);
        if (response.data) {
          setAdminProfile(response.data);
        }
      }
    } catch (error) {
      console.error("Error fetching admin profile:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchAdminProfile();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
      fetchAdminProfile();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "PAYMENT":
        return <MaterialIcons name="payment" color="#16A34A" size={24} />;
      case "ATTENDANCE":
        return <Foundation name="alert" color="#DC3545" size={24} />;
      case "NEW_STUDENT":
        return <AntDesign name="plussquareo" color="#007BFF" size={24} />;
      default:
        return <Ionicons name="information-circle" color="#6B7280" size={24} />;
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header Section */}
      <View className="flex-row items-center justify-between px-4 pt-12 pb-6 bg-[#007BFF]">
        <View>
          <Text className="text-white font-Jost font-semibold text-3xl">
            Hi, {adminProfile?.name || "Riya"} 👋
          </Text>
          <Text className="text-white/80 font-Jost text-[14px] mt-1">
            Welcome back!
          </Text>
        </View>

        <View className="flex-row gap-4">
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Image
              source={
                adminProfile?.imageUrl
                  ? { uri: adminProfile.imageUrl }
                  : require("../assets/image/Person.png")
              }
              style={{ width: 60, height: 60 }}
              className="rounded-full"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View className="h-[1px] bg-[#F2F4F6] mx-4" />

      {loading && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text className="text-2xl font-bold px-4 mt-4">Dashboard</Text>
          <View className="flex-row gap-2 mt-6 px-2">
            <TouchableOpacity
              className="w-[48%] bg-white rounded-2xl p-4 shadow shadow-black/10 border border-[#E5E6EA]"
              onPress={() => navigation.navigate("Student")}
            >
              <View className="flex-row items-center justify-between">
                <Ionicons name="people" size={26} color="#007BFF" />
                <Text className="text-lg font-semibold text-[#1A1A1A]">Total Students</Text>
              </View>
              <Text className="text-3xl font-bold text-[#007BFF] mt-3">
                {dashboardData?.totalStudents || 0}
              </Text>
              <Text className="text-[#007BFF] text-sm font-medium mt-1">
                +{dashboardData?.newStudentsThisMonth || 0} New this month
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-[48%] bg-white rounded-2xl p-4 shadow shadow-black/10 border border-[#E5E6EA]"
              onPress={() => navigation.navigate("Attendance")}
            >
              <View className="flex-row items-center gap-1">
                <AntDesign name="checkcircle" size={16} color="#28A745" />
                <Text className="text-lg font-semibold text-[#1A1A1A] flex-wrap">Today Attendance</Text>
              </View>
              <Text className="text-3xl font-bold text-[#28A745] mt-3">
                {dashboardData?.presentToday || 0}
              </Text>
              <Text className="text-red-500 text-sm font-medium mt-1">
                {dashboardData?.absentToday || 0} Absent
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row gap-2 mt-4 px-2">
            <TouchableOpacity
              className="w-[48%] bg-white rounded-2xl p-4 shadow shadow-black/10 border border-[#E5E6EA]"
              onPress={() => navigation.navigate("Fees")}
            >
              <View className="flex-row items-center gap-2">
                <Ionicons name="wallet" size={26} color="#FF8C00" />
                <Text className="text-lg font-semibold text-[#1A1A1A]">Fees Details</Text>
              </View>
              <Text className="text-3xl font-bold text-[#FF8C00] mt-3">
                ₹{dashboardData?.totalFeesDue || 0}
              </Text>
              <View className="flex-row items-center gap-2 mt-1">
                <Text className="text-xs text-[#16A34A] font-medium bg-green-50 px-2 py-0.5 rounded-full">
                  {dashboardData?.paidStudentsThisMonth || 0} Paid
                </Text>
                <Text className="text-xs text-[#DC3545] font-medium bg-red-50 px-2 py-0.5 rounded-full">
                  {dashboardData?.pendingStudentsThisMonth || 0} Pending
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Student', { initialSearch: 'birthday' })}
              className="w-[48%] bg-white rounded-2xl p-4 shadow shadow-black/10 border border-[#E5E6EA]"
            >
              <View className="flex-row items-center gap-2">
                <View className="bg-pink-100 p-2 rounded-xl">
                  <FontAwesome name="birthday-cake" size={20} color="#E91E63" />
                </View>
                <Text className="text-lg font-semibold text-[#1A1A1A]">Birthdays</Text>
              </View>
              <Text className="text-3xl font-bold text-[#E91E63] mt-3">{birthdays.length}</Text>
              {birthdays.length > 0 ? (
                <Text className="text-sm text-[#E91E63] mt-1 font-medium italic">Send wishes!</Text>
              ) : (
                <Text className="text-sm text-[#94A3B8] mt-1">None today</Text>
              )}
            </TouchableOpacity>
          </View>

          <View className="px-4 mt-8 mb-2 flex-row items-center justify-between">
            <View>
              <Text className="text-[18px] font-Jost font-bold text-[#111827]">
                {new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}
              </Text>
              <Text className="text-[12px] font-Jost text-gray-500">Monthly Fee Status</Text>
            </View>
            <View className="bg-blue-50 px-3 py-1 rounded-full">
              <Text className="text-[11px] font-bold text-[#007BFF]">Live Updates</Text>
            </View>
          </View>

          <View className="px-2">
            <View className="flex-row gap-2">
              <View className="flex-1 bg-white rounded-2xl p-4 border border-[#E5E6EA] shadow-sm">
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-[14px] font-bold text-gray-800">Paid</Text>
                  <View className="bg-green-100 px-2 py-0.5 rounded-full">
                    <Text className="text-[10px] font-bold text-green-700">{dashboardData?.paidStudentNames?.length || 0}</Text>
                  </View>
                </View>
                <View className="max-h-40">
                  <ScrollView nestedScrollEnabled={true}>
                    <View className="flex-row flex-wrap gap-1.5">
                      {dashboardData?.paidStudentNames?.length > 0 ? (
                        dashboardData.paidStudentNames.map((name: string, i: number) => (
                          <View key={i} className="bg-green-50 px-2 py-1 rounded-lg border border-green-100 flex-row items-center gap-1">
                            <Ionicons name="checkmark-circle" size={12} color="#16A34A" />
                            <Text className="text-[12px] text-green-700 font-medium">{name}</Text>
                          </View>
                        ))
                      ) : (
                        <Text className="text-[12px] text-gray-400 italic">No payments yet</Text>
                      )}
                    </View>
                  </ScrollView>
                </View>
              </View>

              <View className="flex-1 bg-white rounded-2xl p-4 border border-[#E5E6EA] shadow-sm">
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-[14px] font-bold text-gray-800">Pending</Text>
                  <View className="bg-red-100 px-2 py-0.5 rounded-full">
                    <Text className="text-[10px] font-bold text-red-700">{dashboardData?.pendingStudentNames?.length || 0}</Text>
                  </View>
                </View>
                <View className="max-h-40">
                  <ScrollView nestedScrollEnabled={true}>
                    <View className="flex-row flex-wrap gap-1.5">
                      {dashboardData?.pendingStudentNames?.length > 0 ? (
                        dashboardData.pendingStudentNames.map((name: string, i: number) => (
                          <View key={i} className="bg-red-50 px-2 py-1 rounded-lg border border-red-100 flex-row items-center gap-1">
                            <Ionicons name="alert-circle" size={12} color="#DC3545" />
                            <Text className="text-[12px] text-red-700 font-medium">{name}</Text>
                          </View>
                        ))
                      ) : (
                        <Text className="text-[12px] text-gray-400 italic">No pending fees</Text>
                      )}
                    </View>
                  </ScrollView>
                </View>
              </View>
            </View>
          </View>

          <View className="border border-[#E5E6EA] mt-12 mx-4 rounded-lg p-4 bg-white shadow-sm mb-6">
            <Text className="text-xl font-Jost font-bold text-[#111827]">Recent Activity</Text>
            <View className="border-t border-[#E5E6EA] mt-4" />
            <View className="mt-4 space-y-4 gap-2">
              {recentActivities.length === 0 ? (
                <Text className="text-gray-500 text-center py-4">No recent activities</Text>
              ) : (
                recentActivities.map((activity, index) => (
                  <View key={index} className="flex-row items-start gap-2">
                    {getActivityIcon(activity.type)}
                    <View className="flex-1">
                      <Text className="text-[#111827] font-Jost text-[16px]">
                        {activity.title}:{" "}
                        <Text className={`font-semibold ${activity.type === "PAYMENT" ? "text-[#16A34A]" : activity.type === "ATTENDANCE" ? "text-[#DC3545]" : "text-[#007BFF]"}`}>
                          {activity.studentName}
                        </Text>
                        {activity.amount && (
                          <Text className="text-[#16A34A] font-medium"> (₹{activity.amount})</Text>
                        )}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default Dashboard;
