import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { theme } from '../constants/theme';

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <Stack>
        {/* The main tab interface */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* The details screen pushed onto the stack */}
        <Stack.Screen 
          name="group/[id]" 
          options={{ title: 'Group Details', headerBackTitle: 'Back' }} 
        />
        
        {/* The modal that slides up from the bottom */}
        <Stack.Screen
          name="modal/add-expense"
          options={{
            presentation: 'modal',
            title: 'Add New Expense',
          }}
        />
      </Stack>
    </PaperProvider>
  );
}