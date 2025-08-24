import React, { useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  Chip
} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import { AuthContext } from '../../context/AuthContext';
import { BirthdayService } from '../../services/birthdayService';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';
import { validateEmail, validatePhone } from '../../utils/helpers';

export const EditBirthdayScreen = ({ route, navigation }) => {
  const { birthday } = route.params;
  const [formData, setFormData] = useState({
    name: birthday.name || '',
    birthday: new Date(birthday.birthday),
    email: birthday.email || '',
    phone: birthday.phone || '',
    reminderDays: birthday.reminderDays || 1,
    notes: birthday.notes || ''
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { userToken } = useContext(AuthContext);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Tên là bắt buộc';
    }
    
    if (!formData.birthday) {
      newErrors.birthday = 'Ngày sinh là bắt buộc';
    } else {
      const birthDate = new Date(formData.birthday);
      const today = new Date();
      if (birthDate > today) {
        newErrors.birthday = 'Ngày sinh không thể là tương lai';
      }
    }
    
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    
    if (formData.reminderDays < 0 || formData.reminderDays > 365) {
      newErrors.reminderDays = 'Số ngày nhắc nhở phải từ 0 đến 365';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await BirthdayService.updateBirthday(
        birthday.id,
        formData,
        userToken
      );
      
      if (result.success) {
        Alert.alert('Thành công', 'Đã cập nhật sinh nhật', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Lỗi', result.message);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật sinh nhật');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Check if there are changes
    const hasChanges = (
      formData.name !== birthday.name ||
      formData.email !== (birthday.email || '') ||
      formData.phone !== (birthday.phone || '') ||
      formData.reminderDays !== birthday.reminderDays ||
      formData.notes !== (birthday.notes || '') ||
      new Date(formData.birthday).getTime() !== new Date(birthday.birthday).getTime()
    );

    if (hasChanges) {
      Alert.alert(
        'Hủy chỉnh sửa',
        'Bạn có thay đổi chưa được lưu. Bạn có chắc chắn muốn hủy?',
        [
          { text: 'Tiếp tục chỉnh sửa', style: 'cancel' },
          { text: 'Hủy', style: 'destructive', onPress: () => navigation.goBack() }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const reminderDaysOptions = [
    { label: 'Cùng ngày', value: 0 },
    { label: '1 ngày trước', value: 1 },
    { label: '3 ngày trước', value: 3 },
    { label: '1 tuần trước', value: 7 },
    { label: '2 tuần trước', value: 14 },
    { label: '1 tháng trước', value: 30 }
  ];

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Chỉnh sửa sinh nhật</Title>
          
          <CustomInput
            label="Tên *"
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            error={errors.name}
            style={styles.input}
          />
          
          <View style={styles.dateContainer}>
            <CustomInput
              label="Ngày sinh *"
              value={formatDate(formData.birthday)}
              onFocus={() => setShowDatePicker(true)}
              error={errors.birthday}
              style={styles.input}
              editable={false}
            />
            <Button 
              mode="outlined" 
              onPress={() => setShowDatePicker(true)}
              style={styles.dateButton}
            >
              Chọn ngày
            </Button>
          </View>
          
          <CustomInput
            label="Email"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            error={errors.email}
            keyboardType="email-address"
            style={styles.input}
          />
          
          <CustomInput
            label="Số điện thoại"
            value={formData.phone}
            onChangeText={(value) => handleInputChange('phone', value)}
            error={errors.phone}
            keyboardType="phone-pad"
            style={styles.input}
          />
          
          <View style={styles.reminderContainer}>
            <Paragraph style={styles.reminderLabel}>Nhắc nhở trước:</Paragraph>
            <View style={styles.reminderOptions}>
              {reminderDaysOptions.map((option) => (
                <Chip
                  key={option.value}
                  selected={formData.reminderDays === option.value}
                  onPress={() => handleInputChange('reminderDays', option.value)}
                  style={styles.reminderChip}
                >
                  {option.label}
                </Chip>
              ))}
            </View>
          </View>
          
          <CustomInput
            label="Ghi chú"
            value={formData.notes}
            onChangeText={(value) => handleInputChange('notes', value)}
            multiline
            numberOfLines={3}
            style={styles.input}
          />
        </Card.Content>
      </Card>
      
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Lưu thay đổi"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          style={styles.submitButton}
        />
        
        <CustomButton
          title="Hủy"
          onPress={handleCancel}
          mode="outlined"
          style={styles.cancelButton}
        />
      </View>
      
      <DatePicker
        modal
        open={showDatePicker}
        date={formData.birthday}
        mode="date"
        onConfirm={(date) => {
          setShowDatePicker(false);
          handleInputChange('birthday', date);
        }}
        onCancel={() => setShowDatePicker(false)}
        maximumDate={new Date()}
        title="Chọn ngày sinh"
        confirmText="Xác nhận"
        cancelText="Hủy"
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
    elevation: 4
  },
  input: {
    marginBottom: 8
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  dateButton: {
    marginLeft: 8,
    height: 40
  },
  reminderContainer: {
    marginBottom: 16
  },
  reminderLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8
  },
  reminderOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  reminderChip: {
    marginRight: 8,
    marginBottom: 8
  },
  buttonContainer: {
    padding: 16
  },
  submitButton: {
    marginBottom: 8
  },
  cancelButton: {
    marginBottom: 16
  }
});

export default EditBirthdayScreen;