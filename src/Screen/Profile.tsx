import { useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View, TextInput, Modal, TouchableWithoutFeedback } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
     CameraOptions,
     ImageLibraryOptions,
     launchCamera,
     launchImageLibrary,
} from "react-native-image-picker";
import AppHeader from "../utils/AppBar";
import { useNavigation } from "@react-navigation/core";

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



     const [passwordModal, setPasswordModal] = useState(false);
     const [oldPass, setOldPass] = useState("");
     const [newPass, setNewPass] = useState("");


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


     const handleSubmitPassword = () => {
          console.log("Old:", oldPass);
          console.log("New:", newPass);

          setPasswordModal(false);
          setOldPass("");
          setNewPass("");
     };

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
                         style={{
                              width: "100%",
                              backgroundColor: loading ? "#9CA3AF" : "#007BFF",
                              paddingVertical: 12,
                              borderRadius: 10,
                              alignItems: "center",
                              justifyContent: "center",
                              marginTop: 28,
                         }}
                    >
                         <Text style={{ color: "#fff", fontWeight: "600" }}>Save</Text>
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

                                   {/* Old Password */}
                                   <Text className="font-medium text-[#111827] mb-2">Old Password</Text>
                                   <TextInput
                                        value={oldPass}
                                        onChangeText={setOldPass}
                                        placeholder="Enter old password"
                                        secureTextEntry
                                        className="border border-gray-300 rounded-xl p-3 mb-4"
                                   />

                                   {/* New Password */}
                                   <Text className="font-medium text-[#111827] mb-2">New Password</Text>
                                   <TextInput
                                        value={newPass}
                                        onChangeText={setNewPass}
                                        placeholder="Enter new password"
                                        secureTextEntry
                                        className="border border-gray-300 rounded-xl p-3 mb-6"
                                   />

                                   {/* Submit */}
                                   <TouchableOpacity
                                        onPress={handleSubmitPassword}
                                        className="bg-[#007BFF] p-3 rounded-xl"
                                   >
                                        <Text className=" text-white text-center font-semibold">
                                             Submit
                                        </Text>
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
