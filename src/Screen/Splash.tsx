import { useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native"
import { useNavigation } from "@react-navigation/native";


const Splash = () => {

    const navigation = useNavigation<any>();

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         navigation.replace("Tabs");
    //     }, 2500);

    //     return () => clearTimeout(timer);
    // }, [navigation]);

    const handleGetStarted = () => {
        navigation.replace("SignIn");
    };

    return (
        <View className="flex-1 bg-white">
            {/* Top Decorative Section */}
            <View className="flex-1 justify-center items-center px-6">
                {/* Logo/Image - Clean and Simple */}
                <Image
                    source={require("../assets/image/Splash.png")}
                    style={{ width: 240, height: 220 }}
                    resizeMode="contain"
                />

                {/* Title Section */}
                <View style={{ marginBottom: 10 }}>
                    <Text className="text-xl  text-[#007CEE] font-PatuaOne font-semibold text-center">
                        Welcome to
                    </Text>

                    <Text className="text-3xl text-[#007CEE] font-PatuaOne font-semibold leading-snug">
                        Riya Tution Center
                    </Text>
                </View>


                {/* Subtitle */}
                <Text className="text-base text-gray-500 text-center px-4 mt-6">
                    Excellence in Education, Personalized for Every Student
                </Text>
            </View>

            {/* Bottom Section with Buttons */}
            <View className="px-6 pb-16">
                <TouchableOpacity
                    onPress={handleGetStarted}
                    className="bg-[#007BFF] rounded-xl py-4 items-center shadow-lg"
                    activeOpacity={0.8}
                >
                    <Text className="text-white text-lg font-bold">
                        Get Started
                    </Text>
                </TouchableOpacity>

                {/* Skip Link */}
                <TouchableOpacity
                    onPress={handleGetStarted}
                    className="mt-5 items-center py-3"
                    activeOpacity={0.6}
                >
                    <Text className="text-[#007CEE] text-base font-semibold">
                        Skip
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Splash