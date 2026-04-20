// Settings screen - category management
// Tutorial: Tutorial 02/25 SettingsId pattern for add/edit mode
// Tutorial: Tutorial 18/03 insert into DB then reload with db.select()
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { db } from '@/db/index';
import { categories as categoriesTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useContext, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from '../_layout';

const COLOUR_OPTIONS = [
  '#007AFF', '#34C759', '#FF9500', '#AF52DE', '#FF3B30',
  '#5856D6', '#00C7BE', '#FF2D55', '#A2845E', '#30B0C7',
];

export default function SettingsScreen() {
  const context = useContext(AppContext);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [selectedColour, setSelectedColour] = useState(COLOUR_OPTIONS[0]);
  const [icon, setIcon] = useState('');

  if (!context) return null;

  const { categories, setCategories } = context;

  const resetForm = () => {
    setName('');
    setSelectedColour(COLOUR_OPTIONS[0]);
    setIcon('');
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (cat: typeof categories[0]) => {
    setName(cat.name);
    setSelectedColour(cat.colour);
    setIcon(cat.icon || '');
    setEditingId(cat.id);
    setShowForm(true);
  };

  const saveCategory = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Category name is required');
      return;
    }

    if (editingId) {
      // Drizzle ORM: update with .set() and .where(eq()): https://orm.drizzle.team/docs/update
      await db
        .update(categoriesTable)
        .set({
          name: name.trim(),
          colour: selectedColour,
          icon: icon.trim() || 'folder',
        })
        .where(eq(categoriesTable.id, editingId));
    } else {
      // Drizzle ORM: insert().values(): https://orm.drizzle.team/docs/insert
      await db.insert(categoriesTable).values({
        userID: 1,
        name: name.trim(),
        colour: selectedColour,
        icon: icon.trim() || 'folder',
      });
    }

    const rows = await db.select().from(categoriesTable);
    setCategories(rows);
    resetForm();
  };

  const deleteCategory = (cat: typeof categories[0]) => {
    // React Native: Alert.alert with destructive action: https://reactnative.dev/docs/alert
    Alert.alert(
      'Delete category',
      `Are you sure you want to delete "${cat.name}"? Applications using this category won't be deleted.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            // Drizzle ORM: delete with where(eq()): https://orm.drizzle.team/docs/delete
            await db.delete(categoriesTable).where(eq(categoriesTable.id, cat.id));
            const rows = await db.select().from(categoriesTable);
            setCategories(rows);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Settings" />

        <Text style={styles.sectionTitle}>Categories</Text>

        {categories.length === 0 ? (
          <Text style={styles.emptyText}>No categories yet</Text>
        ) : (
          categories.map((cat) => (
            <View key={cat.id} style={styles.categoryItem}>
              <View style={styles.categoryLeft}>
                <View style={[styles.categoryDot, { backgroundColor: cat.colour }]} />
                <Text style={styles.categoryName}>{cat.name}</Text>
              </View>
              <View style={styles.categoryActions}>
                <Pressable
                  onPress={() => startEdit(cat)}
                  accessibilityLabel={`Edit ${cat.name}`}
                  accessibilityRole="button"
                >
                  <Text style={styles.editText}>Edit</Text>
                </Pressable>
                <Pressable
                  onPress={() => deleteCategory(cat)}
                  accessibilityLabel={`Delete ${cat.name}`}
                  accessibilityRole="button"
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}

        {showForm ? (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>
              {editingId ? 'Edit category' : 'New category'}
            </Text>

            <FormField
              label="Name"
              value={name}
              onChangeText={setName}
              placeholder="e.g. Marketing"
            />

            <FormField
              label="Icon name (optional)"
              value={icon}
              onChangeText={setIcon}
              placeholder="e.g. briefcase"
            />

            <Text style={styles.colourLabel}>Colour</Text>
            <View style={styles.colourRow}>
              {COLOUR_OPTIONS.map((colour) => (
                <Pressable
                  key={colour}
                  onPress={() => setSelectedColour(colour)}
                  accessibilityLabel={`Select colour ${colour}`}
                  accessibilityRole="button"
                  style={[
                    styles.colourCircle,
                    { backgroundColor: colour },
                    selectedColour === colour ? styles.colourSelected : null,
                  ]}
                />
              ))}
            </View>

            <PrimaryButton
              label={editingId ? 'Save changes' : 'Add category'}
              onPress={saveCategory}
              disabled={!name.trim()}
            />
            <PrimaryButton
              label="Cancel"
              onPress={resetForm}
              variant="secondary"
            />
          </View>
        ) : (
          <PrimaryButton
            label="Add new category"
            onPress={() => setShowForm(true)}
          />
        )}

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Account</Text>

        {context.currentUser && (
          <View style={styles.accountCard}>
            <Text style={styles.accountName}>{context.currentUser.username}</Text>
            <Text style={styles.accountEmail}>{context.currentUser.email}</Text>
          </View>
        )}

        <PrimaryButton
          label="Log out"
          onPress={async () => {
            const { logout } = await import('@/lib/auth');
            await logout();
            context.setCurrentUser(null);
          }}
          variant="secondary"
        />

        <PrimaryButton
          label="Delete account"
          onPress={() => {
            Alert.alert(
              'Delete account',
              'This will permanently delete your account and all data. Are you sure?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: async () => {
                    if (!context.currentUser) return;
                    const { deleteAccount } = await import('@/lib/auth');
                    await deleteAccount(context.currentUser.id);
                    context.setCurrentUser(null);
                  },
                },
              ]
            );
          }}
          variant="danger"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    marginBottom: 8,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  categoryActions: {
    flexDirection: 'row',
    gap: 16,
  },
  editText: {
    fontSize: 13,
    color: '#185FA5',
    fontWeight: '500',
  },
  deleteText: {
    fontSize: 13,
    color: '#A32D2D',
    fontWeight: '500',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginTop: 12,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  colourLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  colourRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colourCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  colourSelected: {
    borderWidth: 3,
    borderColor: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 24,
  },
  comingSoon: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  accountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    marginBottom: 12,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  accountEmail: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
});