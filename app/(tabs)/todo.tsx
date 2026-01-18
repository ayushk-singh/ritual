import { StyleSheet } from "react-native";
import { View, FlatList } from "react-native";
import {
  Text,
  TextInput,
  Button,
  List,
  IconButton,
  Checkbox,
  Divider,
  Modal,
  Portal,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Colors } from "@/constants/Colors";

type Todo = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
};

export default function TodoScreen() {
  const { user } = useAuth();
  const userId = user?.$id;

  const [todos, setTodos] = useState<Todo[]>([]);
  const [visible, setVisible] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const pendingTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  const openModal = () => setVisible(true);
  const closeModal = () => setVisible(false);

  const saveTodo = () => {
    if (!title.trim()) return;

    setTodos((prev) => [
      {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        completed: false,
      },
      ...prev,
    ]);

    setTitle("");
    setDescription("");
    closeModal();
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };

  const renderTodo = ({ item }: { item: Todo }) => (
    <List.Item
      title={item.title}
      description={item.description}
      left={() => (
        <Checkbox
          status={item.completed ? "checked" : "unchecked"}
          onPress={() => toggleTodo(item.id)}
        />
      )}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium">Todo List</Text>
        <IconButton icon="plus" onPress={openModal} />
      </View>

      {/* Pending Section */}
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Pending
      </Text>

      <FlatList
        data={pendingTodos}
        keyExtractor={(item) => item.id}
        renderItem={renderTodo}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No pending tasks</Text>
        }
      />

      <Divider style={styles.divider} />

      {/* Completed Section */}
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Completed
      </Text>

      <FlatList
        data={completedTodos}
        keyExtractor={(item) => item.id}
        renderItem={renderTodo}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No completed tasks</Text>
        }
      />

      {/* Create Todo Modal */}
      <Portal>
        <Modal
          visible={visible}
          onDismiss={closeModal}
          contentContainerStyle={styles.modal}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>
            Create Task
          </Text>

          <TextInput
            label="Title"
            mode="outlined"
            value={title}
            onChangeText={setTitle}
            style={styles.modalInput}
          />

          <TextInput
            label="Description"
            mode="outlined"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            style={styles.modalInput}
          />

          <Button
            mode="contained"
            onPress={saveTodo}
            disabled={!title.trim()}
          >
            Save
          </Button>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 4,
  },
  divider: {
    marginVertical: 16,
  },
  emptyText: {
    opacity: 0.6,
    textAlign: "center",
    marginVertical: 8,
  },
  modal: {
    margin: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.dark.background,
  },
  modalTitle: {
    marginBottom: 16,
  },
  modalInput: {
    marginBottom: 12,
  },
});
