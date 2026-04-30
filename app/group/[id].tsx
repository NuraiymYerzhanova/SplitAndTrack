import { useLocalSearchParams } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';
import { Avatar, Card, Text } from 'react-native-paper';
import { useStore } from '../../store/useStore';

export default function GroupDetailsScreen() {
  const { id } = useLocalSearchParams();
  
  // Find the specific group we clicked on
  const group = useStore((state) => 
    state.groups.find((g) => g.id === id)
  );

  if (!group) {
    return (
      <View style={styles.centered}>
        <Text>Group not found.</Text>
      </View>
    );
  }

  // Calculate total spent
  const totalSpent = group.expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <View style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Title 
          title={group.name} 
          subtitle={`${group.members.length} Members`} 
          left={(props) => <Avatar.Icon {...props} icon="account-group" />}
        />
        <Card.Content>
          <Text variant="titleMedium">Total Spent: ${totalSpent.toFixed(2)}</Text>
        </Card.Content>
      </Card>

      <Text variant="titleMedium" style={styles.listHeader}>Expenses</Text>

      {/* FlatList for performance (Criterion 9) */}
      <FlatList
        data={group.expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.expenseCard}>
            <Card.Title 
              title={item.title} 
              subtitle={new Date(item.date).toLocaleDateString()} 
              right={(props) => <Text {...props} style={styles.amount}>${item.amount.toFixed(2)}</Text>}
            />
            {/* Show receipt image if it exists */}
            {item.receiptUri && (
              <Card.Cover source={{ uri: item.receiptUri }} style={styles.receipt} />
            )}
            {/* Show GPS tag if it exists */}
            {item.location && (
              <Card.Content>
                <Text variant="bodySmall" style={styles.location}>
                  📍 GPS: {item.location.latitude.toFixed(4)}, {item.location.longitude.toFixed(4)}
                </Text>
              </Card.Content>
            )}
          </Card>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No expenses yet. Add one from the dashboard!</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F5F5F5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerCard: { marginBottom: 20, backgroundColor: '#E3F2FD' },
  listHeader: { marginBottom: 10, fontWeight: 'bold' },
  expenseCard: { marginBottom: 12 },
  amount: { paddingRight: 16, fontWeight: 'bold', fontSize: 16, color: '#F44336' },
  receipt: { height: 120, marginHorizontal: 16, marginBottom: 10 },
  location: { marginTop: 8, color: '#555' },
  empty: { textAlign: 'center', marginTop: 20, fontStyle: 'italic', color: '#888' }
});