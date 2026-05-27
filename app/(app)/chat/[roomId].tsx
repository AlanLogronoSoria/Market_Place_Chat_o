console.log("RoomID recibido:");
import { useAuthStore } from "@features/auth/presentation/store/authStore";
import { Message } from "@features/chat/domain/entities/Message";
import { useChat } from "@features/chat/presentation/hooks/useChat";
import { pickAndUploadImage } from "@shared/infrastructure/supabase/StorageService";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";


export default function ChatScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { messages, sendMessage, isLoading } = useChat(roomId);
  const user = useAuthStore((s) => s.user);
  const [input, setInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    console.log("ID de sala recibido:", roomId);
    if (messages.length > 0) {
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const handleSend = useCallback(() => {
    if (!input.trim() || !user) return;
    sendMessage({ content: input.trim() });
    setInput("");
  }, [input, sendMessage, user]);

  const handleImagePick = useCallback(async () => {
    if (!user) return;
    try {
      setIsUploading(true);
      const imageUrl = await pickAndUploadImage();
      if (imageUrl) sendMessage({ content: "", imageUrl }); 
    } catch (e: any) {
      Alert.alert("Error", e.message); 
    } finally {
      setIsUploading(false);
    }
  }, [sendMessage, user]);

  const renderMsg = ({ item }: { item: Message }) => {
    const isOwn = item.userId === user?.id; 
    const initials = (item.authorUsername ?? "U").charAt(0).toUpperCase();

    return (
      <View style={[styles.row, isOwn && styles.rowOwn]}>
        {!isOwn && (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        )}
        <View style={[styles.bubble, isOwn ? styles.ownBubble : styles.otherBubble]}>
          {!isOwn && (
            <Text style={styles.author}>
              {item.authorUsername || (user?.role === 'cliente' ? 'Vendedor' : 'Cliente')}
            </Text>
          )}
          {item.imageUrl && (
            <Image source={{ uri: item.imageUrl }} style={styles.msgImage} resizeMode="cover" />
          )}
          {!!item.content && (
            <Text style={[styles.msgText, isOwn && styles.msgTextOwn]}>
              {item.content}
            </Text>
          )}
          <Text style={[styles.time, isOwn && styles.timeOwn]}>
            {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={DARK} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={90}>
      <FlatList ref={listRef} data={messages} keyExtractor={(m) => m.id} renderItem={renderMsg} contentContainerStyle={styles.messagesList} showsVerticalScrollIndicator={false} />
      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.attachBtn} onPress={handleImagePick} disabled={isUploading} activeOpacity={0.7}>
          {isUploading ? <ActivityIndicator size="small" color={DARK} /> : <Text style={styles.attachIcon}>⊕</Text>}
        </TouchableOpacity>
        <TextInput style={styles.input} value={input} onChangeText={setInput} placeholder="Escribe un mensaje..." placeholderTextColor="#9ca3af" multiline maxLength={500} />
        <TouchableOpacity style={[styles.sendBtn, !input.trim() && styles.sendBtnOff]} onPress={handleSend} disabled={!input.trim()} activeOpacity={0.85}>
          <Text style={styles.sendIcon}>↑</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const DARK = "#202A36";
const GRAY_MID = "#6b7280";
const GRAY_LIGHT = "#f3f4f6";
const GRAY_300 = "#d1d5db";
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: GRAY_LIGHT },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: GRAY_LIGHT },
  messagesList: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  row: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  rowOwn: { justifyContent: "flex-end" },
  avatar: { width: 32, height: 32, borderRadius: 10, backgroundColor: DARK, justifyContent: "center", alignItems: "center", marginBottom: 2 },
  avatarText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  bubble: { maxWidth: "75%", borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  ownBubble: { backgroundColor: DARK, borderBottomRightRadius: 4 },
  otherBubble: { backgroundColor: "#fff", borderBottomLeftRadius: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  author: { fontSize: 11, fontWeight: "600", color: GRAY_MID, marginBottom: 4, letterSpacing: 0.3 },
  msgText: { fontSize: 15, color: DARK, lineHeight: 20 },
  msgTextOwn: { color: "#fff" },
  time: { fontSize: 10, color: "#9ca3af", marginTop: 4, alignSelf: "flex-end" },
  timeOwn: { color: "rgba(255,255,255,0.5)" },
  msgImage: { width: 200, height: 150, borderRadius: 10, marginBottom: 4 },
  inputBar: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 10, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: GRAY_300, gap: 8 },
  attachBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: GRAY_LIGHT, justifyContent: "center", alignItems: "center" },
  attachIcon: { fontSize: 20, color: DARK },
  input: { flex: 1, borderWidth: 1.5, borderColor: GRAY_300, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, maxHeight: 100, fontSize: 15, color: DARK, backgroundColor: GRAY_LIGHT },
  sendBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: DARK, justifyContent: "center", alignItems: "center" },
  sendBtnOff: { backgroundColor: GRAY_300 },
  sendIcon: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
