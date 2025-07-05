import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Main App Screens
import HomeScreen from '../screens/app/HomeScreen';
import BirthdayListScreen from '../screens/birthdays/BirthdayListScreen';
import BirthdayDetailScreen from '../screens/birthdays/BirthdayDetailScreen';
import AddBirthdayScreen from '../screens/birthdays/AddBirthdayScreen';
import EditBirthdayScreen from '../screens/birthdays/EditBirthdayScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SplashScreen from '../screens/SplashScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Navigator
const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

// Birthday Stack Navigator
const BirthdayStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="BirthdayList" 
        component={BirthdayListScreen} 
        options={{ title: 'Danh sách sinh nhật' }}
      />
      <Stack.Screen 
        name="BirthdayDetail" 
        component={BirthdayDetailScreen}
        options={{ title: 'Chi tiết sinh nhật' }}
      />
      <Stack.Screen 
        name="AddBirthday" 
        component={AddBirthdayScreen}
        options={{ title: 'Thêm sinh nhật mới' }}
      />
      <Stack.Screen 
        name="EditBirthday" 
        component={EditBirthdayScreen}
        options={{ title: 'Chỉnh sửa sinh nhật' }}
      />
    </Stack.Navigator>
  );
};

// Profile Stack Navigator
const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen} 
        options={{ title: 'Cá nhân' }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Cài đặt' }}
      />
    </Stack.Navigator>
  );
};

// Main Tab Navigator
const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'BirthdayStack') {
            iconName = focused ? 'cake-variant' : 'cake-variant-outline';
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'bell' : 'bell-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account' : 'account-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          title: 'Trang chủ',
          headerShown: true
        }}
      />
      <Tab.Screen 
        name="BirthdayStack" 
        component={BirthdayStackNavigator} 
        options={{ 
          title: 'Sinh nhật',
          headerShown: false
        }}
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationsScreen} 
        options={{ 
          title: 'Thông báo',
          headerShown: true
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStackNavigator} 
        options={{ 
          title: 'Cá nhân',
          headerShown: false
        }}
      />
    </Tab.Navigator>
  );
};

// Root Navigator
const AppNavigator = () => {
  const { isLoading, userToken } = useContext(AuthContext);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      {userToken ? (
        <Stack.Screen name="Main" component={MainNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator; 