import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { theme } from '../styles/theme';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Birthday Reminder</Text>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={styles.subtitle}>Không bao giờ quên một ngày sinh nhật</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text,
    marginTop: 20,
  },
});

export default SplashScreen; 