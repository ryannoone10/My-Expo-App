// CSV export functionality
// Expo docs - FileSystem: https://docs.expo.dev/versions/latest/sdk/filesystem/
// Expo docs - Sharing: https://docs.expo.dev/versions/latest/sdk/sharing/
import { Application, Category, StatusLog } from '@/app/_layout';
import { STATUS_MAP } from '@/lib/constants';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

export async function exportToCSV(
  applications: Application[],
  categories: Category[],
  statusLogs: StatusLog[]
) {
  const getLatestStatus = (appId: number) => {
    const appLogs = statusLogs.filter((log) => log.applicationID === appId);
    if (appLogs.length === 0) return 0;
    return appLogs[appLogs.length - 1].newStatus;
  };

  const header = 'Company,Position,Category,Status,Date Applied,Notes\n';

  const rows = applications
    .map((app) => {
      const category = categories.find((c) => c.id === app.categoryID);
      const status = STATUS_MAP[getLatestStatus(app.id)]?.label || 'Applied';
      const date = new Date(app.appliedAt * 1000).toLocaleDateString('en-IE');
      const notes = (app.notes || '').replace(/,/g, ';').replace(/\n/g, ' ');
      return `${app.companyName},${app.position},${category?.name || 'None'},${status},${date},${notes}`;
    })
    .join('\n');

  const csv = header + rows;
  const fileName = `applications_${new Date().toISOString().split('T')[0]}.csv`;
  const filePath = `${FileSystem.cacheDirectory}${fileName}`;

  await FileSystem.writeAsStringAsync(filePath, csv, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  await Sharing.shareAsync(filePath, {
    mimeType: 'text/csv',
    dialogTitle: 'Export Applications',
  });
}