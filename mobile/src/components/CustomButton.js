import React from 'react';
import { Button } from 'react-native-paper';

export const CustomButton = ({ 
  title, 
  onPress, 
  mode = 'contained', 
  disabled = false,
  loading = false,
  style,
  icon,
  ...props 
}) => {
  return (
    <Button
      mode={mode}
      onPress={onPress}
      disabled={disabled || loading}
      loading={loading}
      style={[{ marginVertical: 8 }, style]}
      icon={icon}
      {...props}
    >
      {title}
    </Button>
  );
};

export default CustomButton;