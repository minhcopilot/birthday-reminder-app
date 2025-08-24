import React from 'react';
import { TextInput, HelperText } from 'react-native-paper';

export const CustomInput = ({ 
  label, 
  value, 
  onChangeText, 
  error, 
  helperText,
  mode = 'outlined',
  style,
  ...props 
}) => {
  return (
    <>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        mode={mode}
        error={!!error}
        style={[{ marginVertical: 8 }, style]}
        {...props}
      />
      {(error || helperText) && (
        <HelperText type={error ? 'error' : 'info'} visible={!!(error || helperText)}>
          {error || helperText}
        </HelperText>
      )}
    </>
  );
};

export default CustomInput;