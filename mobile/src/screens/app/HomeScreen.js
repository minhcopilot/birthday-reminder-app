import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, Title, Paragraph, FAB, ActivityIndicator } from 'react-native-paper';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { AuthContext } from '../../context/AuthContext';

const HomeScreen = ({ navigation }) => {
  const { userInfo } = useContext(AuthContext);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUpcomingBirthdays();
  }, []);

  const fetchUpcomingBirthdays = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/api/birthdays`);
      
      // Sort birthdays by upcoming date
      const birthdays = response.data.birthdays;
      const today = new Date();
      const sorted = birthdays.sort((a, b) => {
        const dateA = new Date(a.birthday);
        const dateB = new Date(b.birthday);
        
        // Set year to current year for comparison
        dateA.setFullYear(today.getFullYear());
        dateB.setFullYear(today.getFullYear());
        
        // If the date has already passed this year, add a year
        if (dateA < today) dateA.setFullYear(today.getFullYear() + 1);
        if (dateB < today) dateB.setFullYear(today.getFullYear() + 1);
        
        return dateA - dateB;
      });
      
      // Get only the next 5 birthdays
      setUpcomingBirthdays(sorted.slice(0, 5));
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching birthdays:', error);
      setError('Không thể tải dữ liệu sinh nhật. Vui lòng thử lại sau.');
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  const getDaysUntilBirthday = (dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    
    // Set year to current year for comparison
    birthDate.setFullYear(today.getFullYear());
    
    // If the date has already passed this year, add a year
    if (birthDate < today) {
      birthDate.setFullYear(today.getFullYear() + 1);
    }
    
    // Calculate days difference
    const diffTime = birthDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const renderBirthdayItem = ({ item }) => {
    const daysUntil = getDaysUntilBirthday(item.birthday);
    let daysText = '';
    
    if (daysUntil === 0) {
      daysText = 'Hôm nay';
    } else if (daysUntil === 1) {
      daysText = 'Ngày mai';
    } else {
      daysText = `${daysUntil} ngày nữa`;
    }
    
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('BirthdayStack', {
          screen: 'BirthdayDetail',
          params: { birthdayId: item.id }
        })}
      >
        <Card style={styles.card}>
          <Card.Content>
            <Title>{item.name}</Title>
            <Paragraph>Sinh nhật: {formatDate(item.birthday)}</Paragraph>
            <Text style={styles.daysText}>{daysText}</Text>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Xin chào, {userInfo?.firstName}!</Text>
        <Text style={styles.subtitle}>Sinh nhật sắp tới</Text>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchUpcomingBirthdays}>
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : upcomingBirthdays.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Bạn chưa có sinh nhật nào.</Text>
          <Text>Hãy thêm sinh nhật để nhận nhắc nhở!</Text>
        </View>
      ) : (
        <FlatList
          data={upcomingBirthdays}
          renderItem={renderBirthdayItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('BirthdayStack', {
          screen: 'AddBirthday'
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 8,
  },
  retryText: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  daysText: {
    marginTop: 8,
    color: '#6200ee',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
});

export default HomeScreen; 