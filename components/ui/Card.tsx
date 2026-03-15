import { View, Pressable } from 'react-native';

type CardProps = {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
};

export function Card({ children, onPress, className = '' }: CardProps) {
  const baseStyles = `
    bg-white dark:bg-gray-800
    rounded-xl
    p-4
    shadow-sm
    border border-gray-100 dark:border-gray-700
    ${className}
  `;

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={`${baseStyles} active:bg-gray-50 dark:active:bg-gray-750`}
      >
        {children}
      </Pressable>
    );
  }

  return <View className={baseStyles}>{children}</View>;
}
