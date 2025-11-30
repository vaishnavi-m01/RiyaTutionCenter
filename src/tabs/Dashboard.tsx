import { Image, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from 'react-native-vector-icons/AntDesign';
import Foundation from 'react-native-vector-icons/Foundation';
import { useNavigation } from "@react-navigation/core";



const Dashboard = () => {

  const navigation = useNavigation<any>();
  return (
    <View className="flex-1 bg-white">
      {/* Header Section */}
      <View className="flex-row items-center justify-between px-4 pt-12 pb-6 bg-[#007BFF]">

        <View>
          <Text className="text-white font-Jost font-semibold text-3xl">
            Hi, Riya 👋
          </Text>

          <Text className="text-white/80 font-Jost text-[14px] mt-1">
            Welcome back!
          </Text>
        </View>

        {/* Profile Image */}
        <View className="flex-row  gap-4">

          {/* <TouchableOpacity onPress={() =>navigation.navigate("Settings")}>
            <Ionicons name="settings-sharp" color="#fff" size={24} className="text-center top-4" />

          </TouchableOpacity> */}

          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Image
              source={require("../assets/image/Person.png")}
              style={{ width: 60, height: 60 }}
              className="rounded-full"
            />
          </TouchableOpacity>
        </View>
      </View>


      {/* Optional Divider */}
      <View className="h-[1px] bg-[#F2F4F6] mx-4" />


      <Text className="text-2xl font-bold px-4 mt-4">Dashboard</Text>
      <View className="flex-row gap-2 mt-6 px-2">

        {/* Total Students */}
        <TouchableOpacity className="w-[48%] bg-white rounded-2xl p-4 shadow shadow-black/10 border border-[#E5E6EA]" onPress={() => navigation.navigate("Student")}
        >
          <View className="flex-row items-center justify-between">
            <Ionicons name="people" size={26} color="#007BFF" />

            <Text className="text-lg font-semibold text-[#1A1A1A]">
              Total Students
            </Text>
          </View>

          <Text className="text-3xl font-bold text-[#007BFF] mt-3">120</Text>
          <Text className="text-[#007BFF] text-sm font-medium mt-1">
            +2 New this month
          </Text>
        </TouchableOpacity>

        {/* Today Attendance */}
        <TouchableOpacity className="w-[48%] bg-white rounded-2xl p-4 shadow shadow-black/10 border border-[#E5E6EA]" onPress={() => navigation.navigate("Attendance")}>
          <View className="flex-row items-center gap-1">
            <AntDesign name="checkcircle" size={16} color="#28A745" />
            <Text className="text-lg font-semibold text-[#1A1A1A] flex-wrap">
              Today Attendance
            </Text>

          </View>

          <Text className="text-3xl font-bold text-[#28A745] mt-3">95</Text>
          <Text className="text-red-500 text-sm font-medium mt-1">2 Absent</Text>

        </TouchableOpacity>

      </View>

      {/* Row 2 */}
      <View className="flex-row gap-2 mt-4 px-2">

        {/* Fees Details */}
        <TouchableOpacity className="w-[48%] bg-white rounded-2xl p-4 shadow shadow-black/10 border border-[#E5E6EA]" onPress={() => navigation.navigate("Fees")}>
          <View className="flex-row items-center gap-2">
            <Ionicons name="wallet" size={26} color="#FF8C00" />
            <Text className="text-lg font-semibold text-[#1A1A1A]">
              Fees Details
            </Text>

          </View>

          <Text className="text-3xl font-bold text-[#FF8C00] mt-3">₹45,000</Text>
          <Text className="text-sm text-[#FF8C00] font-medium mt-1">
            12 Students Due
          </Text>
        </TouchableOpacity>

        {/* Birthday Students */}
        <View className="w-[48%] bg-white rounded-2xl p-4 shadow shadow-black/10 border border-[#E5E6EA]">
          <View className="flex-row items-center gap-2">

            <Ionicons name="gift" size={26} color="#E91E63" />
            <Text className="text-lg font-semibold text-[#1A1A1A]">
              Birthdays
            </Text>

          </View>

          <Text className="text-3xl font-bold text-[#E91E63] mt-3">3</Text>
          <Text className="text-[#E91E63] text-sm font-medium mt-1">Send wishes!</Text>
        </View>

      </View>


      <View className="border border-[#E5E6EA] mt-12 mx-4 rounded-lg p-4 bg-white shadow-sm ">
        {/* Header */}
        <Text className="text-xl font-Jost font-bold text-[#111827]">Recent Activity</Text>
        <View className="border-t border-[#E5E6EA] mt-4" />

        <View className="border border-[#E5E6EA] mt-2 mb-2"></View>
        <View className="mt-4 space-y-4 gap-2">


          {/* New Student */}
          <View className="flex-row items-start gap-2">
            <AntDesign name="plussquareo" color="#007BFF" size={24} />
            <View className="flex-1">
              <Text className="text-[#111827] font-Jost text-[16px]">
                New Student added: <Text className="font-semibold text-[#007BFF]">Vaishnavi M.</Text>
              </Text>
              {/* Optional: Standard */}
              {/* <Text className="text-gray-500 text-sm">10th Standard</Text> */}
            </View>
          </View>

          {/* Payment Received */}
          <View className="flex-row items-start gap-2">
            <MaterialIcons name="payment" color="#16A34A" size={24} />
            <View className="flex-1">
              <Text className="text-[#111827] font-Jost text-[16px]">
                Payment received: <Text className="font-semibold text-[#007BFF]">Priya M.</Text>
                <Text className="text-[#16A34A] font-medium"> (₹300)</Text>
              </Text>
            </View>
          </View>

          {/* Attendance Alert */}
          <View className="flex-row items-start gap-2">
            <Foundation name="alert" color="#DC3545" size={24} />
            <View className="flex-1">
              <Text className="text-[#111827] font-Jost text-[16px]">
                Attendance alert: <Text className="font-semibold text-[#DC3545]">Muthu V.</Text> Absent.
              </Text>
            </View>
          </View>

        </View>
      </View>



    </View>
  );
};

export default Dashboard;
