import { Pressable, Text, ActivityIndicator } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = {
  onPress: () => void;
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
};

const variantStyles: Record<ButtonVariant, { container: string; text: string }> = {
  primary: {
    container: 'bg-blue-600 active:bg-blue-700',
    text: 'text-white',
  },
  secondary: {
    container: 'bg-gray-200 active:bg-gray-300 dark:bg-gray-700 dark:active:bg-gray-600',
    text: 'text-gray-900 dark:text-gray-100',
  },
  outline: {
    container: 'border border-gray-300 dark:border-gray-600 active:bg-gray-100 dark:active:bg-gray-800',
    text: 'text-gray-900 dark:text-gray-100',
  },
  ghost: {
    container: 'active:bg-gray-100 dark:active:bg-gray-800',
    text: 'text-gray-900 dark:text-gray-100',
  },
  danger: {
    container: 'bg-red-600 active:bg-red-700',
    text: 'text-white',
  },
};

const sizeStyles: Record<ButtonSize, { container: string; text: string }> = {
  sm: {
    container: 'px-3 py-1.5 rounded-md',
    text: 'text-sm',
  },
  md: {
    container: 'px-4 py-2 rounded-lg',
    text: 'text-base',
  },
  lg: {
    container: 'px-6 py-3 rounded-xl',
    text: 'text-lg',
  },
};

export function Button({
  onPress,
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
}: ButtonProps) {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`
        ${variantStyle.container}
        ${sizeStyle.container}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-50' : ''}
        flex-row items-center justify-center
      `}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? '#fff' : '#666'}
        />
      ) : (
        <Text
          className={`
            ${variantStyle.text}
            ${sizeStyle.text}
            font-semibold text-center
          `}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
}
