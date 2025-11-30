import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParmaList } from "../type/type";
import Splash from "../Screen/Splash";
import Tabs from "./Tabs";
import AppHeader from "../utils/AppBar";
import CreateStudent from "../Screen/CreateStudent";
import StudentDetails from "../Screen/StudentDetails";
import FeesForm from "../Screen/FeesForm";
import Profile from "../Screen/Profile";
import Settings from "../Screen/Settings";
import ClassFees from "../Screen/ClassFees";
import AddClassFees from "../Screen/AddClassFees";
import SignIn from "../Screen/SignIn";
import SignUp from "../Screen/SignUp";


const Stack = createNativeStackNavigator<RootStackParmaList>();

export default function StackScreen() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={({ route }) => ({
          header: (props) => {
            if (route.name === "Splash") return null;
            return <AppHeader title={route.name} />;
          },
        })}
      >
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen
          name="CreateStudent"
          component={CreateStudent}
          options={{ title: "New Student", headerShown: false }}
        />
        <Stack.Screen name="StudentDetails" component={StudentDetails} />
        <Stack.Screen name="FeesForm" component={FeesForm} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="ClassFees" component={ClassFees} options={{ headerShown: false }} />
        <Stack.Screen name="AddClassFees" component={AddClassFees} options={{ headerShown: false }} />
        <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
