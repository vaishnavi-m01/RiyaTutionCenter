import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { UIManager, Platform } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


interface HeaderStat {
    label: string;
    value: string;
}

interface AppHeaderProps {
    title: string;
    subtitle?: string;
    showBack?: boolean;
    onFilterPress?: () => void;
    leftIcon?: string;
    rightIcon?: string;
    onLeftPress?: () => void;
    onRightPress?: () => void;
    showSearch?: boolean;
    searchPlaceholder?: string;
    searchValue?: string;
    onSearchChange?: (text: string) => void;
    onSearchFocus?: () => void;
    onSearchBlur?: () => void;
    onSearchSubmit?: () => void;
    showStats?: boolean;
    statsData?: HeaderStat[];
    gradient?: boolean;
    gradientColors?: string[];
}

const AppHeader: React.FC<AppHeaderProps> = ({
    title,
    subtitle,
    showBack = false,
    leftIcon,
    rightIcon,
    onFilterPress,
    onLeftPress,
    onRightPress,
    showSearch = false,
    searchPlaceholder = "Search...",
    searchValue,
    onSearchChange,
    onSearchFocus,
    onSearchBlur,
    onSearchSubmit,
    showStats = false,
    statsData = [],
    gradient = true,
    gradientColors,
}) => {
    const navigation = useNavigation<any>();

    // Detect whether the native BVLinearGradient view manager is registered.
    // If it's not available (native lib not linked/built yet), fall back to a plain View
    // to avoid the "View config not found for component BVLinearGradient" render crash.
    let canUseLinearGradient = false;
    try {
        canUseLinearGradient = !!(
            LinearGradient &&
            UIManager.getViewManagerConfig &&
            UIManager.getViewManagerConfig("BVLinearGradient")
        );
    } catch (e) {
        canUseLinearGradient = false;
    }

    const Wrapper = gradient && canUseLinearGradient ? LinearGradient : View;
    const defaultBlue = ["#007BFF", "#007BFF"];
    const gradientColorsToUse = gradientColors && gradientColors.length
        ? gradientColors.map((c) => (typeof c === 'string' ? c.trim() : c))
        : defaultBlue;

    // Only pass linear-gradient specific props when the native view manager exists.
    const gradientProps = gradient && canUseLinearGradient
        ? {
            colors: gradientColorsToUse,
            start: { x: 0, y: 0 },
            end: { x: 1, y: 0.8 },
        }
        : {};

    // If linear gradient isn't available, use a solid fallback background color
    // so the header still has the intended blue appearance instead of being transparent.
    const fallbackStyle = gradient && !canUseLinearGradient
        ? { backgroundColor: gradientColorsToUse[0], width: '100%', zIndex: 10 }
        : {};

    const isEmoji = (str?: string) =>
        !!str && str.match(/[\p{Emoji}\u200d]/u) && str.length <= 3;

    // Show a header-right search icon when `showSearch` is true (unless explicit rightIcon provided).
    // Determine effective right icon. If this header is for the `Tabs` screen we try
    // to detect the active tab and show a plus icon on the Student tab by default.
    let effectiveRightIcon = rightIcon ?? (showSearch ? "search" : undefined);
    let activeTabName: string | undefined;
    try {
        const state = navigation.getState && navigation.getState();
        if (title === "Tabs" && state && Array.isArray(state.routes)) {
            const tabsRoute = state.routes.find((r: any) => r.name === "Tabs");
            const nested = tabsRoute && tabsRoute.state;
            const activeNested = nested && nested.routes && nested.routes[nested.index];
            activeTabName = activeNested && activeNested.name;
            if (!rightIcon && activeTabName === "Student") {
                effectiveRightIcon = "add"; // Ionicons 'add' as plus icon
            }
        }
    } catch (e) {
        // ignore
    }

    return (
        <Wrapper {...(gradientProps as any)} style={fallbackStyle} className="px-5 pt-12 pb-4 shadow-md">
            <View className="flex-row justify-between items-center mb-3">
                {/* Always show a rounded left control (back arrow by default). */}
                <TouchableOpacity
                    onPress={onLeftPress || (() => navigation.goBack())}
                    className="w-10 h-10 rounded-full justify-center items-center bg-white/15"
                >
                    {isEmoji(leftIcon) ? (
                        <Text className="text-white text-xl">{leftIcon}</Text>
                    ) : (
                        <Ionicons name={leftIcon || "arrow-back"} size={22} color="#fff" />
                    )}
                </TouchableOpacity>

                {/* Title */}
                <View className="flex-1 items-center">
                    <Text className="text-white text-[18px] font-semibold text-center">
                        {title}
                    </Text>
                    {subtitle && (
                        <Text className="text-white/90 text-[13px] text-center">
                            {subtitle}
                        </Text>
                    )}
                </View>

                {/* Right Button */}
                {effectiveRightIcon ? (
                    <View className="flex-row space-x-3">
                        {/* Add Button */}
                        {rightIcon && (
                            <TouchableOpacity
                                onPress={
                                    onRightPress ||
                                    ((effectiveRightIcon === "add" && activeTabName === "Student")
                                        ? () => navigation.navigate("CreateStudent")
                                        : undefined)
                                }
                                className="w-10 h-10 rounded-full justify-center items-center bg-white/15"
                            >
                                {isEmoji(rightIcon) ? (
                                    <Text className="text-white text-xl">{effectiveRightIcon}</Text>
                                ) : rightIcon === "edit" ? (
                                    <MaterialIcons name="edit" size={24} color="#fff" />
                                ) : (
                                    <Ionicons name={effectiveRightIcon as string} size={26} color="#fff" />
                                )}
                            </TouchableOpacity>
                        )}


                        {/* 🔍 Filter Button */}

                    </View>
                ) : (
                    <View className="w-12" />
                )}

            </View>

            {/* Search Bar */}
            {showSearch && (
                <View className="flex-row items-center bg-white rounded-full px-4 py-2 mb-3">
                    <Ionicons name="search" size={18} color="#666" />
                    <TextInput
                        placeholder={searchPlaceholder}
                        value={searchValue}
                        onChangeText={onSearchChange}
                        onFocus={onSearchFocus}
                        onBlur={onSearchBlur}
                        onSubmitEditing={onSearchSubmit}
                        placeholderTextColor="#999"
                        returnKeyType="search"
                        className="flex-1 ml-2 text-gray-700 text-sm"
                    />
                </View>
            )}

            {/* Stats Row */}
            {showStats && (
                <View className="flex-row gap-2">
                    {statsData.map((item, index) => (
                        <View key={index} className="flex-1 bg-white rounded-lg py-2">
                            <Text className="text-[#2d6a4f] text-center text-base font-bold">
                                {item.value}
                            </Text>
                            <Text className="text-gray-600 text-center text-[10px]">
                                {item.label}
                            </Text>
                        </View>
                    ))}
                </View>
            )}
        </Wrapper>
    );
};

export default AppHeader;
