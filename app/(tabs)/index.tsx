// List screen pattern from Tutorial 04/03 Step 3
// https://ucc.instructure.com/courses/86289/files
import ApplicationCard from '@/components/ApplicationCard';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { AppContext } from '../_layout';

export default function IndexScreen() {
  const context = useContext(AppContext);
  const router = useRouter();
  const [searchText, setSearchText] = useState('');

  if (!context) return null;

  const { applications, categories } = context;

  const filtered = applications.filter((app) => {
    const query = searchText.toLowerCase();
    return (
      app.companyName.toLowerCase().includes(query) ||
      app.position.toLowerCase().includes(query)
    );
  });

  const thisMonth = applications.filter((app) => {
    const appDate = new Date(app.appliedAt * 1000);
    const now = new Date();
    return appDate.getMonth() === now.getMonth() && appDate.getFullYear() === now.getFullYear();
  }).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>My applications</Text>
            <Text style={styles.subtitle}>{applications.length} total · {thisMonth} this month</Text>
          </View>
          <Pressable
            accessibilityLabel="Add new application"
            accessibilityRole="button"
            onPress={() => router.push('/application/new')}
          >
            <Text style={styles.addButtonText}>+</Text>
          </Pressable>
        </View>

        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search company or role..."
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={setSearchText}
            accessibilityLabel="Search applications"
          />
        </View>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {searchText ? 'No applications match your search' : 'No applications yet — tap + to add one'}
            </Text>
          </View>
        ) : (
          filtered.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              category={categories.find((c) => c.id === app.categoryID)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E6F1FB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#185FA5',
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#111827',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});