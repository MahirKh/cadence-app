import { TextInput, View, Text } from 'react-native';
import { forwardRef } from 'react';

type InputProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: 'off' | 'email' | 'password' | 'username';
  editable?: boolean;
};

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      placeholder,
      value,
      onChangeText,
      error,
      multiline = false,
      numberOfLines = 1,
      secureTextEntry = false,
      keyboardType = 'default',
      autoCapitalize = 'sentences',
      autoComplete = 'off',
      editable = true,
    },
    ref
  ) => {
    return (
      <View className="mb-4">
        {label && (
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {label}
          </Text>
        )}
        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          className={`
            bg-white dark:bg-gray-800
            border rounded-lg px-4 py-3
            text-base text-gray-900 dark:text-gray-100
            ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
            ${multiline ? 'min-h-[100px] text-start' : ''}
            ${!editable ? 'opacity-50' : ''}
          `}
          style={multiline ? { textAlignVertical: 'top' } : undefined}
        />
        {error && (
          <Text className="text-sm text-red-500 mt-1">{error}</Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';
