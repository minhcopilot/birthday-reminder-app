import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl
} from 'react-native';
import {
  Text,
  FAB,
  Card,
  Title,
  Paragraph,
  IconButton,
  Searchbar,
  Chip
} from 'react-native-paper';
import { AuthContext } from '../../context/AuthContext';
import { BirthdayService } from '../../services/birthdayService';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { BirthdayCard } from '../../components/BirthdayCard';

export const BirthdayListScreen = ({ navigation }) => {
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, upcoming, today
  const { userToken } = useContext(AuthContext);

  const fetchBirthdays = async () => {
    try {
      setLoading(true);
      const response = await BirthdayService.getBirthdays(userToken);
      setBirthdays(response.data);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách sinh nhật');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBirthdays();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchBirthdays();
  };

  const handleDeleteBirthday = async (birthdayId) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa sinh nhật này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await BirthdayService.deleteBirthday(birthdayId, userToken);
              setBirthdays(birthdays.filter(b => b.id !== birthdayId));
              Alert.alert('Thành công', 'Đã xóa sinh nhật');
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể xóa sinh nhật');
            }
          }
        }
      ]
    );
  };

  const handleEditBirthday = (birthday) => {
    navigation.navigate('EditBirthday', { birthday });
  };

  const handleViewBirthday = (birthday) => {
    navigation.navigate('BirthdayDetail', { birthday });
  };

  const getFilteredBirthdays = () => {
    let filtered = birthdays;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(birthday =>
        birthday.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        birthday.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply date filter
    if (filter === 'upcoming') {
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      
      filtered = filtered.filter(birthday => {
        const birthDate = new Date(birthday.birthday);
        const currentYear = today.getFullYear();
        const nextBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
        
        if (nextBirthday < today) {
          nextBirthday.setFullYear(currentYear + 1);
        }
        
        return nextBirthday >= today && nextBirthday <= nextWeek;
      });
    } else if (filter === 'today') {
      const today = new Date();
      filtered = filtered.filter(birthday => {
        const birthDate = new Date(birthday.birthday);
        return birthDate.getMonth() === today.getMonth() && 
               birthDate.getDate() === today.getDate();
      });
    }

    return filtered;
  };

  const renderBirthdayItem = ({ item }) => (
    <BirthdayCard
      birthday={item}
      onEdit={() => handleEditBirthday(item)}
      onDelete={() => handleDeleteBirthday(item.id)}
      onPress={() => handleViewBirthday(item)}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {searchQuery ? 'Không tìm thấy sinh nhật nào' : 'Chưa có sinh nhật nào'}
      </Text>
      <Text style={styles.emptySubtext}>
        {searchQuery ? 'Thử tìm kiếm từ khóa khác' : 'Nhấn + để thêm sinh nhật mới'}
      </Text>
    </View>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Tìm kiếm sinh nhật..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />
      
      <View style={styles.filterContainer}>
        <Chip
          selected={filter === 'all'}
          onPress={() => setFilter('all')}
          style={styles.chip}
        >
          Tất cả
        </Chip>
        <Chip
          selected={filter === 'upcoming'}
          onPress={() => setFilter('upcoming')}
          style={styles.chip}
        >
          Sắp đến
        </Chip>
        <Chip
          selected={filter === 'today'}
          onPress={() => setFilter('today')}
          style={styles.chip}
        >
          Hôm nay
        </Chip>
      </View>

      <FlatList
        data={getFilteredBirthdays()}
        renderItem={renderBirthdayItem}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddBirthday')}
        label="Thêm sinh nhật"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  searchbar: {
    margin: 16,
    marginBottom: 8
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16
  },
  chip: {
    marginRight: 8
  },
  listContainer: {
    padding: 16,
    paddingTop: 0
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center'
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0
  }
});

export default BirthdayListScreen;