// List screen pattern from Tutorial 04/03 Step 3
// https://ucc.instructure.com/courses/86289/pages/tutorial-04-slash-03?module_item_id=2909613
// Adapted from week 11 index.tsx file
// https://github.com/rorypierce111/react-native-lab/blob/main/app/(tabs)/index.tsx
import ApplicationCard from '@/components/ApplicationCard';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from '../_layout';

const DATE_FILTERS = [
  { label: 'All time', days: 0 },
  { label: '7 days', days: 7 },
  { label: '30 days', days: 30 },
  { label: '90 days', days: 90 },
];

export default function IndexScreen() {
  const context = useContext(AppContext);
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedDays, setSelectedDays] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  if (!context) return null;

  const { applications, categories } = context;

  const filtered = applications.filter((app) => {
    const query = searchText.toLowerCase();
    const matchesText =
      app.companyName.toLowerCase().includes(query) ||
      app.position.toLowerCase().includes(query);

    const matchesCategory =
      selectedCategoryId === null || app.categoryID === selectedCategoryId;

    let matchesDate = true;
    if (selectedDays > 0) {
      const cutoff = Math.floor(Date.now() / 1000) - selectedDays * 86400;
      matchesDate = app.appliedAt >= cutoff;
    }

    return matchesText && matchesCategory && matchesDate;
  });

  const thisMonth = applications.filter((app) => {
    const appDate = new Date(app.appliedAt * 1000);
    const now = new Date();
    return appDate.getMonth() === now.getMonth() && appDate.getFullYear() === now.getFullYear();
  }).length;

  const clearFilters = () => {
    setSearchText('');
    setSelectedCategoryId(null);
    setSelectedDays(0);
  };

  const hasFilters = searchText || selectedCategoryId !== null || selectedDays > 0;
  const activeFilterCount =
    (selectedCategoryId !== null ? 1 : 0) + (selectedDays > 0 ? 1 : 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>My applications</Text>
            <Text style={styles.subtitle}>
              {applications.length} total · {thisMonth} this month
            </Text>
          </View>
          <Pressable
            accessibilityLabel="Add new application"
            accessibilityRole="button"
            onPress={() => router.push('/application/new')}
            style={styles.addButton}
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
          <Pressable
            onPress={() => setShowFilters(!showFilters)}
            style={[styles.filterToggle, showFilters ? styles.filterToggleActive : null]}
            accessibilityLabel="Toggle filters"
            accessibilityRole="button"
          >
            <Text style={[styles.filterToggleText, showFilters ? styles.filterToggleTextActive : null]}>
              Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
            </Text>
          </Pressable>
        </View>

        {showFilters && (
          <View style={styles.filterPanel}>
            <Text style={styles.filterLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              <Pressable
                onPress={() => setSelectedCategoryId(null)}
                style={[
                  styles.filterChip,
                  selectedCategoryId === null ? styles.filterChipActive : null,
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedCategoryId === null ? styles.filterChipTextActive : null,
                  ]}
                >
                  All
                </Text>
              </Pressable>
              {categories.map((cat) => (
                <Pressable
                  key={cat.id}
                  onPress={() =>
                    setSelectedCategoryId(selectedCategoryId === cat.id ? null : cat.id)
                  }
                  style={[
                    styles.filterChip,
                    selectedCategoryId === cat.id ? { backgroundColor: cat.colour } : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedCategoryId === cat.id ? { color: '#FFFFFF' } : null,
                    ]}
                  >
                    {cat.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <Text style={styles.filterLabel}>Date range</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {DATE_FILTERS.map((df) => (
                <Pressable
                  key={df.days}
                  onPress={() => setSelectedDays(df.days)}
                  style={[
                    styles.filterChip,
                    selectedDays === df.days ? styles.filterChipActive : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedDays === df.days ? styles.filterChipTextActive : null,
                    ]}
                  >
                    {df.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {hasFilters && (
              <Pressable onPress={clearFilters} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>Clear all filters</Text>
              </Pressable>
            )}
          </View>
        )}
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {hasFilters
                ? 'No applications match your filters, add applications or clear filters to see results'
                : 'No applications yet, tap + to add one'}
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.resultCount}>
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </Text>
            {filtered.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                category={categories.find((c) => c.id === app.categoryID)}
              />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
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
  filterToggle: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterToggleActive: {
    backgroundColor: '#185FA5',
    borderColor: '#185FA5',
  },
  filterToggleText: {
    fontSize: 13,
    color: '#202327',
    fontWeight: '500',
  },
  filterToggleTextActive: {
    color: '#FFFFFF',
  },
  filterPanel: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#171717',
    marginTop: 8,
    marginBottom: 4,
  },
  filterScroll: {
    flexGrow: 0,
    marginBottom: 4,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    marginRight: 6,
  },
  filterChipActive: {
    backgroundColor: '#185FA5',
    borderColor: '#185FA5',
  },
  filterChipText: {
    fontSize: 12,
    color: '#374151',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  clearButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  clearButtonText: {
    fontSize: 12,
    color: '#185FA5',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  resultCount: {
    fontSize: 12,
    color: '#202122',
    marginBottom: 8,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#141415',
    textAlign: 'center',
  },
});