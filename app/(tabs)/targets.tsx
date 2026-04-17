// Targets screen weekly/monthly goals with progress
// Pattern adapted from Tutorial 04/03 context usage
import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { db } from '@/db/index';
import { targets as targetsTable } from '@/db/schema';
import { eq, InferSelectModel } from 'drizzle-orm';
import { useContext, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from '../_layout';

type Target = InferSelectModel<typeof targetsTable>;

export default function TargetsScreen() {
  const context = useContext(AppContext);
  const [targets, setTargets] = useState<Target[]>([]);
  const [goalValue, setGoalValue] = useState('');
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadTargets();
  }, []);

  const loadTargets = async () => {
    const rows = await db.select().from(targetsTable);
    setTargets(rows);
  };

  if (!context) return null;

  const { applications } = context;

  const now = new Date();

  const getWeekStart = () => {
    const d = new Date(now);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const getMonthStart = () => {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  };

  const weeklyCount = applications.filter((app) => {
    const appDate = new Date(app.appliedAt * 1000);
    return appDate >= getWeekStart();
  }).length;

  const monthlyCount = applications.filter((app) => {
    const appDate = new Date(app.appliedAt * 1000);
    return appDate >= getMonthStart();
  }).length;

  const getProgress = (target: Target) => {
    const count = target.period === 'weekly' ? weeklyCount : monthlyCount;
    const percentage = Math.min((count / target.goalValue) * 100, 100);
    return { count, percentage };
  };

  const saveTarget = async () => {
    const value = parseInt(goalValue);
    if (!value || value <= 0) {
      Alert.alert('Error', 'Please enter a valid goal number');
      return;
    }

    await db.insert(targetsTable).values({
      userID: 1,
      period,
      goalValue: value,
    });

    setGoalValue('');
    setShowForm(false);
    await loadTargets();
  };

  const deleteTarget = async (targetId: number) => {
    Alert.alert('Delete target', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await db.delete(targetsTable).where(eq(targetsTable.id, targetId));
          await loadTargets();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader
          title="Targets"
          subtitle={`${weeklyCount} this week · ${monthlyCount} this month`}
        />

        {targets.length === 0 && !showForm ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No targets set yet</Text>
            <Text style={styles.emptySubtext}>Set a goal to track your application progress</Text>
          </View>
        ) : (
          targets.map((target) => {
            const { count, percentage } = getProgress(target);
            const met = count >= target.goalValue;

            return (
              <View key={target.id} style={styles.targetCard}>
                <View style={styles.targetHeader}>
                  <Text style={styles.targetPeriod}>
                    {target.period === 'weekly' ? 'Weekly' : 'Monthly'} goal
                  </Text>
                  <Text style={[styles.targetStatus, { color: met ? '#3B6D11' : '#854F0B' }]}>
                    {met ? 'Met' : 'In progress'}
                  </Text>
                </View>

                <Text style={styles.targetCount}>
                  {count} / {target.goalValue} applications
                </Text>

                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${percentage}%`,
                        backgroundColor: met ? '#3B6D11' : '#185FA5',
                      },
                    ]}
                  />
                </View>

                <Text style={styles.remainingText}>
                  {met
                    ? `Target exceeded by ${count - target.goalValue}`
                    : `${target.goalValue - count} more to go`}
                </Text>

                <PrimaryButton
                  label="Remove target"
                  onPress={() => deleteTarget(target.id)}
                  variant="danger"
                />
              </View>
            );
          })
        )}

        {showForm ? (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>New target</Text>

            <View style={styles.periodRow}>
              <PrimaryButton
                label="Weekly"
                onPress={() => setPeriod('weekly')}
                variant={period === 'weekly' ? 'primary' : 'secondary'}
              />
              <PrimaryButton
                label="Monthly"
                onPress={() => setPeriod('monthly')}
                variant={period === 'monthly' ? 'primary' : 'secondary'}
              />
            </View>

            <FormField
              label="Goal (number of applications)"
              value={goalValue}
              onChangeText={setGoalValue}
              placeholder="e.g. 5"
            />

            <PrimaryButton label="Save target" onPress={saveTarget} />
            <PrimaryButton
              label="Cancel"
              onPress={() => {
                setShowForm(false);
                setGoalValue('');
              }}
              variant="secondary"
            />
          </View>
        ) : (
          <PrimaryButton label="Add new target" onPress={() => setShowForm(true)} />
        )}
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
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  targetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 12,
  },
  targetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  targetPeriod: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  targetStatus: {
    fontSize: 13,
    fontWeight: '500',
  },
  targetCount: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  progressBarBg: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 10,
    borderRadius: 5,
  },
  remainingText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 8,
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
  periodRow: {
    flexDirection: 'row',
    gap: 8,
  },
});