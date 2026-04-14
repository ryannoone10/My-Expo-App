// Reusable category picker - Week 9 Lecture, UI Component Reusability
import { Category } from '@/app/_layout';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  label: string;
  categories: Category[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

export default function CategoryPicker({ label, categories, selectedId, onSelect }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {categories.map((cat) => (
          <Pressable
            key={cat.id}
            accessibilityLabel={`Category ${cat.name}`}
            accessibilityRole="button"
            onPress={() => onSelect(cat.id)}
            style={[
              styles.chip,
              selectedId === cat.id ? { backgroundColor: cat.colour } : null,
            ]}
          >
            <View style={[styles.dot, { backgroundColor: cat.colour }]} />
            <Text
              style={[
                styles.chipText,
                selectedId === cat.id ? { color: '#FFFFFF' } : null,
              ]}
            >
              {cat.name}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  chipText: {
    fontSize: 13,
    color: '#374151',
  },
});