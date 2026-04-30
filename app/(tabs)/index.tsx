import { router } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';
import { Card, FAB, Text } from 'react-native-paper';
import { useStore } from '../../store/useStore';

export default function DashboardScreen() {
  const groups = useStore((state) => state.groups);

  return (
    <View style={styles.container}>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }} // Space for the FAB
        renderItem={({ item }) => (
          <Card style={styles.card} onPress={() => router.push(`/group/${item.id}`)}>
            <Card.Title title={item.name} subtitle={`${item.members.length} members | ${item.expenses.length} expenses`} />
          </Card>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No groups yet. Tap the + to start!</Text>}
      />

      {/* The beautiful floating action button to add a group */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/modal/add-group')}
        label="New Trip"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F5F5F5' },
  card: { marginBottom: 12 },
  empty: { textAlign: 'center', marginTop: 50, color: '#888' },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0 },
});