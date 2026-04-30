import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Chip, Text, TextInput } from 'react-native-paper';
import { useStore } from '../../store/useStore';

export default function AddGroupModal() {
  const addGroup = useStore((state) => state.addGroup);
  const [name, setName] = useState('');
  const [newMember, setNewMember] = useState('');
  const [members, setMembers] = useState<string[]>(['Me']); // You are always in the group

  const handleAddMember = () => {
    if (!newMember.trim()) return;
    if (members.includes(newMember.trim())) {
      return Alert.alert('Error', 'Member already exists!');
    }
    setMembers([...members, newMember.trim()]);
    setNewMember('');
  };

  const handleRemoveMember = (memberToRemove: string) => {
    if (memberToRemove === 'Me') return; // Can't remove yourself
    setMembers(members.filter(m => m !== memberToRemove));
  };

  const handleSave = () => {
    if (!name.trim()) return Alert.alert('Validation', 'Please give the trip a name.');
    
    addGroup({
      id: Date.now().toString(),
      name: name.trim(),
      members: members,
      expenses: [],
    });
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineSmall" style={styles.header}>Create New Group</Text>
      
      <TextInput label="Group Name (e.g., Paris Trip)" value={name} onChangeText={setName} mode="outlined" style={styles.input} />

      <Text variant="titleMedium" style={styles.subHeader}>Add Friends</Text>
      <View style={styles.row}>
        <TextInput label="Friend's Name" value={newMember} onChangeText={setNewMember} mode="outlined" style={styles.flexInput} />
        <Button mode="contained" onPress={handleAddMember} style={styles.addBtn}>Add</Button>
      </View>

      <View style={styles.chipContainer}>
        {members.map(member => (
          <Chip key={member} onClose={() => handleRemoveMember(member)} style={styles.chip}>
            {member}
          </Chip>
        ))}
      </View>

      <Button mode="contained" onPress={handleSave} style={styles.saveBtn}>Save Group</Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { marginBottom: 20, fontWeight: 'bold' },
  subHeader: { marginTop: 20, marginBottom: 10, fontWeight: 'bold' },
  input: { marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center' },
  flexInput: { flex: 1, marginRight: 10 },
  addBtn: { marginTop: 5 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 15 },
  chip: { margin: 4 },
  saveBtn: { marginTop: 40 }
});