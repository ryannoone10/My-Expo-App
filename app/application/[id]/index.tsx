// Detail screen adapted from student/[id].tsx tutorial pattern
// https://github.com/rorypierce111/react-native-lab/blob/main/app/student/%5Bid%5D/edit.tsx
import InfoTag from '@/components/ui/info-tag';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { db } from '@/db/index';
import { applications, applicationStatusLogs } from '@/db/schema';
import { STATUS_MAP } from '@/lib/constants';
import { eq } from 'drizzle-orm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from '../../_layout';


type StatusLog = {
  id: number;
  applicationID: number;
  oldStatus: number;
  newStatus: number;
  changedAt: number;
};

export default function ApplicationDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(AppContext);
  const [statusLogs, setStatusLogs] = useState<StatusLog[]>([]);

  useEffect(() => {
    loadStatusLogs();
  }, []);

  const loadStatusLogs = async () => {
    const logs = await db
      .select()
      .from(applicationStatusLogs)
      .where(eq(applicationStatusLogs.applicationID, Number(id)));
    setStatusLogs(logs);
  };

  if (!context) return null;

  const { applications: apps, categories, setApplications } = context;
  const application = apps.find((a) => a.id === Number(id));

  if (!application) return null;

  const category = categories.find((c) => c.id === application.categoryID);
  const currentStatus = statusLogs.length > 0
    ? statusLogs[statusLogs.length - 1].newStatus
    : 0;
  const statusInfo = STATUS_MAP[currentStatus] || STATUS_MAP[0];

  const dateString = new Date(application.appliedAt * 1000).toLocaleDateString('en-IE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const updateStatus = async (newStatus: number) => {
    const now = Math.floor(Date.now() / 1000);
    await db.insert(applicationStatusLogs).values({
        applicationID: application.id,
        oldStatus: currentStatus,
        newStatus,
        changedAt: now,
    });
    await loadStatusLogs();

    const allLogs = await db.select().from(applicationStatusLogs);
    context.setStatusLogs(allLogs);
    };
    
  const deleteApplication = async () => {
    await db
      .delete(applicationStatusLogs)
      .where(eq(applicationStatusLogs.applicationID, Number(id)));
    await db
      .delete(applications)
      .where(eq(applications.id, Number(id)));

    const rows = await db.select().from(applications);
    setApplications(rows);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title={application.companyName} subtitle={application.position} />

        <View style={styles.tags}>
          <InfoTag label="Status" value={statusInfo.label} />
          <InfoTag label="Category" value={category?.name || 'None'} />
          <InfoTag label="Applied" value={dateString} />
          {application.notes && <InfoTag label="Notes" value={application.notes} />}
        </View>

        <Text style={styles.sectionTitle}>Update status</Text>
        {Object.entries(STATUS_MAP).map(([key, value]) => (
          <PrimaryButton
            key={key}
            label={value.label}
            onPress={() => updateStatus(Number(key))}
            variant={currentStatus === Number(key) ? 'primary' : 'secondary'}
          />
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Status history</Text>
        {statusLogs.length === 0 ? (
          <Text style={styles.emptyText}>No status changes recorded</Text>
        ) : (
          statusLogs.map((log) => {
            const logDate = new Date(log.changedAt * 1000).toLocaleDateString('en-IE', {
              day: 'numeric',
              month: 'short',
            });
            const fromLabel = log.oldStatus >= 0 ? STATUS_MAP[log.oldStatus]?.label : 'New';
            const toLabel = STATUS_MAP[log.newStatus]?.label || 'Unknown';

            return (
              <View key={log.id} style={styles.logItem}>
                <Text style={styles.logText}>{fromLabel} → {toLabel}</Text>
                <Text style={styles.logDate}>{logDate}</Text>
              </View>
            );
          })
        )}

        <View style={styles.actions}>
          <PrimaryButton
            label="Edit"
            onPress={() => {
              router.push({
                pathname: '/application/[id]/edit',
                params: { id: application.id.toString() },
              });
            }}
          />
          <View style={styles.buttonSpacing}>
            <PrimaryButton
              label="Delete"
              variant="danger"
              onPress={() =>
                Alert.alert(
                  'Delete application',
                  `Are you sure you want to delete ${application.companyName}?`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', style: 'destructive', onPress: deleteApplication },
                  ]
                )
              }
            />
          </View>
          <View style={styles.buttonSpacing}>
            <PrimaryButton label="Back" variant="secondary" onPress={() => router.back()} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F8FAFC',
    flex: 1,
  },
  content: {
    padding: 20,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  logItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  logText: {
    fontSize: 14,
    color: '#111827',
  },
  logDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  actions: {
    marginTop: 32,
  },
  buttonSpacing: {
    marginTop: 10,
  },
});