import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform, Image, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../utils/AppBar';
import { Picker } from "@react-native-picker/picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CameraOptions, ImageLibraryOptions, launchCamera, launchImageLibrary, MediaType } from 'react-native-image-picker';
import RBSheet from 'react-native-raw-bottom-sheet';



interface RBSheetRef {
  open: () => void;
  close: () => void;
}

const CreateStudent = () => {
  const insets = useSafeAreaInsets();

  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('');
  const [standard, setStandard] = useState("");
  const [school, setSchool] = useState("");
  const [medium, setMedium] = useState("");
  const [age, setAge] = useState("");
  const [place, setPlace] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState('Active');
  const [joingingDate, setJoingingDate] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);



  const [dob, setDob] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showDobPicker, setShowDobPicker] = useState(false);
  const [showJoinPicker, setShowJoinPicker] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const refRBSheet = useRef<RBSheetRef>(null);

  const openFilterSheet = () => refRBSheet.current?.open();
  const closeSheet = () => refRBSheet.current?.close();

  const standards = [
    "LKG",
    "UKG",
    ...Array.from({ length: 12 }, (_, i) => {
      const num = i + 1;
      const suffix =
        num === 1 ? "st" :
          num === 2 ? "nd" :
            num === 3 ? "rd" : "th";
      return `${num}${suffix}`;
    }),
  ];


  const onChange = (event: any, selectedDate: any) => {
    setShowPicker(false);
    if (selectedDate) {
      const formatted = selectedDate.toISOString().slice(0, 10); // YYYY-MM-DD
      setDob(formatted);
    }
  };


  const onChangeJoingingDate = (event: any, selectedDate: any) => {
    setShowPicker(false);
    if (selectedDate) {
      const formatted = selectedDate.toISOString().slice(0, 10); // YYYY-MM-DD
      setJoingingDate(formatted);
    }
  };



  const handleSave = () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Validation', 'Please enter name and phone');
      return;
    }
    navigation.goBack();
  };



  const handlePickFromGallery = () => {
    const options: ImageLibraryOptions = {
      mediaType: "photo",
      quality: 1,
    };

    launchImageLibrary(options, (res) => {
      if (!res.didCancel && res.assets && res.assets[0]) {
        setProfileImage(res.assets[0].uri || null);
        closeSheet();
      }
    });
  };

  /* ---------------- Camera ---------------- */
  const handleOpenCamera = () => {
    const options: CameraOptions = {
      mediaType: "photo",
      quality: 1,
      saveToPhotos: true,
    };

    launchCamera(options, (res) => {
      if (!res.didCancel && res.assets && res.assets[0]) {
        setProfileImage(res.assets[0].uri || null);
        closeSheet();
      }
    });
  };


  return (
    <View className='flex-1 bg-white'>
      <AppHeader title='New Student' />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}

      >
        <ScrollView
          className="px-4 pt-4"
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* Name */}

          {/* Profile Image */}
          <View className="items-center mt-6 mb-8">
            <View
              style={{
                width: 120,
                height: 120,
                position: "relative",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={
                  profileImage
                    ? { uri: profileImage }
                    : require("../assets/image/Person.png")
                }
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  shadowColor: "#000",
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 4 }
                }}
              />

              {/* Camera Icon */}
              <TouchableOpacity
                onPress={openFilterSheet}
                style={{
                  position: "absolute",
                  bottom: 6,
                  right: 6,
                  backgroundColor: "#fff",
                  padding: 8,
                  borderRadius: 9999,
                  borderWidth: 1,
                  borderColor: "#D1D5DB",
                  elevation: 3
                }}
              >
                <Ionicons name="camera" size={20} color="#000" />
              </TouchableOpacity>
            </View>


          </View>


          <Text className="text-[15px] text-[#111827] font-medium mb-2 mt-3">Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Full name"
            className="border border-[#E0E5E9] rounded-xl p-3 text-[#000]"
          />

          {/* Standard */}
          <Text className="text-[15px] text-[#111827] font-medium mb-2 mt-3">Standard</Text>
          <View className="border border-[#E5E6EA] rounded-xl px-2">
            <Picker
              selectedValue={standard}
              onValueChange={setStandard}
              style={{ height: 50 }}
            >
              <Picker.Item label="Select Standard" value="" />
              {standards.map((item) => (
                <Picker.Item key={item} label={item} value={item} />
              ))}
            </Picker>
          </View>

          {/* School */}
          <Text className="text-[15px] text-[#111827] font-medium mb-2 mt-3">School</Text>
          <TextInput
            value={school}
            onChangeText={setSchool}
            placeholder="School"
            className="border border-[#E0E5E9] rounded-xl p-3 text-[#000]"
          />

          {/* Medium */}
          <Text className="text-[15px] text-[#111827] font-medium mb-2 mt-3">Medium</Text>
          <View className="border border-[#E5E6EA] rounded-xl">
            <Picker selectedValue={medium} onValueChange={setMedium} style={{ height: 50 }}>
              <Picker.Item label="Select Medium" value="" />
              <Picker.Item label="Tamil" value="Tamil" />
              <Picker.Item label="English" value="English" />
            </Picker>
          </View>

          {/* Age */}
          <Text className="text-[15px] text-[#111827] font-medium mb-2 mt-3">Age</Text>
          <TextInput
            value={age}
            onChangeText={setAge}
            placeholder="Age"
            keyboardType="number-pad"
            className="border border-[#E0E5E9] rounded-xl p-3 text-[#000]"
          />

          {/* Gender */}
          <Text className="text-[15px] text-[#111827] font-medium mb-2 mt-3">Gender</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: "#E0E5E9",
              borderRadius: 10,
              paddingVertical: 14,
              paddingHorizontal: 14,
              flexDirection: "row",
              alignItems: "center",
              gap: 32
              // justifyContent: "space-between",  
            }}
          >
            {/* Male */}
            <TouchableOpacity onPress={() => setGender("Male")} style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name={gender === "Male" ? "radio-button-on" : "radio-button-off"}
                size={22}
                color={gender === "Male" ? "#2563EB" : "#888"}
              />
              <Text style={{ marginLeft: 6, fontSize: 14, color: "#111827" }}>Male</Text>
            </TouchableOpacity>

            {/* Female */}
            <TouchableOpacity onPress={() => setGender("Female")} style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name={gender === "Female" ? "radio-button-on" : "radio-button-off"}
                size={22}
                color={gender === "Female" ? "#2563EB" : "#888"}
              />
              <Text style={{ marginLeft: 6, fontSize: 14, color: "#111827" }}>Female</Text>
            </TouchableOpacity>
          </View>

          {/* DOB */}
          <Text className="text-[15px] text-[#111827] font-medium mb-2 mt-3">Date of Birth</Text>
          <TouchableOpacity onPress={() => setShowDobPicker(true)} className="border border-[#E0E5E9] rounded-xl p-3">
            <Text className="text-[#000]">{dob || "Select Date of Birth"}</Text>
          </TouchableOpacity>
          {showDobPicker && (
            <DateTimePicker
              value={dob ? new Date(dob) : new Date()}
              mode="date"
              display="calendar"
              onChange={(e, date) => {
                setShowDobPicker(false);
                if (date) setDob(date.toISOString().slice(0, 10));
              }}
            />
          )}

          {/* Phone */}
          <Text className="text-[15px] text-[#111827] font-medium mb-2 mt-3">Phone</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone number"
            keyboardType="phone-pad"
            className="border border-[#E0E5E9] rounded-xl p-3 text-[#000]"
          />

          {/* Place */}
          <Text className="text-[15px] text-[#111827] font-medium mb-2 mt-3">Place</Text>
          <TextInput
            value={place}
            onChangeText={setPlace}
            placeholder="Place"
            className="border border-[#E0E5E9] rounded-xl p-3 text-[#000]"
          />

          {/* Address */}
          <Text className="text-[15px] text-[#111827] font-medium mb-2 mt-3">Address</Text>
          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder="Address"
            multiline
            className="border border-[#E0E5E9] rounded-xl p-3 text-[#000] h-28"
            textAlignVertical="top"
          />

          {/* Joining Date */}
          <Text className="text-[15px] text-[#111827] font-medium mb-2 mt-3">Joining Date</Text>
          <TouchableOpacity onPress={() => setShowJoinPicker(true)} className="border border-[#E0E5E9] rounded-xl p-3">
            <Text className="text-[#000]">{joingingDate || "Select Joining Date"}</Text>
          </TouchableOpacity>

          {showJoinPicker && (
            <DateTimePicker
              value={joingingDate ? new Date(joingingDate) : new Date()}
              mode="date"
              display="calendar"
              onChange={(e, date) => {
                setShowJoinPicker(false);
                if (date) setJoingingDate(date.toISOString().slice(0, 10));
              }}
            />
          )}

          {/* Status */}
          <Text className="text-[15px] text-[#111827] font-medium mb-2 mt-3">Status</Text>
          <View className="flex-row gap-3 mb-8">
            <TouchableOpacity onPress={() => setStatus("Active")} className={`px-4 py-2 rounded-full ${status === "Active" ? "bg-[#007BFF]" : "bg-gray-200"}`}>
              <Text className={`${status === "Active" ? "text-white" : "text-gray-700"}`}>Active</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setStatus("Inactive")} className={`px-4 py-2 rounded-full ${status === "Inactive" ? "bg-[#007BFF]" : "bg-gray-200"}`}>
              <Text className={`${status === "Inactive" ? "text-white" : "text-gray-700"}`}>Inactive</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>

      </KeyboardAvoidingView>


      <View
        style={{
          position: "absolute",
          bottom: insets.bottom || 10,
          left: 0,
          right: 0,
          backgroundColor: "#fff",
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderTopWidth: 1,
          borderColor: "#ddd",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 100,
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            marginRight: 8,
            backgroundColor: "#ccc",
            paddingVertical: 12,
            borderRadius: 10,
            alignItems: "center",
          }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: "#333", fontWeight: "600" }}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={loading}
          style={{
            flex: 1,
            marginLeft: 8,
            backgroundColor: loading ? "#9CA3AF" : "#007BFF",
            paddingVertical: 12,
            borderRadius: 10,
            alignItems: "center",
            opacity: loading ? 0.8 : 1,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            {loading ? "Processing..." : "Publish"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* modal */}
      <RBSheet
        ref={refRBSheet}
        height={220}
        openDuration={250}
        draggable
        closeOnPressMask
        customStyles={{
          wrapper: { backgroundColor: "rgba(0,0,0,0.5)" },
          container: {
            backgroundColor: "#fff",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingBottom: 20,
          },
          draggableIcon: { backgroundColor: "#cbd5e1" },
        }}
      >
        <View className="px-4 mt-4">
          <Text className="text-lg font-semibold text-[#111827] mb-4">
            Select Option
          </Text>

          {/* Camera */}
          <TouchableOpacity
            onPress={handleOpenCamera}
            className="flex-row items-center gap-3 p-4 bg-[#F3F4F6] rounded-xl mb-3"
          >
            <Ionicons name="camera" size={24} color="#007BFF" />
            <Text className="text-[#111827] text-[16px]">Open Camera</Text>
          </TouchableOpacity>

          {/* Gallery */}
          <TouchableOpacity
            onPress={handlePickFromGallery}
            className="flex-row items-center gap-3 p-4 bg-[#F3F4F6] rounded-xl"
          >
            <Ionicons name="image" size={24} color="#007BFF" />
            <Text className="text-[#111827] text-[16px]">Choose from Gallery</Text>
          </TouchableOpacity>
        </View>
      </RBSheet>


    </View>

  );
};

export default CreateStudent;
