import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import AppHeader from "../utils/AppBar"
import { useNavigation } from "@react-navigation/core"
import { useState } from "react"
import FeesCard from "../component/FeesCard";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "react-native-vector-icons/Ionicons";
import AttendanceCard from "../component/AttendanceCard";

const feesData = [
  { id: "1", name: "Vaishnavi M", image: "../assets/image/Person.png"},
  { id: "2", name: "Arjun K", image: "../assets/image/Person.png" },
  { id: "3", name: "Sahana R", image: "../assets/image/Person.png" },
  { id: "4", name: "Raghav P", image: "../assets/image/Person.png"
    
  }
];


const Fees = () => {
  const navigation = useNavigation<any>()
  const tabs = ["All", "Present", "Absent"];
  const [selectedTab, setSelectedTab] = useState("All");
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());


  const onDateChange = (event: any, date: any) => {
    setShowPicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <AppHeader title="Attendance" showSearch={true}
      />

      <View className="flex flex-row items-center px-2 py-2 border border-[#E5E6EA] bg-white">

        {/* 3 Tabs */}
        <View className="flex flex-row flex-1">
          {tabs.map((item) => {
            const selected = selectedTab === item;
            return (
              <TouchableOpacity
                key={item}
                onPress={() => setSelectedTab(item)}
                className={`flex-1 mx-1 px-4 py-2 rounded-full items-center 
            ${selected ? "bg-[#007BFF]" : "bg-transparent"}`}
              >
                <Text
                  className={
                    selected
                      ? "text-white font-Jost font-medium text-[15px]"
                      : "text-gray-500 font-Jost font-medium text-[15px]"
                  }
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

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


      <ScrollView className="px-4 mt-4">
        {feesData.map((item) => (
          <AttendanceCard
            key={item.id}
            name={item.name}
         
          />
        ))}
      



      </ScrollView>


    </View>
  )
}

export default Fees