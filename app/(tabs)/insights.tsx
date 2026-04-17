// Insights screen - aggregated views with charts
// Lecture: Week 11 slides 10-17: filtering data, empty states, feedback
// Book: Chapter 20 - Rendering Item Lists (.map/.filter for data aggregation)
// Chart library: react-native-chart-kit
//   https://github.com/indiespirit/react-native-chart-kit
import InfoTag from '@/components/ui/info-tag';
import ScreenHeader from '@/components/ui/screen-header';
import { STATUS_MAP } from '@/lib/constants';
import { useContext } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppContext } from '../_layout';

const screenWidth = Dimensions.get('window').width - 40;

export default function InsightsScreen() {
  const context = useContext(AppContext);

  if (!context) return null;

  const { applications, categories, statusLogs } = context;

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

  // Weekly counts for line chart (last 4 weeks)
  const weeklyData: number[] = [];
  const weekLabels: string[] = [];

  for (let i = 3; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1 - i * 7);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const count = applications.filter((app) => {
      const appDate = new Date(app.appliedAt * 1000);
      return appDate >= weekStart && appDate < weekEnd;
    }).length;

    weeklyData.push(count);
    const dayMonth = `${weekStart.getDate()}/${weekStart.getMonth() + 1}`;
    weekLabels.push(dayMonth);
  }

  // Category breakdown for pie chart
  const categoryData = categories.map((cat) => {
    const count = applications.filter((app) => app.categoryID === cat.id).length;
    return {
      name: cat.name,
      count,
      color: cat.colour,
      legendFontColor: '#374151',
      legendFontSize: 12,
    };
  }).filter((item) => item.count > 0);

  // Status breakdown using latest log per application
  const getLatestStatus = (appId: number) => {
    const appLogs = statusLogs.filter((log) => log.applicationID === appId);
    if (appLogs.length === 0) return 0;
    return appLogs[appLogs.length - 1].newStatus;
  };

  const statusCounts: Record<number, number> = {};
  applications.forEach((app) => {
    const status = getLatestStatus(app.id);
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Insights" subtitle={`${applications.length} total applications`} />

        <View style={styles.summaryRow}>
          <InfoTag label="This week" value={String(weeklyCount)} />
          <InfoTag label="This month" value={String(monthlyCount)} />
          <InfoTag label="Total" value={String(applications.length)} />
        </View>

        <Text style={styles.sectionTitle}>Status breakdown</Text>
        <View style={styles.statusRow}>
          {Object.entries(STATUS_MAP).map(([key, value]) => {
            const count = statusCounts[Number(key)] || 0;
            if (count === 0) return null;
            return (
              <View key={key} style={[styles.statusChip, { backgroundColor: value.bg }]}>
                <Text style={[styles.statusCount, { color: value.text }]}>{count}</Text>
                <Text style={[styles.statusLabel, { color: value.text }]}>{value.label}</Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Applications per week</Text>
        {applications.length === 0 ? (
          <Text style={styles.emptyText}>No data yet</Text>
        ) : (
          <View style={styles.chartCard}>
            <LineChart
              data={{
                labels: weekLabels,
                datasets: [{ data: weeklyData.some((d) => d > 0) ? weeklyData : [0] }],
              }}
              width={screenWidth - 32}
              height={200}
              yAxisLabel=""
              yAxisSuffix=""
              fromZero
              chartConfig={{
                backgroundColor: '#FFFFFF',
                backgroundGradientFrom: '#FFFFFF',
                backgroundGradientTo: '#FFFFFF',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(24, 95, 165, ${opacity})`,
                labelColor: () => '#6B7280',
                propsForBackgroundLines: {
                  strokeDasharray: '',
                  stroke: '#F3F4F6',
                },
                propsForDots: {
                  r: '5',
                  strokeWidth: '2',
                  stroke: '#185FA5',
                },
              }}
              bezier
              style={styles.chart}
            />
          </View>
        )}

        <Text style={styles.sectionTitle}>By category</Text>
        {categoryData.length === 0 ? (
          <Text style={styles.emptyText}>No data yet</Text>
        ) : (
          <View style={styles.chartCard}>
            <PieChart
              data={categoryData}
              width={screenWidth - 32}
              height={200}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="count"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
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
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  statusChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  statusCount: {
    fontSize: 20,
    fontWeight: '700',
  },
  statusLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  chart: {
    borderRadius: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 24,
  },
});