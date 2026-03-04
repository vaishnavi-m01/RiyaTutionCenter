import { Image, Text, TouchableOpacity, View } from "react-native"
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import { useRef } from "react";
import RBSheet from "react-native-raw-bottom-sheet";
import { Student } from "../type/type";
import { formatDate } from "../utils/dateFormatter";


interface RBSheetRef {
    open: () => void;
    close: () => void;
}

interface StudentInfoProps {
    student: Student;
}

const StudentInfo = ({ student }: StudentInfoProps) => {
    const refRBSheet = useRef<RBSheetRef>(null);

    const openFilterSheet = () => refRBSheet.current?.open();

    return (
        <View className="w-full">
            <TouchableOpacity onPress={openFilterSheet}>
                <View className="border border-[#E5E6EA] rounded-xl p-3 mb-4 bg-white">
                    <View className="flex-row gap-1 justify-between items-start pb-2">

                        <View className="items-center">
                            <Image
                                source={student.imageUrl ? { uri: student.imageUrl } : require("../assets/image/Person.png")}
                                style={{ width: 73, height: 73 }}
                                className="rounded-full"
                            />
                        </View>


                        <View className="flex-1 py-2 px-3">
                            <Text className="font-Jost font-medium text-[16px] text-[#111827]">{student.name}</Text>
                            <Text className="font-Jost text-[#6B7280] font-medium text-[13px]">+{student.phone}</Text>


                            <View className="flex-row gap-3 mt-4">

                                {/* Status Badge */}
                                <View className={`rounded-full px-4 py-1.5 flex-row items-center border ${student.activeStatus ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                                    }`}>
                                    <View
                                        style={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: 4,
                                            backgroundColor: student.activeStatus ? "#22C55E" : "#EF4444",
                                            marginRight: 6,
                                        }}
                                    />
                                    <Text className={`text-[12px] font-semibold ${student.activeStatus ? "text-green-700" : "text-red-700"
                                        }`}>
                                        {student.activeStatus ? "Active" : "Inactive"}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View className="items-end pt-2">
                            <View className="flex-row gap-2 mb-2">
                                <TouchableOpacity>
                                    <Fontisto name="whatsapp" color="#25D366" size={26} />
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>
                </View>

            </TouchableOpacity>


            {/* Bottom Sheet */}
            <RBSheet
                ref={refRBSheet}
                height={480}
                openDuration={250}
                draggable
                closeOnPressMask
                customStyles={{
                    wrapper: { backgroundColor: "rgba(0,0,0,0.5)" },
                    container: {
                        backgroundColor: "#fff",
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        overflow: "visible"
                    },
                    draggableIcon: { backgroundColor: "#cbd5e1" },
                }}
            >
                {/* Header */}
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingHorizontal: 20,
                        paddingTop: 10,
                        paddingBottom: 12,
                        borderBottomWidth: 1,
                        borderBottomColor: "#e2e8f0"
                    }}
                >
                    <Text className="text-[#111827] font-Jost text-[20px] font-medium">
                        Student Details
                    </Text>
                </View>

                {/* Content */}
                <View className="px-4 mt-4">
                    <View className="flex-row gap-4">

                        {/* LEFT COLUMN */}
                        <View className="flex-1">
                            <Text className="text-[#6B7280] font-Jost text-[13px]">Full Name</Text>
                            <Text className="text-[#111827] font-Jost font-medium text-[15px] mb-4">{student.name}</Text>

                            <Text className="text-[#6B7280] font-Jost text-[13px]">Gender</Text>
                            <Text className="text-[#111827] font-Jost font-medium text-[15px] mb-4">{student.gender}</Text>

                            <Text className="text-[#6B7280] font-Jost text-[13px]">Date of Birth</Text>
                            <Text className="text-[#111827] font-Jost font-medium text-[15px] mb-4">{student.dateOfBirth || "N/A"}</Text>

                            <Text className="text-[#6B7280] font-Jost text-[13px]">Joining Date</Text>
                            <Text className="text-[#111827] font-Jost font-medium text-[15px] mb-4">{student.joiningDate || "N/A"}</Text>

                            <Text className="text-[#6B7280] font-Jost text-[13px]">Phone</Text>
                            <Text className="text-[#111827] font-Jost font-medium text-[15px]">+{student.phone}</Text>
                        </View>

                        {/* RIGHT COLUMN */}
                        <View className="flex-1">
                            <Text className="text-[#6B7280] font-Jost text-[13px]">Standard</Text>
                            <Text className="text-[#111827] font-Jost font-medium text-[15px] mb-4">{student.standardName || "N/A"}</Text>

                            <Text className="text-[#6B7280] font-Jost text-[13px]">Medium</Text>
                            <Text className="text-[#111827] font-Jost font-medium text-[15px] mb-4">{student.mediumName || "N/A"}</Text>

                            <Text className="text-[#6B7280] font-Jost text-[13px]">Age</Text>
                            <Text className="text-[#111827] font-Jost font-medium text-[15px] mb-4">{student.age || "N/A"}</Text>

                            <Text className="text-[#6B7280] font-Jost text-[13px]">School</Text>
                            <Text className="text-[#111827] font-Jost font-medium text-[15px] mb-4 flex-wrap">{student.school || "N/A"}</Text>

                            <Text className="text-[#6B7280] font-Jost text-[13px]">Place</Text>
                            <Text className="text-[#111827] font-Jost font-medium text-[15px] mb-4">{student.place || "N/A"}</Text>

                            <Text className="text-[#6B7280] font-Jost text-[13px]">Address</Text>
                            <Text className="text-[#111827] font-Jost font-medium text-[15px] flex-wrap">{student.address || "N/A"}</Text>
                        </View>
                    </View>

                    {/* BOTTOM ROW - Dates */}
                    <View className="flex-row gap-4 mt-6">
                        <View className="flex-1">
                            <Text className="text-[#6B7280] font-Jost text-[13px]">Created Date</Text>
                            <Text className="text-[#111827] font-Jost font-medium text-[15px]">{formatDate(student.createdDate)}</Text>
                        </View>

                        <View className="flex-1">
                            <Text className="text-[#6B7280] font-Jost text-[13px]">Modified Date</Text>
                            <Text className="text-[#111827] font-Jost font-medium text-[15px]">{formatDate(student.modifiedDate)}</Text>
                        </View>
                    </View>
                </View>

            </RBSheet>

        </View>
    )
}


export default StudentInfo
