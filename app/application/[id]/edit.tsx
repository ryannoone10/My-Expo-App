// Edit screen adapted from tuturial
//https://github.com/rorypierce111/react-native-lab/blob/main/app/student/%5Bid%5D/edit.tsx
import CategoryPicker from '@/components/ui/category-picker';
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { db } from '@/db/index';
import { applications } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from '../../_layout';

export default function EditApplication() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(AppContext);

  if (!context) return null;

  const { applications: apps, categories, setApplications } = context;
  const application = apps.find((a) => a.id === Number(id));

  const [companyName, setCompanyName] = useState(application?.companyName || '');
  const [position, setPosition] = useState(application?.position || '');
  const [notes, setNotes] = useState(application?.notes || '');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    application?.categoryID || null
  );

  if (!application) return null;

  const saveChanges = async () => {
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

    await db
      .update(applications)
      .set({
        companyName: companyName.trim(),
        position: position.trim(),
        notes: notes.trim() || null,
        categoryID: selectedCategoryId,
      })
      .where(eq(applications.id, application.id));

    const rows = await db.select().from(applications);
    setApplications(rows);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Edit application" subtitle={application.companyName} />

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
          label="Save changes"
          onPress={saveChanges}
          disabled={!companyName.trim() || !position.trim() || !selectedCategoryId}
        />
        <PrimaryButton
          label="Cancel"
          onPress={() => router.back()}
          variant="secondary"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  content: {
    padding: 20,
  },
});