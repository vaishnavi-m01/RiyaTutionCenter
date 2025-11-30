import { useNavigation } from "@react-navigation/core"
import { Image, Text, TouchableOpacity, View } from "react-native"


type data = {
    name:string;
}
const AttendanceCard = ({name}:data) =>{
      const navigation = useNavigation<any>()
    
    return(
          <TouchableOpacity
          className="bg-white rounded-2xl p-4 mb-2 shadow-md border border-[#E5E6EA]"
          onPress={() => navigation.navigate("StudentDetails")}
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
          <View className="flex-row justify-end space-x-2 gap-2" style={{top:-8}}>

            <TouchableOpacity className="bg-green-100 px-4 py-2 rounded-full">
              <Text className="text-green-700 font-Jost font-semibold text-[13px]">
                Present
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-red-100 px-4 py-2 rounded-full">
              <Text className="text-red-700 font-Jost font-semibold text-[13px]">
                Absent
              </Text>
            </TouchableOpacity>

          </View>

        </TouchableOpacity>
    )
}

export default AttendanceCard