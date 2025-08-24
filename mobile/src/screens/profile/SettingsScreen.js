import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import {
  Card,
  Title,
  List,
  Switch,
  Button,
  Divider,
  TextInput,
  Paragraph
} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import { AuthService } from '../../services/authService';
import { storeNotificationSettings, getNotificationSettings } from '../../utils/storage';

export const SettingsScreen = ({ navigation }) => {
  const { userInfo, userToken, updateUserInfo } = useContext(AuthContext);
  const { hasPermission, requestPermission } = useContext(NotificationContext);
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    reminderTime: '09:00:00',
    reminderDays: 1,
    soundEnabled: true,
    vibrationEnabled: true
  });
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await getNotificationSettings();
      if (savedSettings) {
        setSettings(prev => ({
          ...prev,
          ...savedSettings
        }));
      }
      
      // Load user reminder time if available
      if (userInfo?.reminderTime) {
        setSettings(prev => ({
          ...prev,
          reminderTime: userInfo.reminderTime
        }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateSetting = async (key, value) => {
    const newSettings = {
      ...settings,
      [key]: value
    };
    setSettings(newSettings);
    
    // Save to local storage
    await storeNotificationSettings(newSettings);
    
    // If updating reminder time, also update user profile
    if (key === 'reminderTime') {
      updateUserReminderTime(value);
    }
  };

  const updateUserReminderTime = async (reminderTime) => {
    try {
      setLoading(true);
      const result = await AuthService.updateProfile(
        { reminderTime },
        userToken
      );
      
      if (result.success) {
        updateUserInfo(result.user);
      } else {
        Alert.alert('Lỗi', 'Không thể cập nhật thời gian nhắc nhở');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật');
    } finally {
      setLoading(false);
    }
  };

  const handlePushNotificationToggle = async (enabled) => {
    if (enabled && !hasPermission) {
      const granted = await requestPermission();
      if (!granted) {
        Alert.alert(
          'Cần quyền thông báo',
          'Vui lòng cấp quyền thông báo trong cài đặt để nhận thông báo sinh nhật'
        );
        return;
      }
    }
    updateSetting('pushNotifications', enabled);
  };

  const resetSettings = () => {
    Alert.alert(
      'Khôi phục cài đặt',
      'Bạn có chắc chắn muốn khôi phục cài đặt về mặc định?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Khôi phục',
          style: 'destructive',
          onPress: () => {
            const defaultSettings = {
              emailNotifications: true,
              pushNotifications: true,
              reminderTime: '09:00:00',
              reminderDays: 1,
              soundEnabled: true,
              vibrationEnabled: true
            };
            setSettings(defaultSettings);
            storeNotificationSettings(defaultSettings);
            updateUserReminderTime(defaultSettings.reminderTime);
          }
        }
      ]
    );
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  const createTimeFromString = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds) || 0);
    return date;
  };

  const formatTimeFromDate = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = '00';
    return `${hours}:${minutes}:${seconds}`;
  };

  const getReminderDaysText = (days) => {
    switch (days) {
      case 0: return 'Cùng ngày';
      case 1: return '1 ngày trước';
      case 7: return '1 tuần trước';
      case 14: return '2 tuần trước';
      case 30: return '1 tháng trước';
      default: return `${days} ngày trước`;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Notification Settings */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Cài đặt thông báo</Title>
          
          <List.Item
            title="Thông báo đẩy"
            description="Nhận thông báo trên thiết bị"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={settings.pushNotifications && hasPermission}
                onValueChange={handlePushNotificationToggle}
              />
            )}
          />
          
          <Divider />
          
          <List.Item
            title="Thông báo email"
            description="Nhận thông báo qua email"
            left={(props) => <List.Icon {...props} icon="email" />}
            right={() => (
              <Switch
                value={settings.emailNotifications}
                onValueChange={(value) => updateSetting('emailNotifications', value)}
              />
            )}
          />
          
          <Divider />
          
          <List.Item
            title="Âm thanh"
            description="Phát âm thanh khi có thông báo"
            left={(props) => <List.Icon {...props} icon="volume-high" />}
            right={() => (
              <Switch
                value={settings.soundEnabled}
                onValueChange={(value) => updateSetting('soundEnabled', value)}
              />
            )}
          />
          
          <Divider />
          
          <List.Item
            title="Rung"
            description="Rung thiết bị khi có thông báo"
            left={(props) => <List.Icon {...props} icon="vibrate" />}
            right={() => (
              <Switch
                value={settings.vibrationEnabled}
                onValueChange={(value) => updateSetting('vibrationEnabled', value)}
              />
            )}
          />
        </Card.Content>
      </Card>

      {/* Reminder Settings */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Cài đặt nhắc nhở</Title>
          
          <List.Item
            title="Thời gian nhắc nhở"
            description={`${formatTime(settings.reminderTime)}`}
            left={(props) => <List.Icon {...props} icon="clock" />}
            onPress={() => setShowTimePicker(true)}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
          
          <Divider />
          
          <View style={styles.reminderDaysContainer}>
            <Paragraph style={styles.reminderLabel}>Nhắc nhở mặc định:</Paragraph>
            <Paragraph style={styles.reminderValue}>
              {getReminderDaysText(settings.reminderDays)}
            </Paragraph>
            <View style={styles.reminderButtonsContainer}>
              {[0, 1, 3, 7, 14, 30].map((days) => (
                <Button
                  key={days}
                  mode={settings.reminderDays === days ? 'contained' : 'outlined'}
                  onPress={() => updateSetting('reminderDays', days)}
                  style={styles.reminderButton}
                  compact
                >
                  {days === 0 ? 'Cùng ngày' : `${days}d`}
                </Button>
              ))}
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Account Settings */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Cài đặt tài khoản</Title>
          
          <List.Item
            title="Chỉnh sửa hồ sơ"
            description="Cập nhật thông tin cá nhân"
            left={(props) => <List.Icon {...props} icon="account-edit" />}
            onPress={() => navigation.navigate('EditProfile')}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
          
          <Divider />
          
          <List.Item
            title="Đổi mật khẩu"
            description="Thay đổi mật khẩu đăng nhập"
            left={(props) => <List.Icon {...props} icon="lock" />}
            onPress={() => navigation.navigate('ChangePassword')}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
        </Card.Content>
      </Card>

      {/* App Settings */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Cài đặt ứng dụng</Title>
          
          <List.Item
            title="Về ứng dụng"
            description="Thông tin phiên bản và nhà phát triển"
            left={(props) => <List.Icon {...props} icon="information" />}
            onPress={() => navigation.navigate('About')}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
          
          <Divider />
          
          <List.Item
            title="Khôi phục cài đặt"
            description="Đặt lại về cài đặt mặc định"
            left={(props) => <List.Icon {...props} icon="restore" />}
            onPress={resetSettings}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
        </Card.Content>
      </Card>

      <DatePicker
        modal
        open={showTimePicker}
        date={createTimeFromString(settings.reminderTime)}
        mode="time"
        onConfirm={(date) => {
          setShowTimePicker(false);
          updateSetting('reminderTime', formatTimeFromDate(date));
        }}
        onCancel={() => setShowTimePicker(false)}
        title="Chọn thời gian nhắc nhở"
        confirmText="Xác nhận"
        cancelText="Hủy"
        is24hourSource="locale"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  card: {
    margin: 16,
    elevation: 2
  },
  reminderDaysContainer: {
    padding: 16
  },
  reminderLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8
  },
  reminderValue: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12
  },
  reminderButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  reminderButton: {
    marginRight: 8,
    marginBottom: 8
  }
});

export default SettingsScreen;