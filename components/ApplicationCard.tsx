// Pattern adapted from StudentCard component
// https://github.com/rorypierce111/react-native-lab
import { Application, Category } from '@/app/_layout';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  application: Application;
  category: Category | undefined;
};

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  '0': { bg: '#FBEAF0', text: '#993556', label: 'Applied' },
  '1': { bg: '#E6F1FB', text: '#185FA5', label: 'Interviewing' },
  '2': { bg: '#EAF3DE', text: '#3B6D11', label: 'Offer' },
  '3': { bg: '#FCEBEB', text: '#A32D2D', label: 'Rejected' },
};

export default function ApplicationCard({ application, category }: Props) {
  const router = useRouter();

  const status = STATUS_STYLES[String(application.metric)] || STATUS_STYLES['0'];

  const dateString = new Date(application.appliedAt * 1000).toLocaleDateString('en-IE', {
    day: 'numeric',
    month: 'short',
  });

  return (
    <Pressable
      accessibilityLabel={`${application.companyName}, ${application.position}, ${status.label}`}
      accessibilityRole="button"
      onPress={() =>{
        // add navigate to detail screen
      }}
      style={({ pressed }) => [styles.card, pressed ? styles.cardPressed : null]}
    >
      <View style={styles.topRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.company}>{application.companyName}</Text>
          <Text style={styles.position}>{application.position}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: status.bg }]}>
          <Text style={[styles.badgeText, { color: status.text }]}>{status.label}</Text>
        </View>
      </View>

      <View style={styles.bottomRow}>
        {category && (
          <View style={styles.categoryTag}>
            <View style={[styles.categoryDot, { backgroundColor: category.colour }]} />
            <Text style={styles.categoryText}>{category.name}</Text>
          </View>
        )}
        <Text style={styles.dateText}>Applied {dateString}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    padding: 14,
  },
  cardPressed: {
    opacity: 0.88,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  company: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  position: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 10,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#6B7280',
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});