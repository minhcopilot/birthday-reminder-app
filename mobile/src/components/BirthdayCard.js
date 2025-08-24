import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, IconButton, Chip } from 'react-native-paper';
import { calculateAge, formatBirthday, daysUntilBirthday } from '../utils/helpers';

export const BirthdayCard = ({ birthday, onEdit, onDelete, onPress }) => {
  const age = calculateAge(birthday.birthday);
  const formattedDate = formatBirthday(birthday.birthday);
  const daysUntil = daysUntilBirthday(birthday.birthday);
  
  const getStatusColor = () => {
    if (daysUntil === 0) return '#4CAF50'; // Today - green
    if (daysUntil <= 7) return '#FF9800'; // This week - orange
    return '#2196F3'; // Default - blue
  };

  const getStatusText = () => {
    if (daysUntil === 0) return 'Hôm nay';
    if (daysUntil === 1) return 'Ngày mai';
    if (daysUntil <= 7) return `${daysUntil} ngày nữa`;
    return `${daysUntil} ngày nữa`;
  };

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Title style={styles.title}>{birthday.name}</Title>
            <Paragraph style={styles.subtitle}>
              {formattedDate} • {age} tuổi
            </Paragraph>
          </View>
          <Chip
            style={[styles.statusChip, { backgroundColor: getStatusColor() }]}
            textStyle={styles.statusText}
          >
            {getStatusText()}
          </Chip>
        </View>
        
        {birthday.notes && (
          <Paragraph style={styles.notes} numberOfLines={2}>
            {birthday.notes}
          </Paragraph>
        )}
        
        <View style={styles.actions}>
          <IconButton
            icon="pencil"
            size={20}
            onPress={onEdit}
            style={styles.actionButton}
          />
          <IconButton
            icon="delete"
            size={20}
            onPress={onDelete}
            style={styles.actionButton}
          />
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    elevation: 2
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  titleContainer: {
    flex: 1,
    marginRight: 12
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4
  },
  subtitle: {
    fontSize: 14,
    color: '#666'
  },
  statusChip: {
    borderRadius: 16
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold'
  },
  notes: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontStyle: 'italic'
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8
  },
  actionButton: {
    marginLeft: 4
  }
});

export default BirthdayCard;