// Adapted from https://github.com/rorypierce111/react-native-lab/blob/main/components/ui/form-field.tsx
// And week 9 and 12 lectures
import { StyleSheet, Text, TextInput, View } from 'react-native';

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
};

export default function FormField({ label, value, onChangeText, placeholder, multiline = false, numberOfLines = 1, secureTextEntry = true }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={[styles.input, multiline ? styles.multiline : null]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={"#9CA3AF"}
                multiline={multiline}
                numberOfLines={numberOfLines}
                accessibilityLabel={label}
                secureTextEntry={secureTextEntry}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 14,
        color: '#111827',
    },
    multiline: {
        height: 100,
        textAlignVertical: 'top',
    },
});
