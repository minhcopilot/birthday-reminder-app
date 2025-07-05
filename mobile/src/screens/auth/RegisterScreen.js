import React, { useState, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';

const RegisterScreen = ({ navigation }) => {
  const { register } = useContext(AuthContext);
  const { fcmToken } = useContext(NotificationContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  
  const { control, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });
  
  const password = watch('password');

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    
    const userData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      fcmToken
    };
    
    const result = await register(userData);
    
    setIsLoading(false);
    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Đăng ký tài khoản</Text>
        
        <Controller
          control={control}
          rules={{
            required: 'Họ không được để trống'
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Họ"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
              error={!!errors.lastName}
            />
          )}
          name="lastName"
        />
        {errors.lastName && <HelperText type="error">{errors.lastName.message}</HelperText>}
        
        <Controller
          control={control}
          rules={{
            required: 'Tên không được để trống'
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Tên"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
              error={!!errors.firstName}
            />
          )}
          name="firstName"
        />
        {errors.firstName && <HelperText type="error">{errors.firstName.message}</HelperText>}
        
        <Controller
          control={control}
          rules={{
            required: 'Email không được để trống',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Email không hợp lệ'
            }
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Email"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
              error={!!errors.email}
            />
          )}
          name="email"
        />
        {errors.email && <HelperText type="error">{errors.email.message}</HelperText>}
        
        <Controller
          control={control}
          rules={{
            required: 'Mật khẩu không được để trống',
            minLength: {
              value: 6,
              message: 'Mật khẩu phải có ít nhất 6 ký tự'
            }
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Mật khẩu"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={secureTextEntry}
              style={styles.input}
              error={!!errors.password}
              right={
                <TextInput.Icon
                  icon={secureTextEntry ? 'eye' : 'eye-off'}
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                />
              }
            />
          )}
          name="password"
        />
        {errors.password && <HelperText type="error">{errors.password.message}</HelperText>}
        
        <Controller
          control={control}
          rules={{
            required: 'Vui lòng xác nhận mật khẩu',
            validate: value => value === password || 'Mật khẩu không khớp'
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Xác nhận mật khẩu"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={secureTextEntry}
              style={styles.input}
              error={!!errors.confirmPassword}
            />
          )}
          name="confirmPassword"
        />
        {errors.confirmPassword && <HelperText type="error">{errors.confirmPassword.message}</HelperText>}
        
        {error && <HelperText type="error">{error}</HelperText>}
        
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          style={styles.button}
          loading={isLoading}
          disabled={isLoading}
        >
          Đăng ký
        </Button>
        
        <View style={styles.linkContainer}>
          <Text>Đã có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    paddingVertical: 6,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  link: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
});

export default RegisterScreen; 