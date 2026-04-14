// imports adapted from Lecture 9, slide 8 
// Functionality adapted from https://github.com/rorypierce111/react-native-lab/blob/main/app/student/%5Bid%5D.tsx
import CategoryPicker from '@/components/ui/category-picker';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { db } from '@/db/index';
import { applications, applicationStatusLogs } from '@/db/schema';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { AppContext } from '../_layout';

export default function NewApplication() {
  const router = useRouter();
  const context = useContext(AppContext);

  const [companyName, setCompanyName] = useState('');
  const [position, setPosition] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  if (!context) return null;

  const { categories, setApplications } = context;

  const saveApplication = async () => {
    if (!companyName.trim()) {
      Alert.alert('Error', 'Company name is required');
      return;
    }
    if (!position.trim()) {
      Alert.alert('Error', 'Position is required');
      return;
    }
    if (!selectedCategoryId) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    const now = Math.floor(Date.now() / 1000);

    const [newApp] = await db.insert(applications).values({
      userID: 1,
      categoryID: selectedCategoryId,
      companyName: companyName.trim(),
      position: position.trim(),
      notes: notes.trim() || null,
      metric: 1,
      appliedAt: now,
      createdAt: now,
    }).returning();

    await db.insert(applicationStatusLogs).values({
      applicationID: newApp.id,
      oldStatus: -1,
      newStatus: 0,
      changedAt: now,
    });

    const rows = await db.select().from(applications);
    setApplications(rows);
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader title="New application" />

      <FormField
        label="Company name"
        value={companyName}
        onChangeText={setCompanyName}
        placeholder="e.g. Google"
      />

      <FormField
        label="Position"
        value={position}
        onChangeText={setPosition}
        placeholder="e.g. Software Engineer"
      />

      <CategoryPicker
        label="Category"
        categories={categories}
        selectedId={selectedCategoryId}
        onSelect={setSelectedCategoryId}
      />

      <FormField
        label="Notes (optional)"
        value={notes}
        onChangeText={setNotes}
        placeholder="Any extra details..."
        multiline
        numberOfLines={4}
      />

      <PrimaryButton
        label="Save application"
        onPress={saveApplication}
        disabled={!companyName.trim() || !position.trim() || !selectedCategoryId}
      />
      <PrimaryButton
        label="Cancel"
        onPress={() => router.back()}
        variant="secondary"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
});