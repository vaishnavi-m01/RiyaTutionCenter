import React, { useRef, useState, useEffect } from "react";
import { Image, Text, TouchableOpacity, View, TextInput, Modal, TouchableWithoutFeedback, ActivityIndicator, ToastAndroid } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
     CameraOptions,
     ImageLibraryOptions,
     launchCamera,
     launchImageLibrary,
} from "react-native-image-picker";
import AppHeader from "../utils/AppBar";
import { useNavigation } from "@react-navigation/core";
import apiClient from "../api/apiBaseUrl";
import { uploadToCloudinary } from "../utils/cloudinary";

interface RBSheetRef {
     open: () => void;
     close: () => void;
}

const Profile = () => {
     const refRBSheet = useRef<RBSheetRef>(null);
     const navigation = useNavigation<any>();
     const [name, setName] = useState("");
     const [email, setEmail] = useState("");
     const [phone, setPhone] = useState("");
     const [loading, setLoading] = useState(false);
     const [fetchLoading, setFetchLoading] = useState(true);

     useEffect(() => {
          fetchProfile();
     }, []);

     const fetchProfile = async () => {
          try {
               setFetchLoading(true);
               const id = await AsyncStorage.getItem("adminId");
               if (id) {
                    const response = await apiClient.get(`/admin/getbyid/${id}`);
                    const data = response.data;
                    if (data) {
                         setName(data.name || "");
                         setEmail(data.email || "");
                         setPhone(data.phone || "");
                         setProfileImage(data.imageUrl || null);
                    }
               }
          } catch (error) {
               console.error("Error fetching profile:", error);
          } finally {
               setFetchLoading(false);
          }
     };



     const [passwordModal, setPasswordModal] = useState(false);
     const [oldPass, setOldPass] = useState("");
     const [newPass, setNewPass] = useState("");
     const [confirmPass, setConfirmPass] = useState("");
     const [passLoading, setPassLoading] = useState(false);
     const [showNewPass, setShowNewPass] = useState(false);
     const [showConfirmPass, setShowConfirmPass] = useState(false);


     const [profileImage, setProfileImage] = useState<string | null>(null);

     const openFilterSheet = () => refRBSheet.current?.open();
     const closeSheet = () => refRBSheet.current?.close();

     /* ---------------- Gallery ---------------- */
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


     const handleSubmitPassword = async () => {
          if (!newPass || !confirmPass) {
               ToastAndroid.show("Please fill all fields", ToastAndroid.SHORT);
               return;
          }

          if (newPass !== confirmPass) {
               ToastAndroid.show("New password and confirm password do not match", ToastAndroid.SHORT);
               return;
          }

          try {
               setPassLoading(true);
               const id = await AsyncStorage.getItem("adminId");
               const payload = {
                    id: parseInt(id || "0"),
                    newPassword: newPass,
                    confirmPassword: confirmPass
               };

               const res = await apiClient.post('/admin/change-password', payload);

               if (res.status === 200) {
                    ToastAndroid.show("Password changed successfully", ToastAndroid.SHORT);
                    setPasswordModal(false);
                    setNewPass("");
                    setConfirmPass("");
               }
          } catch (error: any) {
               console.error("Change password error:", error);
               const msg = error.response?.data?.message || "Failed to change password";
               ToastAndroid.show(msg, ToastAndroid.SHORT);
          } finally {
               setPassLoading(false);
          }
     };

     const handleSave = async () => {
          try {
               setLoading(true);
               const id = await AsyncStorage.getItem("adminId");
               if (!id) return;

               let cloudinaryUrl = profileImage;

               // 1. Upload to Cloudinary if image is local
               if (profileImage && !profileImage.startsWith('http')) {
                    console.log('Initiating Cloudinary upload for Admin profile...');
                    const uploadedUrl = await uploadToCloudinary(profileImage);
                    if (uploadedUrl) {
                         cloudinaryUrl = uploadedUrl;
                    } else {
                         ToastAndroid.show("Failed to upload image. Keeping existing image.", ToastAndroid.SHORT);
                         cloudinaryUrl = null;
                    }
               }

               const profileData = {
                    name,
                    email,
                    phone,
                    imageUrl: cloudinaryUrl
               };

               console.log("--- Update Profile Payload (JSON) ---", profileData);

               const response = await apiClient.put(`/admin/update/${id}`, profileData, {
                    headers: { 'Content-Type': 'application/json' }
               });

               if (response.status === 200 || response.status === 201) {
                    ToastAndroid.show("Profile updated successfully", ToastAndroid.SHORT);
                    navigation.goBack();
               }
          } catch (error) {
               console.error("Error updating profile:", error);
               ToastAndroid.show("Failed to update profile", ToastAndroid.SHORT);
          } finally {
               setLoading(false);
          }
     };

     if (fetchLoading) {
          return (
               <View className="flex-1 bg-white justify-center items-center">
                    <ActivityIndicator size="large" color="#007BFF" />
               </View>
          );
     }

     return (
          <View className="flex-1 bg-white">
               <AppHeader title='Profile' rightIcon="settings-sharp" onRightPress={() => navigation.navigate("Settings")} />

               {/* ---------------- Profile Image ---------------- */}
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

               {/* ---------------- Form Inputs ---------------- */}
               <View className="px-4">
                    {/* Name */}
                    <Text className="text-[15px] text-[#111827] font-medium mb-2">
                         Name
                    </Text>
                    <TextInput
                         value={name}
                         onChangeText={setName}
                         placeholder="Full name"
                         className="border border-[#E0E5E9] rounded-xl p-3 text-[#000] bg-[#F9FAFB]"
                    />

                    {/* Email */}
                    <Text className="text-[15px] text-[#111827] font-medium mb-2 mt-4">
                         Email
                    </Text>
                    <TextInput
                         value={email}
                         onChangeText={setEmail}
                         placeholder="Email address"
                         className="border border-[#E0E5E9] rounded-xl p-3 text-[#000] bg-[#F9FAFB]"
                    />

                    {/* Phone */}
                    <Text className="text-[15px] text-[#111827] font-medium mb-2 mt-4">
                         Phone
                    </Text>
                    <TextInput
                         value={phone}
                         onChangeText={setPhone}
                         placeholder="Phone number"
                         className="border border-[#E0E5E9] rounded-xl p-3 text-[#000] bg-[#F9FAFB]"
                    />

                    {/* Change Password */}
                    <View className="mt-4 w-full items-end">
                         <TouchableOpacity onPress={() => setPasswordModal(true)}>
                              <Text className="text-[15px] font-semibold text-[#2563EB]">
                                   Change Password ?
                              </Text>
                         </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                         onPress={handleSave}
                         style={{
                              width: "100%",
                              backgroundColor: loading ? "#9CA3AF" : "#007BFF",
                              paddingVertical: 12,
                              borderRadius: 10,
                              alignItems: "center",
                              justifyContent: "center",
                              marginTop: 28,
                         }}
                         disabled={loading}
                    >
                         {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff", fontWeight: "600" }}>Save</Text>}
                    </TouchableOpacity>


               </View>



               {/* ---------------- Center Modal ---------------- */}
               <Modal
                    visible={passwordModal}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setPasswordModal(false)}
               >
                    <TouchableWithoutFeedback onPress={() => setPasswordModal(false)}>

                         <View
                              style={{
                                   flex: 1,
                                   backgroundColor: "rgba(0,0,0,0.4)",
                                   justifyContent: "center",
                                   alignItems: "center",
                                   padding: 20,
                              }}
                         >
                              <View
                                   style={{
                                        width: "100%",
                                        backgroundColor: "#fff",
                                        borderRadius: 20,
                                        padding: 20,
                                   }}
                              >
                                   <Text className="text-xl font-semibold text-center mb-4">
                                        Change Password
                                   </Text>


                                   {/* New Password */}
                                   <Text className="font-medium text-[#111827] mb-2">New Password</Text>
                                   <View className="relative">
                                        <TextInput
                                             value={newPass}
                                             onChangeText={setNewPass}
                                             placeholder="Enter new password"
                                             secureTextEntry={!showNewPass}
                                             className="border border-gray-300 rounded-xl p-3 mb-4 pr-10"
                                        />
                                        <TouchableOpacity
                                             onPress={() => setShowNewPass(!showNewPass)}
                                             className="absolute right-3 top-3"
                                        >
                                             <Ionicons name={showNewPass ? "eye-off" : "eye"} size={20} color="#6B7280" />
                                        </TouchableOpacity>
                                   </View>

                                   {/* Confirm Password */}
                                   <Text className="font-medium text-[#111827] mb-2">Confirm Password</Text>
                                   <View className="relative">
                                        <TextInput
                                             value={confirmPass}
                                             onChangeText={setConfirmPass}
                                             placeholder="Confirm new password"
                                             secureTextEntry={!showConfirmPass}
                                             className="border border-gray-300 rounded-xl p-3 mb-6 pr-10"
                                        />
                                        <TouchableOpacity
                                             onPress={() => setShowConfirmPass(!showConfirmPass)}
                                             className="absolute right-3 top-3"
                                        >
                                             <Ionicons name={showConfirmPass ? "eye-off" : "eye"} size={20} color="#6B7280" />
                                        </TouchableOpacity>
                                   </View>

                                   {/* Submit */}
                                   <TouchableOpacity
                                        onPress={handleSubmitPassword}
                                        disabled={passLoading}
                                        className={`p-3 rounded-xl ${passLoading ? 'bg-gray-400' : 'bg-[#007BFF]'}`}
                                   >
                                        {passLoading ? (
                                             <ActivityIndicator color="#fff" />
                                        ) : (
                                             <Text className=" text-white text-center font-semibold">
                                                  Submit
                                             </Text>
                                        )}
                                   </TouchableOpacity>

                              </View>
                         </View>
                    </TouchableWithoutFeedback>
               </Modal>

               {/* ---------------- Bottom Sheet ---------------- */}
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

export default Profile;
