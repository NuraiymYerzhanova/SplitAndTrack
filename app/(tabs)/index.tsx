import { router } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
// Notice the path: up out of (tabs), up out of app, into store.
import { useStore } from '../../store/useStore';

export default function DashboardScreen() {
  const groups = useStore((state) => state.groups);

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Your Groups</Text>

      {/* Using FlatList instead of ScrollView for better performance (Criterion 9) */}
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card} onPress={() => router.push(`/group/${item.id}`)}>
            <Card.Title title={item.name} subtitle={`${item.members.length} members`} />
          </Card>
        )}
        ListEmptyComponent={<Text>No groups yet. Create one!</Text>}
      />

      <Button mode="contained" onPress={() => router.push('/modal/add-expense')} style={styles.button}>
        Add Expense Modal
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F5F5F5' },
  title: { marginBottom: 16, fontWeight: 'bold' },
  card: { marginBottom: 12 },
  button: { marginTop: 'auto', marginBottom: 20 }
});