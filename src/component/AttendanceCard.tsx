import { useNavigation } from "@react-navigation/core"
import { Image, Text, TouchableOpacity, View } from "react-native"


type AttendanceCardProps = {
  name: string;
  status: "Present" | "Absent" | null;
  onStatusChange: (status: "Present" | "Absent") => void;
  onPress?: () => void;
}

const AttendanceCard = ({ name, status, onStatusChange, onPress }: AttendanceCardProps) => {
  const navigation = useNavigation<any>()

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 mb-2 shadow-md border border-[#E5E6EA]"
      onPress={onPress || (() => navigation.navigate("StudentDetails"))}
    >

      <View className="flex-row items-center flex-1">
        <Image
          source={require("../assets/image/Person.png")}
          style={{ width: 68, height: 68 }}
          className="rounded-full"
        />

        <Text className="font-Jost font-semibold text-[16px] text-[#111827] ">
          {name}
        </Text>
      </View>



      {/* BOTTOM-RIGHT BUTTONS */}
      <View className="flex-row justify-end space-x-2 gap-2" style={{ top: -8 }}>

        <TouchableOpacity
          onPress={() => onStatusChange("Present")}
          className={`px-4 py-2 rounded-full ${status === "Present" ? "bg-green-500" : "bg-green-100"
            }`}
        >
          <Text
            className={`${status === "Present" ? "text-white" : "text-green-700"
              } font-Jost font-semibold text-[13px]`}
          >
            Present
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onStatusChange("Absent")}
          className={`px-4 py-2 rounded-full ${status === "Absent" ? "bg-red-500" : "bg-red-100"
            }`}
        >
          <Text
            className={`${status === "Absent" ? "text-white" : "text-red-700"
              } font-Jost font-semibold text-[13px]`}
          >
            Absent
          </Text>
        </TouchableOpacity>

      </View>

    </TouchableOpacity>
  )
}

export default AttendanceCard