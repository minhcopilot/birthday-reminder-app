import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Chip,
  IconButton,
  Text,
  Button
} from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { NotificationService } from '../services/notificationService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { formatNotificationTime } from '../utils/helpers';

export const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { userToken } = useContext(AuthContext);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const result = await NotificationService.getNotificationHistory(userToken, {
        page: pageNum,
        limit: 10
      });

      if (result.success) {
        const newNotifications = result.data.notifications || [];
        
        if (refresh || pageNum === 1) {
          setNotifications(newNotifications);
        } else {
          setNotifications(prev => [...prev, ...newNotifications]);
        }
        
        setHasMore(pageNum < result.data.totalPages);
        setPage(pageNum);
      } else {
        Alert.alert('Lỗi', result.message);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải lịch sử thông báo');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchNotifications(1, true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchNotifications(page + 1);
    }
  };

  const sendTestNotification = async () => {
    try {
      const result = await NotificationService.sendTestNotification(userToken);
      if (result.success) {
        Alert.alert('Thành công', 'Đã gửi thông báo thử nghiệm');
        handleRefresh();
      } else {
        Alert.alert('Lỗi', result.message);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể gửi thông báo thử nghiệm');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent': return '#4CAF50';
      case 'failed': return '#F44336';
      case 'pending': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'sent': return 'Đã gửi';
      case 'failed': return 'Thất bại';
      case 'pending': return 'Đang chờ';
      default: return 'Không xác định';
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'push': return 'Thông báo';
      case 'email': return 'Email';
      default: return 'Khác';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'push': return 'bell';
      case 'email': return 'email';
      default: return 'help';
    }
  };

  const renderNotificationItem = ({ item }) => (
    <Card style={styles.notificationCard}>
      <Card.Content>
        <View style={styles.notificationHeader}>
          <View style={styles.notificationInfo}>
            <View style={styles.typeContainer}>
              <IconButton
                icon={getTypeIcon(item.type)}
                size={16}
                style={styles.typeIcon}
              />
              <Text style={styles.typeText}>{getTypeText(item.type)}</Text>
            </View>
            <Text style={styles.dateText}>
              {formatNotificationTime(item.sentAt)}
            </Text>
          </View>
          <Chip
            style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}
            textStyle={styles.statusText}
          >
            {getStatusText(item.status)}
          </Chip>
        </View>
        
        {item.birthday && (
          <View style={styles.birthdayInfo}>
            <Title style={styles.birthdayName}>{item.birthday.name}</Title>
            <Paragraph style={styles.birthdayDate}>
              Sinh nhật: {new Date(item.birthday.birthday).toLocaleDateString('vi-VN')}
            </Paragraph>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <IconButton icon="bell-off" size={48} style={styles.emptyIcon} />
      <Text style={styles.emptyText}>Chưa có thông báo nào</Text>
      <Text style={styles.emptySubtext}>
        Các thông báo sinh nhật sẽ xuất hiện ở đây
      </Text>
      <Button
        mode="contained"
        onPress={sendTestNotification}
        style={styles.testButton}
      >
        Gửi thông báo thử nghiệm
      </Button>
    </View>
  );

  const renderFooter = () => {
    if (!loading || notifications.length === 0) return null;
    
    return (
      <View style={styles.footerLoader}>
        <LoadingSpinner text="Đang tải thêm..." size="small" />
      </View>
    );
  };

  if (loading && notifications.length === 0) {
    return <LoadingSpinner text="Đang tải lịch sử thông báo..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Lịch sử thông báo</Title>
        <Button
          mode="outlined"
          onPress={sendTestNotification}
          style={styles.testButton}
          compact
        >
          Thử nghiệm
        </Button>
      </View>
      
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        contentContainerStyle={[
          styles.listContainer,
          notifications.length === 0 && styles.emptyListContainer
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  testButton: {
    height: 36
  },
  listContainer: {
    padding: 16,
    paddingTop: 8
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  notificationCard: {
    marginBottom: 12,
    elevation: 2
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  notificationInfo: {
    flex: 1
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  typeIcon: {
    margin: 0,
    marginRight: 4
  },
  typeText: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  dateText: {
    fontSize: 12,
    color: '#666'
  },
  statusChip: {
    borderRadius: 16,
    height: 28
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold'
  },
  birthdayInfo: {
    marginTop: 8
  },
  birthdayName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4
  },
  birthdayDate: {
    fontSize: 14,
    color: '#666'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32
  },
  emptyIcon: {
    opacity: 0.5,
    marginBottom: 16
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center'
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24
  },
  footerLoader: {
    padding: 16
  }
});

export default NotificationsScreen;