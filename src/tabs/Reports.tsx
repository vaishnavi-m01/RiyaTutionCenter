import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { Text, View, ScrollView, Platform } from "react-native";
import AppHeader from "../utils/AppBar";

const Reports = () => {
     const [reportType, setReportType] = useState("today");
     const [paymentMethod, setPaymentMethod] = useState("all");

     const attendanceData = [
          { date: "2025-11-29", present: 5, total: 5 },
          { date: "2025-11-28", present: 4, total: 5 },
     ];

     const classDistributionData = [
          { className: "Class 10 - Science", students: 2 },
          { className: "Class 12 - Math", students: 1 },
          { className: "Class 8 - General", students: 1 },
          { className: "Class 9 - General", students: 1 },
     ];
     const getPercentage = (record: { present: number; total: number }) =>
          record.total > 0 ? Math.round((record.present / record.total) * 100) : 0;

     const formatDate = (dateStr: string) => {
          const date = new Date(dateStr);
          return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
     };

     const maxStudents = Math.max(...classDistributionData.map(d => d.students));


     return (
          <View className="flex-1 bg-white">
               {/* Header */}
              <AppHeader title="Reports"/>

               {/* Dropdown Row */}
               <ScrollView contentContainerStyle={{paddingBottom:20}} className="px-4" style={{paddingTop:8}}>

            
               <View className="flex-row gap-3">
                    <View
                         style={{
                              borderWidth: 1,
                              borderColor: "#E5E7EB",
                              borderRadius: 12,
                              height: 49,
                              width: 150,
                              overflow: "hidden",
                              backgroundColor: "#fff",
                              justifyContent: "center",
                         }}
                    >
                         <Picker
                              selectedValue={reportType}
                              onValueChange={(v) => setReportType(v)}
                              dropdownIconColor="#374151"
                              style={{ height: 58, width: "100%", color: "#111827" }}
                              mode={Platform.OS === "ios" ? "dialog" : "dropdown"}
                         >
                              <Picker.Item label="Today" value="today" />
                              <Picker.Item label="Weekly" value="weekly" />
                              <Picker.Item label="Monthly" value="monthly" />
                              <Picker.Item label="Yearly" value="yearly" />
                         </Picker>
                    </View>

                    <View
                         style={{
                              borderWidth: 1,
                              borderColor: "#E5E7EB",
                              borderRadius: 12,
                              height: 48,
                              width: 160,
                              overflow: "hidden",
                              backgroundColor: "#fff",
                              justifyContent: "center",
                         }}
                    >
                         <Picker
                              selectedValue={paymentMethod}
                              onValueChange={(v) => setPaymentMethod(v)}
                              dropdownIconColor="#374151"
                              style={{ height: 58, width: "100%", color: "#111827" }}
                              mode={Platform.OS === "ios" ? "dialog" : "dropdown"}
                         >
                              <Picker.Item label="All" value="all" />
                              <Picker.Item label="Cash" value="cash" />
                              <Picker.Item label="UPI" value="upi" />
                         </Picker>
                    </View>
               </View>

               {/* Amount Summary Boxes */}
               <View className="flex-row gap-3 mt-6">
                    <View className="flex-1 bg-white p-5 rounded-2xl border border-[#B5B5B5] shadow-sm" style={{borderColor:"#E5E6EA"}}>
                         <Text className="text-[#6B7280] text-sm">Total Amount</Text>
                         <Text className="text-3xl font-bold text-[#2563EB] mt-1">₹45,000</Text>
                    </View>

                    <View className="flex-1 bg-white p-5 rounded-2xl border border-[#B5B5B5] shadow-sm" style={{borderColor:"#E5E6EA"}}>
                         <Text className="text-[#6B7280] text-sm">Total Cash</Text>
                         <Text className="text-3xl font-bold text-[#16A34A] mt-1">₹12,300</Text>
                    </View>
               </View>


               <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mt-6" style={{borderColor:"#E5E6EA"}}>
                    <Text className="text-lg font-semibold mb-4">Batch Distribution</Text>

                    {classDistributionData.map((item, index) => {
                         const progressWidth = (item.students / maxStudents) * 100; 
                         return (
                              <View key={index} className="mb-3">
                                   <View className="flex-row justify-between mb-1">
                                        <Text className="text-gray-700">{item.className}</Text>
                                        <Text className="text-gray-500">{item.students} Student{item.students > 1 ? "s" : ""}</Text>
                                   </View>
                                   <View className="h-2 w-full bg-gray-200 rounded-full">
                                        <View
                                             className="h-2 bg-[#6366F1] rounded-full"
                                             style={{ width: `${progressWidth}%`,backgroundColor:"#007BFF" }}
                                        />
                                   </View>
                              </View>
                         );
                    })}
               </View>

               {/* Attendance Trends */}
               <Text className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                    Attendance Trends
               </Text>

               {attendanceData.map((record, index) => {
                    const percentage = getPercentage(record);
                    const bgColor = percentage === 100 ? "#DCFCE7" : "#FEF3C7";
                    const textColor = percentage === 100 ? "#16A34A" : "#F59E0B";

                    return (
                         <View
                              key={index}
                              className="flex-row justify-between items-center bg-white p-4 rounded-xl mb-3 border border-gray-200 shadow-sm" style={{borderColor:"#E5E6EA"}}
                         >
                              <Text className="text-gray-500 text-sm">{formatDate(record.date)}</Text>
                              <Text className="text-gray-900 font-semibold">
                                   {record.present} / {record.total} Present
                              </Text>
                              <View
                                   className="px-2 py-1 rounded-full"
                                   style={{ backgroundColor: bgColor }}
                              >
                                   <Text className="text-sm font-semibold" style={{ color: textColor }}>
                                        {percentage}%
                                   </Text>
                              </View>
                         </View>
                    );
               })}
          </ScrollView>
          </View>
     );
};

export default Reports;
