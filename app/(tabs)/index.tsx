import { useContext } from 'react';
import { ScrollView, Text } from 'react-native';
import { AppContext } from '../_layout';

export default function IndexScreen() {
  const context = useContext(AppContext);
  if (!context) {
    return null;
  }

  const { applications, categories } = context;

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        db Check 
      </Text>
      <Text>Categories: {categories.length}</Text>
      <Text>Applications: {applications.length}</Text>

      {applications.slice(0, 5).map((app) => (
       <Text key={app.id} style={{ marginTop: 8 }}>
          {app.companyName} - {app.position} - {app.appliedAt}
        </Text>
      ))}
    </ScrollView>
  );
}