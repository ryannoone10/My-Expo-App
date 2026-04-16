// Reusable info tag from tuturial,
//https://github.com/rorypierce111/react-native-lab/blob/main/components/ui/info-tag.tsx
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  label: string;
  value: string;
};

export default function InfoTag({ label, value }: Props) {
  return (
    <View style={styles.tag}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
});