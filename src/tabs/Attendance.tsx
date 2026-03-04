import { Image, ScrollView, Text, TouchableOpacity, View, ActivityIndicator, Alert, ToastAndroid } from "react-native";
import AppHeader from "../utils/AppBar";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useState, useEffect, useMemo, useCallback } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "react-native-vector-icons/Ionicons";
import AttendanceCard from "../component/AttendanceCard";
import apiClient from "../api/apiBaseUrl";
import { Student } from "../type/type";

type AttendanceRecord = {
  id: number;
  studentId: number;
  date: string;
  status: "Present" | "Absent";
  imageUrl?: string;
};

type MergedStudent = Student & {
  attendanceId?: number;
  attendanceStatus: "Present" | "Absent" | null;
  loading?: boolean;
};

const Attendance = () => {
  const navigation = useNavigation<any>();


  const tabs = ["All", "Present", "Absent"];
  const [selectedTab, setSelectedTab] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<Record<number, AttendanceRecord>>({});
  const [loading, setLoading] = useState(true);

  // Track specific student loading states for smoother UI
  const [studentLoadingMap, setStudentLoadingMap] = useState<Record<number, boolean>>({});

  const apiDate = useMemo(() => selectedDate.toISOString().slice(0, 10), [selectedDate]);

  const displayDate = useMemo(() => {
    const d = selectedDate;
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }, [selectedDate]);

  // Fetch Master Student List
  const fetchStudents = useCallback(async () => {
    try {
      const response = await apiClient.get('/students/all');
      if (Array.isArray(response.data)) {
        const activeStudents = response.data.filter((s: Student) => s.activeStatus === true || s.activeStatus === undefined);
        const sorted = activeStudents.sort((a: Student, b: Student) => b.id - a.id);
        setAllStudents(sorted);
      }
    } catch (error) {
      console.error("Failed to fetch students:", error);
      ToastAndroid.show("Failed to fetch student list", ToastAndroid.SHORT);
    }
  }, []);

  // Fetch Attendance for Date
  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    try {
      // API request: GET /attendance?date=YYYY-MM-DD
      const response = await apiClient.get(`/attendance?date=${apiDate}`);

      const attMap: Record<number, AttendanceRecord> = {};

      if (response.data && Array.isArray(response.data.attendanceList)) {
        response.data.attendanceList.forEach((record: any) => {
          attMap[record.studentId] = {
            id: record.id,
            studentId: record.studentId,
            status: record.status,
            date: record.date,
            imageUrl: record.imageUrl
          };
        });
      }
      setAttendanceMap(attMap);

    } catch (error) {
      console.error("Failed to fetch attendance:", error);
      // If 404 or empty, just clear map
      setAttendanceMap({});
    } finally {
      setLoading(false);
    }
  }, [apiDate]);

  // Refetch attendance when date changes
  useEffect(() => {
    fetchAttendance();
  }, [apiDate, fetchAttendance]);

  useFocusEffect(
    useCallback(() => {
      fetchStudents();
      fetchAttendance();
    }, [fetchStudents, fetchAttendance])
  );


  const onDateChange = (event: any, date: any) => {
    setShowPicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const markAttendance = async (student: MergedStudent, status: "Present" | "Absent") => {
    // Optimistic Update
    setStudentLoadingMap(prev => ({ ...prev, [student.id]: true }));

    // Store previous state for rollback
    const previousRecord = attendanceMap[student.id];

    // Optimistically update map
    setAttendanceMap(prev => ({
      ...prev,
      [student.id]: {
        ...prev[student.id],
        studentId: student.id,
        status: status,
        date: apiDate,
        id: prev[student.id]?.id || 0
      } as AttendanceRecord
    }));

    try {
      if (student.attendanceId) {
        // UPDATE (PUT)
        await apiClient.put(`/attendance/${student.attendanceId}`, {
          id: student.attendanceId,
          studentId: student.id,
          status: status,
          date: apiDate
        });
      } else {
        // CREATE (POST)
        const response = await apiClient.post("/attendance", {
          id: 0,
          studentId: student.id,
          status: status,
          date: apiDate
        });

        // Update with real ID from server so future updates work
        if (response.data && response.data.id) {
          setAttendanceMap(prev => ({
            ...prev,
            [student.id]: { ...prev[student.id], id: response.data.id }
          }));
        }
      }
      ToastAndroid.show("Attendance successfully", ToastAndroid.SHORT);
    } catch (error) {
      console.error("Failed to mark attendance:", error);
      ToastAndroid.show("Failed to update status", ToastAndroid.SHORT);

      // Rollback
      setAttendanceMap(prev => {
        const newMap = { ...prev };
        if (previousRecord) {
          newMap[student.id] = previousRecord;
        } else {
          delete newMap[student.id];
        }
        return newMap;
      });
    } finally {
      setStudentLoadingMap(prev => ({ ...prev, [student.id]: false }));
    }
  };



  // Merge Data
  const mergedList: MergedStudent[] = useMemo(() => {
    return allStudents.map(student => {
      const record = attendanceMap[student.id];
      return {
        ...student,
        attendanceId: record?.id,
        attendanceStatus: record?.status || null,
        loading: studentLoadingMap[student.id]
      };
    });
  }, [allStudents, attendanceMap, studentLoadingMap]);

  // Filter Data
  const filteredList = useMemo(() => {
    let list = mergedList;

    // Filter by Tab
    if (selectedTab !== "All") {
      list = list.filter(s => s.attendanceStatus === selectedTab);
    }

    // Filter by Search
    if (searchText.trim()) {
      const lowerSearch = searchText.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(lowerSearch));
    }

    return list;
  }, [selectedTab, mergedList, searchText]);

  // Stats
  const stats = useMemo(() => {
    const present = mergedList.filter(s => s.attendanceStatus === "Present").length;
    const absent = mergedList.filter(s => s.attendanceStatus === "Absent").length;
    return { All: mergedList.length, Present: present, Absent: absent };
  }, [mergedList]);


  return (
    <View className="flex-1 bg-white">
      <AppHeader
        title="Attendance"
        showSearch={true}
        searchValue={searchText}
        onSearchChange={setSearchText}
      />

      <View className="flex flex-row items-center px-2 py-2 border border-[#E5E6EA] bg-white">
        {/* 3 Tabs */}
        <View className="flex flex-row flex-1">
          {tabs.map((item) => {
            const selected = selectedTab === item;
            const count = stats[item as keyof typeof stats];

            return (
              <TouchableOpacity
                key={item}
                onPress={() => setSelectedTab(item)}
                className={`flex-1 mx-1 px-2 py-2 rounded-full items-center flex-row justify-center gap-2
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
                <View className={`px-2 py-0.5 rounded-full ${selected ? "bg-white/30" : "bg-gray-200"}`}>
                  <Text className={`text-xs ${selected ? "text-white" : "text-gray-600"}`}>{count}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Date Icon - Only Icon */}
        <TouchableOpacity
          onPress={() => setShowPicker(true)}
          className="ml-2 p-2"
        >
          <Ionicons name="calendar-outline" size={24} color="#007BFF" />
        </TouchableOpacity>
      </View>

      {/* Selected Date Display Row */}
      <View className="px-4 py-2 bg-white border-b border-[#E5E6EA]">
        <Text className="text-[#111827] font-semibold text-[16px] font-Jost">
          Date: {displayDate}
        </Text>
      </View>

      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          maximumDate={new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      {loading && allStudents.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      ) : (
        <ScrollView className="px-4 mt-4" contentContainerStyle={{ paddingBottom: 20 }}>
          {filteredList.map((item) => (
            <AttendanceCard
              key={item.id}
              name={item.name}
              imageUrl={item.imageUrl}
              status={item.attendanceStatus}
              onStatusChange={(status) => markAttendance(item, status)}
              onPress={() => navigation.navigate("StudentDetails", { student: item })}
            />
          ))}

          {filteredList.length === 0 && (
            <View className="items-center mt-10">
              <Text className="text-gray-400">No students found</Text>
            </View>
          )}
        </ScrollView>
      )}

    </View>
  );
};

export default Attendance;