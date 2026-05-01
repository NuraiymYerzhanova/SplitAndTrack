import { ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Card, Divider, ProgressBar, Text } from 'react-native-paper';
import { useStore } from '../../store/useStore';

export default function StatsScreen() {
  const groups = useStore((state) => state.groups);

  // Flatten all expenses from all groups into one massive array
  const allExpenses = groups.flatMap((g) => g.expenses);
  
  // 1. Calculate Grand Total
  const grandTotal = allExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // 2. Find the Top Spender (Who has paid the most out of pocket overall?)
  const payerTotals: Record<string, number> = {};
  allExpenses.forEach((exp) => {
    payerTotals[exp.payerId] = (payerTotals[exp.payerId] || 0) + exp.amount;
  });

  let topSpender = 'N/A';
  let maxSpent = 0;
  Object.entries(payerTotals).forEach(([payer, amount]) => {
    if (amount > maxSpent) {
      maxSpent = amount;
      topSpender = payer;
    }
  });

  // 3. Calculate breakdown by Group (To see which trip was most expensive)
  const groupStats = groups.map((g) => {
    const groupTotal = g.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    return { name: g.name, total: groupTotal };
  }).sort((a, b) => b.total - a.total); // Sort highest to lowest

  // If there is absolutely no data yet, show a friendly empty state
  if (grandTotal === 0) {
    return (
      <View style={styles.centered}>
        <Avatar.Icon icon="chart-box-outline" size={80} style={{ backgroundColor: 'transparent' }} color="#888" />
        <Text variant="titleMedium" style={styles.emptyText}>No data to analyze yet.</Text>
        <Text variant="bodyMedium" style={styles.emptySub}>Add some trips and expenses to see your financial breakdown!</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineSmall" style={styles.header}>Global Overview</Text>

      <View style={styles.row}>
        {/* Total Spending Card */}
        <Card style={[styles.halfCard, { backgroundColor: '#E3F2FD' }]}>
          <Card.Content>
            <Avatar.Icon icon="cash-multiple" size={40} style={styles.icon} />
            <Text variant="labelLarge" style={styles.cardLabel}>Total Spent</Text>
            <Text variant="titleLarge" style={styles.cardValue}>${grandTotal.toFixed(2)}</Text>
          </Card.Content>
        </Card>

        {/* Top Spender Card */}
        <Card style={[styles.halfCard, { backgroundColor: '#E8F5E9' }]}>
          <Card.Content>
            <Avatar.Icon icon="crown" size={40} style={styles.icon} color="#4CAF50" />
            <Text variant="labelLarge" style={styles.cardLabel}>Top Spender</Text>
            <Text variant="titleLarge" style={styles.cardValue} numberOfLines={1}>{topSpender}</Text>
          </Card.Content>
        </Card>
      </View>

      <Text variant="titleMedium" style={styles.subHeader}>Cost by Trip</Text>
      
      {/* Group Breakdown List */}
      <Card style={styles.breakdownCard}>
        <Card.Content>
          {groupStats.map((group, index) => {
            // Calculate percentage for the progress bar
            const percentage = grandTotal > 0 ? group.total / grandTotal : 0;
            
            return (
              <View key={index} style={styles.groupRow}>
                <View style={styles.groupTextRow}>
                  <Text variant="bodyLarge" style={{ fontWeight: 'bold' }}>{group.name}</Text>
                  <Text variant="bodyLarge">${group.total.toFixed(2)}</Text>
                </View>
                
                {/* Visual indicator of how much this trip cost compared to the total */}
                <ProgressBar 
                  progress={percentage} 
                  color="#2196F3" 
                  style={styles.progressBar} 
                />
                
                {index < groupStats.length - 1 && <Divider style={{ marginVertical: 12 }} />}
              </View>
            );
          })}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F5F5F5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { marginTop: 16, fontWeight: 'bold', color: '#555' },
  emptySub: { textAlign: 'center', marginTop: 8, color: '#888' },
  header: { marginBottom: 16, fontWeight: 'bold' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  halfCard: { width: '48%' },
  icon: { backgroundColor: 'transparent', marginLeft: -8, marginBottom: 8 },
  cardLabel: { color: '#555' },
  cardValue: { fontWeight: 'bold', marginTop: 4 },
  subHeader: { marginBottom: 12, fontWeight: 'bold' },
  breakdownCard: { marginBottom: 30 },
  groupRow: { marginVertical: 8 },
  groupTextRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressBar: { height: 8, borderRadius: 4, backgroundColor: '#E0E0E0' }
});