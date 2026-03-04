import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import apiClient from '../api/apiBaseUrl';

import AppHeader from '../utils/AppBar';

const BirthdayTemplateSettings = () => {
    const navigation = useNavigation();
    const [template, setTemplate] = useState("Happy Birthday {name}! Have a great year ahead! - Riya Tuition Center");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchTemplate();
    }, []);

    const fetchTemplate = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get('/settings/get/birthday_template');
            if (res.data && res.data.configValue) {
                setTemplate(res.data.configValue);
            }
        } catch (error) {
            console.log("Template not found or error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!template.trim()) {
            Alert.alert("Error", "Template cannot be empty");
            return;
        }

        try {
            setSaving(true);
            await apiClient.post('/settings/save', {
                configKey: "birthday_template",
                configValue: template
            });
            Alert.alert("Success", "Template saved successfully");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", "Failed to save template");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#007BFF" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-[#F9FAFB]">
            <AppHeader
                title="Birthday Template"
                showBack={true}
                onLeftPress={() => navigation.goBack()}
            />

            <View className="p-6">
                <Text className="text-[#64748B] mb-4">
                    Customize the message sent to students on their birthday.
                    Use <Text className="font-bold text-[#1E293B]">{`{name}`}</Text> to insert the student's name dynamically.
                </Text>

                <View className="border border-[#E0E5E9] rounded-2xl p-4 bg-[#F8FAFC]">
                    <TextInput
                        multiline
                        numberOfLines={6}
                        value={template}
                        onChangeText={setTemplate}
                        placeholder="Enter birthday wish template..."
                        className="text-[#1E293B] text-base"
                        style={{ textAlignVertical: 'top' }}
                    />
                </View>

                <View className="mt-8">
                    <Text className="text-[#64748B] text-sm mb-2">Preview:</Text>
                    <View className="bg-[#DCF8C6] p-4 rounded-xl shadow-sm self-start max-w-[90%]">
                        <Text className="text-[#1A1A1A]">
                            {template.replace("{name}", "John Doe")}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleSave}
                    disabled={saving}
                    className={`mt-12 py-4 rounded-2xl items-center ${saving ? 'bg-gray-400' : 'bg-[#007BFF]'}`}
                >
                    <Text className="text-white font-bold text-lg">
                        {saving ? "Saving..." : "Save Template"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default BirthdayTemplateSettings;
