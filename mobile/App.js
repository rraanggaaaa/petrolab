import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { View, Text, ActivityIndicator } from "react-native";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";

// Import screens
import Login from "./src/screens/auth/Login";
import Register from "./src/screens/auth/Register";

// Temporary Dashboard
const Dashboard = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text style={{ fontSize: 24, fontWeight: "bold" }}>Dashboard</Text>
    <Text style={{ marginTop: 10 }}>Login Successful!</Text>
  </View>
);

const Stack = createStackNavigator();

function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1A56DB" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </>
      ) : (
        <Stack.Screen name="Dashboard" component={Dashboard} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
