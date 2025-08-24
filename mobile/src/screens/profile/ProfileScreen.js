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
  Paragraph,
  Avatar,
  Button,
  Divider,
  List,
  Switch
} from 'react-native-paper';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import { AuthService } from '../../services/authService';
import { BirthdayService } from '../../services/birthdayService';

export const ProfileScreen = ({ navigation }) => {
  const { userInfo, userToken, logout } = useContext(AuthContext);
  const { hasPermission, requestPermission } = useContext(NotificationContext);
  const [stats, setStats] = useState({
    totalBirthdays: 0,
    upcomingBirthdays: 0,
    todaysBirthdays: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [allBirthdays, upcomingBirthdays, todaysBirthdays] = await Promise.all([
        BirthdayService.getBirthdays(userToken),
        BirthdayService.getUpcomingBirthdays(userToken),
        BirthdayService.getTodaysBirthdays(userToken)
      ]);

      setStats({
        totalBirthdays: allBirthdays.success ? allBirthdays.data.length : 0,
        upcomingBirthdays: upcomingBirthdays.success ? upcomingBirthdays.data.length : 0,
        todaysBirthdays: todaysBirthdays.success ? todaysBirthdays.data.length : 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await logout();
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể đăng xuất');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleNotificationToggle = async (enabled) => {
    if (enabled && !hasPermission) {
      const granted = await requestPermission();
      if (!granted) {
        Alert.alert(
          'Cần quyền thông báo',
          'Vui lòng cấp quyền thông báo trong cài đặt để nhận thông báo sinh nhật'
        );
      }
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Card */}
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <Avatar.Text
            size={80}
            label={getInitials(userInfo?.firstName, userInfo?.lastName)}
            style={styles.avatar}
          />
          <Title style={styles.name}>
            {userInfo?.firstName} {userInfo?.lastName}
          </Title>
          <Paragraph style={styles.email}>{userInfo?.email}</Paragraph>
          
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('EditProfile')}
            style={styles.editButton}
          >
            Chỉnh sửa hồ sơ
          </Button>
        </Card.Content>
      </Card>

      {/* Stats Card */}
      <Card style={styles.statsCard}>
        <Card.Content>
          <Title>Thống kê</Title>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Title style={styles.statNumber}>{stats.totalBirthdays}</Title>
              <Paragraph style={styles.statLabel}>Tổng sinh nhật</Paragraph>
            </View>
            <View style={styles.statItem}>
              <Title style={styles.statNumber}>{stats.upcomingBirthdays}</Title>
              <Paragraph style={styles.statLabel}>Sắp đến</Paragraph>
            </View>
            <View style={styles.statItem}>
              <Title style={styles.statNumber}>{stats.todaysBirthdays}</Title>
              <Paragraph style={styles.statLabel}>Hôm nay</Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Settings Card */}
      <Card style={styles.settingsCard}>
        <Card.Content>
          <Title>Cài đặt</Title>
          
          <List.Item
            title="Thông báo"
            description="Nhận thông báo sinh nhật"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={hasPermission}
                onValueChange={handleNotificationToggle}
              />
            )}
          />
          
          <Divider />
          
          <List.Item
            title="Cài đặt thông báo"
            description="Tùy chỉnh thông báo"
            left={(props) => <List.Icon {...props} icon="bell-cog" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('Settings')}
          />
          
          <Divider />
          
          <List.Item
            title="Lịch sử thông báo"
            description="Xem lịch sử thông báo"
            left={(props) => <List.Icon {...props} icon="history" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('Notifications')}
          />
          
          <Divider />
          
          <List.Item
            title="Giới thiệu"
            description="Thông tin về ứng dụng"
            left={(props) => <List.Icon {...props} icon="information" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('About')}
          />
        </Card.Content>
      </Card>

      {/* Logout Button */}
      <Card style={styles.logoutCard}>
        <Card.Content>
          <Button
            mode="outlined"
            onPress={handleLogout}
            loading={loading}
            disabled={loading}
            style={styles.logoutButton}
            textColor="#B00020"
          >
            Đăng xuất
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  profileCard: {
    margin: 16,
    elevation: 4
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: 20
  },
  avatar: {
    backgroundColor: '#6200EE',
    marginBottom: 16
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16
  },
  editButton: {
    marginTop: 8
  },
  statsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16
  },
  statItem: {
    alignItems: 'center'
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6200EE'
  },
  statLabel: {
    fontSize: 14,
    color: '#666'
  },
  settingsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2
  },
  logoutCard: {
    marginHorizontal: 16,
    marginBottom: 32,
    elevation: 2
  },
  logoutButton: {
    borderColor: '#B00020'
  }
});

export default ProfileScreen;