import { router, useLocalSearchParams } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';
import { Card, FAB, Text } from 'react-native-paper';
import { useStore } from '../../store/useStore';
import { calculateBalances } from '../../utils/math';

export default function GroupDetailsScreen() {
  const { id } = useLocalSearchParams();
  const group = useStore((state) => state.groups.find((g) => g.id === id));

  if (!group) return <View style={styles.centered}><Text>Group not found.</Text></View>;

  const balances = calculateBalances(group);

  return (
    <View style={styles.container}>
      {/* Balance Summary Header */}
      <Card style={styles.headerCard}>
        <Card.Title title={group.name} subtitle="Settlement Summary" />
        <Card.Content>
          {balances.map((b) => (
            <View key={b.member} style={styles.balanceRow}>
              <Text style={{ fontWeight: 'bold' }}>{b.member}</Text>
              <Text style={{ color: b.balance >= 0 ? '#4CAF50' : '#F44336', fontWeight: 'bold' }}>
                {b.balance >= 0 ? `Is Owed $${b.balance.toFixed(2)}` : `Owes $${Math.abs(b.balance).toFixed(2)}`}
              </Text>
            </View>
          ))}
        </Card.Content>
      </Card>

      <Text variant="titleMedium" style={styles.listHeader}>Expense History</Text>
      
      <FlatList
        data={group.expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.expenseCard}>
            <Card.Title 
              title={item.title} 
              subtitle={`Paid by: ${item.payerId} on ${new Date(item.date).toLocaleDateString()}`} 
              right={(props) => <Text {...props} style={styles.amount}>${item.amount.toFixed(2)}</Text>} 
            />
            {item.receiptUri && <Card.Cover source={{ uri: item.receiptUri }} style={styles.receipt} />}
          </Card>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No expenses yet.</Text>}
      />

      {/* Notice we pass the specific group ID to the modal! */}
      <FAB
        icon="receipt"
        style={styles.fab}
        onPress={() => router.push({ pathname: '/modal/add-expense', params: { groupId: group.id } })}
        label="Add Expense"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F5F5F5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerCard: { marginBottom: 20, backgroundColor: '#E3F2FD' },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  listHeader: { marginBottom: 10, fontWeight: 'bold' },
  expenseCard: { marginBottom: 12 },
  amount: { paddingRight: 16, fontWeight: 'bold', fontSize: 16 },
  receipt: { height: 120, marginHorizontal: 16, marginBottom: 10 },
  empty: { textAlign: 'center', marginTop: 20, color: '#888' },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: '#2196F3' },
});