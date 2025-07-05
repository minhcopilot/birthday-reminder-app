import React, { useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Linking
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  IconButton,
  Chip,
  Divider,
  Avatar
} from 'react-native-paper';
import { AuthContext } from '../../context/AuthContext';
import { BirthdayService } from '../../services/birthdayService';
import { NotificationService } from '../../services/notificationService';
import { 
  calculateAge, 
  formatBirthday, 
  daysUntilBirthday, 
  formatDate,
  generateRandomColor 
} from '../../utils/helpers';

export const BirthdayDetailScreen = ({ route, navigation }) => {
  const { birthday } = route.params;
  const [loading, setLoading] = useState(false);
  const { userToken } = useContext(AuthContext);

  const age = calculateAge(birthday.birthday);
  const formattedBirthday = formatBirthday(birthday.birthday);
  const fullDate = formatDate(birthday.birthday);
  const daysUntil = daysUntilBirthday(birthday.birthday);
  const avatarColor = generateRandomColor();

  const getStatusInfo = () => {
    if (daysUntil === 0) {
      return { text: 'Hôm nay là sinh nhật!', color: '#4CAF50', icon: 'cake' };
    } else if (daysUntil === 1) {
      return { text: 'Ngày mai là sinh nhật', color: '#FF9800', icon: 'calendar-today' };
    } else if (daysUntil <= 7) {
      return { text: `Còn ${daysUntil} ngày nữa`, color: '#FF9800', icon: 'calendar-clock' };
    } else {
      return { text: `Còn ${daysUntil} ngày nữa`, color: '#2196F3', icon: 'calendar' };
    }
  };

  const statusInfo = getStatusInfo();

  const handleEdit = () => {
    navigation.navigate('EditBirthday', { birthday });
  };

  const handleDelete = () => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa sinh nhật này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const result = await BirthdayService.deleteBirthday(birthday.id, userToken);
              if (result.success) {
                Alert.alert('Thành công', 'Đã xóa sinh nhật', [
                  { text: 'OK', onPress: () => navigation.goBack() }
                ]);
              } else {
                Alert.alert('Lỗi', result.message);
              }
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể xóa sinh nhật');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleSendNotification = async () => {
    setLoading(true);
    try {
      const result = await NotificationService.scheduleBirthdayNotification(
        birthday.id,
        userToken
      );
      
      if (result.success) {
        Alert.alert('Thành công', 'Đã gửi thông báo');
      } else {
        Alert.alert('Lỗi', result.message);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể gửi thông báo');
    } finally {
      setLoading(false);
    }
  };

  const handleCallPhone = () => {
    if (birthday.phone) {
      Linking.openURL(`tel:${birthday.phone}`);
    }
  };

  const handleSendEmail = () => {
    if (birthday.email) {
      const subject = `Chúc mừng sinh nhật ${birthday.name}!`;
      const body = `Chúc mừng sinh nhật ${birthday.name}!\n\nChúc bạn một ngày sinh nhật thật vui vẻ và hạnh phúc!`;
      Linking.openURL(`mailto:${birthday.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    }
  };

  const getReminderText = () => {
    switch (birthday.reminderDays) {
      case 0: return 'Cùng ngày';
      case 1: return '1 ngày trước';
      case 7: return '1 tuần trước';
      case 14: return '2 tuần trước';
      case 30: return '1 tháng trước';
      default: return `${birthday.reminderDays} ngày trước`;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Card */}
      <Card style={styles.headerCard}>
        <Card.Content style={styles.headerContent}>
          <Avatar.Text
            size={80}
            label={birthday.name.charAt(0).toUpperCase()}
            style={[styles.avatar, { backgroundColor: avatarColor }]}
          />
          <Title style={styles.name}>{birthday.name}</Title>
          <Paragraph style={styles.age}>{age} tuổi</Paragraph>
          
          <Chip
            icon={statusInfo.icon}
            style={[styles.statusChip, { backgroundColor: statusInfo.color }]}
            textStyle={styles.statusText}
          >
            {statusInfo.text}
          </Chip>
        </Card.Content>
      </Card>

      {/* Birthday Info Card */}
      <Card style={styles.infoCard}>
        <Card.Content>
          <Title>Thông tin sinh nhật</Title>
          
          <View style={styles.infoRow}>
            <IconButton icon="cake" size={20} style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Paragraph style={styles.infoLabel}>Ngày sinh</Paragraph>
              <Paragraph style={styles.infoValue}>{fullDate}</Paragraph>
            </View>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.infoRow}>
            <IconButton icon="calendar-clock" size={20} style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Paragraph style={styles.infoLabel}>Nhắc nhở</Paragraph>
              <Paragraph style={styles.infoValue}>{getReminderText()}</Paragraph>
            </View>
          </View>
          
          {birthday.email && (
            <>
              <Divider style={styles.divider} />
              <View style={styles.infoRow}>
                <IconButton icon="email" size={20} style={styles.infoIcon} />
                <View style={styles.infoContent}>
                  <Paragraph style={styles.infoLabel}>Email</Paragraph>
                  <Paragraph style={styles.infoValue}>{birthday.email}</Paragraph>
                </View>
              </View>
            </>
          )}
          
          {birthday.phone && (
            <>
              <Divider style={styles.divider} />
              <View style={styles.infoRow}>
                <IconButton icon="phone" size={20} style={styles.infoIcon} />
                <View style={styles.infoContent}>
                  <Paragraph style={styles.infoLabel}>Điện thoại</Paragraph>
                  <Paragraph style={styles.infoValue}>{birthday.phone}</Paragraph>
                </View>
              </View>
            </>
          )}
          
          {birthday.notes && (
            <>
              <Divider style={styles.divider} />
              <View style={styles.infoRow}>
                <IconButton icon="note-text" size={20} style={styles.infoIcon} />
                <View style={styles.infoContent}>
                  <Paragraph style={styles.infoLabel}>Ghi chú</Paragraph>
                  <Paragraph style={styles.infoValue}>{birthday.notes}</Paragraph>
                </View>
              </View>
            </>
          )}
        </Card.Content>
      </Card>

      {/* Actions Card */}
      <Card style={styles.actionsCard}>
        <Card.Content>
          <Title>Hành động</Title>
          
          <View style={styles.actionButtons}>
            <Button
              mode="contained"
              onPress={handleSendNotification}
              loading={loading}
              disabled={loading}
              style={styles.actionButton}
              icon="bell"
            >
              Gửi thông báo
            </Button>
            
            {birthday.phone && (
              <Button
                mode="outlined"
                onPress={handleCallPhone}
                style={styles.actionButton}
                icon="phone"
              >
                Gọi điện
              </Button>
            )}
            
            {birthday.email && (
              <Button
                mode="outlined"
                onPress={handleSendEmail}
                style={styles.actionButton}
                icon="email"
              >
                Gửi email
              </Button>
            )}
          </View>
        </Card.Content>
      </Card>

      {/* Edit/Delete Card */}
      <Card style={styles.editCard}>
        <Card.Content>
          <View style={styles.editButtons}>
            <Button
              mode="contained"
              onPress={handleEdit}
              style={[styles.editButton, styles.editButtonPrimary]}
              icon="pencil"
            >
              Chỉnh sửa
            </Button>
            
            <Button
              mode="outlined"
              onPress={handleDelete}
              loading={loading}
              disabled={loading}
              style={[styles.editButton, styles.deleteButton]}
              textColor="#B00020"
              icon="delete"
            >
              Xóa
            </Button>
          </View>
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
  headerCard: {
    margin: 16,
    elevation: 4
  },
  headerContent: {
    alignItems: 'center',
    paddingVertical: 20
  },
  avatar: {
    marginBottom: 16
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4
  },
  age: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12
  },
  statusChip: {
    borderRadius: 16
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold'
  },
  infoCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8
  },
  infoIcon: {
    margin: 0,
    marginRight: 12
  },
  infoContent: {
    flex: 1
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500'
  },
  divider: {
    marginVertical: 8
  },
  actionsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2
  },
  actionButtons: {
    marginTop: 8
  },
  actionButton: {
    marginBottom: 8
  },
  editCard: {
    marginHorizontal: 16,
    marginBottom: 32,
    elevation: 2
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  editButton: {
    flex: 1,
    marginHorizontal: 4
  },
  editButtonPrimary: {
    marginRight: 8
  },
  deleteButton: {
    borderColor: '#B00020',
    marginLeft: 8
  }
});

export default BirthdayDetailScreen;