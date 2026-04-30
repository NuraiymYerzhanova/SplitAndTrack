import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Chip, Text, TextInput } from 'react-native-paper';
import { useStore } from '../../store/useStore';

export default function AddExpenseModal() {
  // Grab the groupId passed from the Group Details screen
  const { groupId } = useLocalSearchParams(); 
  const addExpense = useStore((state) => state.addExpense);
  
  // Find the specific group to get its members
  const group = useStore((state) => state.groups.find(g => g.id === groupId));

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [receiptUri, setReceiptUri] = useState<string | undefined>(undefined);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  
  // State for who paid, defaults to the first member of the group
  const [payer, setPayer] = useState(group?.members[0] || 'Me');

  // --- NATIVE FEATURE 1A: CAMERA ---
  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      return Alert.alert('Permission Denied', 'We need camera permissions to attach receipts.');
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.5,
    });
    if (!result.canceled) {
      setReceiptUri(result.assets[0].uri);
    }
  };

  // --- NATIVE FEATURE 1B: GALLERY ---
  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return Alert.alert('Permission Denied', 'We need gallery permissions to upload receipts.');
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });
    if (!result.canceled) {
      setReceiptUri(result.assets[0].uri);
    }
  };

  // --- NATIVE FEATURE 2: GEOLOCATION ---
  const fetchLocation = async () => {
    setIsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need location permissions to tag expenses.');
        setIsLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    } catch (error) {
      Alert.alert('Error', 'Could not fetch location. Check your signal.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- SUBMIT FUNCTION ---
  const handleSave = () => {
    if (!title.trim() || !amount.trim() || isNaN(Number(amount))) {
      return Alert.alert('Validation Error', 'Enter a valid title and numeric amount.');
    }
    if (!groupId) {
      return Alert.alert('Error', 'No group selected. Please return to the dashboard and try again.');
    }

    addExpense(groupId as string, {
      id: Date.now().toString(),
      title: title.trim(),
      amount: parseFloat(amount),
      payerId: payer, // Uses the dynamically selected payer
      date: new Date().toISOString(),
      receiptUri,
      location,
    });
    
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineSmall" style={styles.header}>New Expense</Text>

      <TextInput
        label="Expense Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
        style={styles.input}
        mode="outlined"
      />

      <Text variant="labelLarge" style={styles.sectionLabel}>Who Paid?</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
        {group?.members.map((m) => (
          <Chip 
            key={m} 
            selected={payer === m} 
            onPress={() => setPayer(m)} 
            style={styles.chip}
          >
            {m}
          </Chip>
        ))}
      </ScrollView>

      <Text variant="labelLarge" style={styles.sectionLabel}>Attach Receipt</Text>
      <View style={styles.photoRow}>
        <Button icon="camera" mode="outlined" onPress={takePicture} style={styles.halfBtn}>
          Camera
        </Button>
        <Button icon="image" mode="outlined" onPress={pickFromGallery} style={styles.halfBtn}>
          Gallery
        </Button>
      </View>

      <Text variant="labelLarge" style={styles.sectionLabel}>Location Tag</Text>
      <Button 
        icon="map-marker" 
        mode="outlined" 
        onPress={fetchLocation} 
        style={styles.fullBtn}
        disabled={isLoading}
      >
        {isLoading ? <ActivityIndicator size="small" /> : location ? 'GPS Tagged!' : 'Tag Location'}
      </Button>

      {receiptUri && (
        <Image source={{ uri: receiptUri }} style={styles.preview} />
      )}

      <Button mode="contained" onPress={handleSave} style={styles.saveBtn}>
        Save Expense
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 50 },
  header: { marginBottom: 20, fontWeight: 'bold' },
  input: { marginBottom: 15 },
  sectionLabel: { marginBottom: 8, marginTop: 10, color: '#555' },
  chipScroll: { marginBottom: 15 },
  chip: { marginRight: 8 },
  photoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  halfBtn: { flex: 0.48 },
  fullBtn: { marginBottom: 20 },
  preview: { width: '100%', height: 200, borderRadius: 8, marginBottom: 20, resizeMode: 'cover' },
  saveBtn: { marginTop: 10 }
});