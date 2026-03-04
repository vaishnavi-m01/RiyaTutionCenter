import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform, Image, Modal, Keyboard, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../utils/AppBar';
import { Picker } from "@react-native-picker/picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CameraOptions, ImageLibraryOptions, launchCamera, launchImageLibrary, MediaType } from 'react-native-image-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import apiClient from '../api/apiBaseUrl';
import config from '../config/enviroment';
import { useRoute } from '@react-navigation/native';
import { Student } from '../type/type';
import { formatToBackendDate, formatToUIDate } from '../utils/dateFormatter';
import { uploadToCloudinary } from '../utils/cloudinary';



interface RBSheetRef {
  open: () => void;
  close: () => void;
}


type Standard = {
  id: number;
  name: string;
};

type Medium = {
  id: number;
  name: string;
}

const CreateStudent = () => {
  const insets = useSafeAreaInsets();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const editStudent: Student | undefined = route.params?.student;
  const headerTitle = route.params?.headerTitle || 'New Student';

  const [id, setId] = useState(editStudent?.id || 0);
  const [name, setName] = useState(editStudent?.name || '');
  const [gender, setGender] = useState(editStudent?.gender || 'Male');
  const [phone, setPhone] = useState(editStudent?.phone || '');
  const [standardId, setStandardId] = useState(editStudent?.standardId || 0);
  const [standards, setStandards] = useState<Standard[]>([]);
  const [school, setSchool] = useState(editStudent?.school || "");
  const [mediumId, setMediumId] = useState(editStudent?.mediumId || 0);
  const [mediums, setMediums] = useState<Medium[]>([]);
  const [age, setAge] = useState(editStudent?.age?.toString() || "");
  const [place, setPlace] = useState(editStudent?.place || "");
  const [address, setAddress] = useState(editStudent?.address || "");
  const [status, setStatus] = useState(editStudent?.activeStatus !== false ? 'Active' : 'Inactive');
  const [joingingDate, setJoingingDate] = useState(editStudent?.joiningDate || new Date().toISOString().slice(0, 10));
  const [profileImage, setProfileImage] = useState<string | null>(editStudent?.imageUrl || null);

  const [dob, setDob] = useState(formatToUIDate(editStudent?.dateOfBirth) || "");
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showDobPicker, setShowDobPicker] = useState(false);
  const [showJoinPicker, setShowJoinPicker] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const refRBSheet = useRef<RBSheetRef>(null);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardVisible(true));
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardVisible(false));
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const openFilterSheet = () => refRBSheet.current?.open();
  const closeSheet = () => refRBSheet.current?.close();


  //standard fetch

  useEffect(() => {
    const fetchStandards = async () => {
      try {
        const response = await apiClient.get('/standard/all');
        if (Array.isArray(response.data)) {
          setStandards(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch standards:', error);
      }
    };
    fetchStandards();
  }, []);


  //medium fetch

  useEffect(() => {
    const fetchMediums = async () => {
      try {
        const response = await apiClient.get('medium/all');
        if (Array.isArray(response.data)) {
          setMediums(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch mediums:', error);
      }
    };
    fetchMediums();
  }, []);

  const onChange = (event: any, selectedDate: any) => {
    setShowPicker(false);
    if (selectedDate) {
      const formatted = formatToUIDate(selectedDate.toISOString().slice(0, 10)); // DD-MM-YYYY
      setDob(formatted);
    }
  };






  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Please enter student name');
      return;
    }
    if (phone.length !== 10) {
      Alert.alert('Validation', 'Phone number must be exactly 10 digits');
      return;
    }
    if (!standardId) {
      Alert.alert('Validation', 'Please select a standard');
      return;
    }
    if (!mediumId) {
      Alert.alert('Validation', 'Please select a medium');
      return;
    }
    if (!dob) {
      Alert.alert('Validation', 'Please select date of birth');
      return;
    }
    if (!joingingDate) {
      Alert.alert('Validation', 'Please select joining date');
      return;
    }

    setLoading(true);

    try {
      let cloudinaryUrl = profileImage;

      // 1. Upload to Cloudinary if image is local
      if (profileImage && !profileImage.startsWith('http')) {
        console.log('Initiating Cloudinary upload...');
        const uploadedUrl = await uploadToCloudinary(profileImage);
        if (uploadedUrl) {
          cloudinaryUrl = uploadedUrl;
        } else {
          Alert.alert('Upload Error', 'Failed to upload image to cloud. Proceeding without image.');
          cloudinaryUrl = null;
        }
      }

      // 2. Prepare payload
      const studentData: any = {
        name: name.trim(),
        phone: phone.trim(),
        school: school.trim(),
        standardId: standardId,
        mediumId: mediumId,
        age: parseInt(age) || 0,
        gender: gender,
        dateOfBirth: formatToBackendDate(dob),
        joiningDate: formatToBackendDate(joingingDate),
        address: address.trim(),
        place: place.trim(),
        activeStatus: status === 'Active',
        imageUrl: cloudinaryUrl
      };

      if (id !== 0) {
        studentData.id = id;
      }

      console.log('Sending student data to backend:', studentData);

      // 3. Send to backend
      const response = id === 0
        ? await apiClient.post('students/create', studentData, { headers: { 'Content-Type': 'application/json' } })
        : await apiClient.put(`students/update/${id}`, studentData, { headers: { 'Content-Type': 'application/json' } });

      if (response.status === 200 || response.status === 201) {
        ToastAndroid.show(`Student ${id === 0 ? 'created' : 'updated'} successfully`, ToastAndroid.SHORT);
        navigation.goBack();
      } else {
        Alert.alert('Error', response.data?.message || `Server Error (${response.status})`);
      }
    } catch (error: any) {
      console.error('Save failed:', error);
      const errMsg = error.response?.data?.message || error.message || 'Failed to save student';
      Alert.alert('Error', errMsg);
    } finally {
      setLoading(false);
    }
  };



  const handlePickFromGallery = () => {
    const options: ImageLibraryOptions = {
      mediaType: "photo",
      quality: 0.1,
      maxWidth: 600, // Enforce small resolution for fast upload
      maxHeight: 600,
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
      quality: 0.1,
      maxWidth: 600, // Enforce small resolution for fast upload
      maxHeight: 600,
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
      <AppHeader title={headerTitle} />

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


          <Text className="text-[15px] text-[#111827] font-medium mb-2 mt-3">Name <Text className="text-red-500">*</Text></Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Full name"
            className="border border-[#E0E5E9] rounded-xl p-3 text-[#000]"
            maxLength={50}
          />

          {/* Standard */}
          <Text className="text-[15px] text-[#111827] font-medium mb-2 mt-3">Standard <Text className="text-red-500">*</Text></Text>
          <View className="border border-[#E5E6EA] rounded-xl px-2">
            <Picker
              selectedValue={standardId}
              onValueChange={setStandardId}
              style={{ height: 50 }}
            >
              <Picker.Item label="Select Standard" value={0} />
              {standards.map((item) => (
                <Picker.Item key={item.id} label={item.name} value={item.id} />
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
            maxLength={100}
          />

          {/* Medium */}
          <Text className="text-[15px] text-[#111827] font-medium mb-2 mt-3">Medium <Text className="text-red-500">*</Text></Text>
          <View className="border border-[#E5E6EA] rounded-xl">
            <Picker selectedValue={mediumId} onValueChange={setMediumId} style={{ height: 50 }}>
              <Picker.Item label="Select Medium" value={0} />
              {mediums.map((item) => (
                <Picker.Item key={item.id} label={item.name} value={item.id} />
              ))}
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
            maxLength={2}
          />

          {/* Gender */}
          <Text className="text-[15px] text-[#111827] font-medium mb-2 mt-3">Gender <Text className="text-red-500">*</Text></Text>
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
          <Text className="text-[15px] text-[#111827] font-medium mb-2 mt-3">Date of Birth (DD-MM-YYYY) <Text className="text-red-500">*</Text></Text>
          <TextInput
            value={dob}
            onChangeText={setDob}
            placeholder="DD-MM-YYYY"
            keyboardType="number-pad"
            className="border border-[#E0E5E9] rounded-xl p-3 text-[#000]"
            maxLength={10}
          />

          {/* Phone */}
          <Text className="text-[15px] text-[#111827] font-medium mb-2 mt-3">Phone <Text className="text-red-500">*</Text></Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone number"
            keyboardType="phone-pad"
            className="border border-[#E0E5E9] rounded-xl p-3 text-[#000]"
            maxLength={10}
          />

          {/* Place */}
          <Text className="text-[15px] text-[#111827] font-medium mb-2 mt-3">Place</Text>
          <TextInput
            value={place}
            onChangeText={setPlace}
            placeholder="Place"
            className="border border-[#E0E5E9] rounded-xl p-3 text-[#000]"
            maxLength={50}
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
            maxLength={200}
          />

          {/* Joining Date */}
          <Text className="text-[15px] text-[#111827] font-medium mb-2 mt-3">Joining Date (DD-MM-YYYY) <Text className="text-red-500">*</Text></Text>
          <TouchableOpacity onPress={() => setShowJoinPicker(true)} className="border border-[#E0E5E9] rounded-xl p-3">
            <Text className="text-[#000]">{formatToUIDate(joingingDate) || "Select Joining Date"}</Text>
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

      {/* Sticky Bottom Buttons - Hidden when keyboard is open */}
      {!isKeyboardVisible && (
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
            onPress={handleSave}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              {loading ? "Processing..." : "Publish"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

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
