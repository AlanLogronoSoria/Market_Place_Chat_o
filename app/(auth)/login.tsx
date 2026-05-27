import { useAuth } from "@features/auth/presentation/hooks/useAuth";
import { useAuthStore } from "@features/auth/presentation/store/authStore";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  const router = useRouter();
  const { login, isLoading, error } = useAuth();
  const user = useAuthStore((s) => s.user);

  // 💡 SOLUCIÓN: Redirección automática y limpia según el Rol del usuario
  useEffect(() => {
    if (user) {
      const normalizedRole = user.role?.toLowerCase().trim();
      if (normalizedRole === "vendedor") {
        // El vendedor va directo a gestionar sus salas de chat activas
        router.replace("/"); // ⚠️ Ajusta la ruta exacta según tu file-tree de expo-router
      }
    }
  }, [user, router]);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) return;
    login({ email: email.trim(), password });
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.brand}>SkyChat</Text>
          <Text style={styles.tagline}>PRIVATE MESSAGING</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.titleLight}>Welcome</Text>
          <Text style={styles.titleDark}>Back.</Text>
          <Text style={styles.subtitle}>Your conversations await.</Text>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>EMAIL</Text>
              <TextInput
                style={[styles.input, focusedField === "email" && styles.inputFocused]}
                placeholder="you@example.com"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>PASSWORD</Text>
              <TextInput
                style={[styles.input, focusedField === "password" && styles.inputFocused]}
                placeholder="••••••••"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <TouchableOpacity
              style={[styles.btnPrimary, isLoading && styles.btnDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnPrimaryText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <Link href="/(auth)/register" asChild>
              <TouchableOpacity style={styles.btnSecondary} activeOpacity={0.7}>
                <Text style={styles.btnSecondaryText}>Create an account</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        <Text style={styles.footer}>Premium · Secure · Private</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const DARK = "#202A36";
const GRAY_MID = "#6b7280";
const GRAY_LIGHT = "#f3f4f6";
const GRAY_300 = "#d1d5db";

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: GRAY_LIGHT },
  scroll: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 24, paddingVertical: 48 },
  header: { alignItems: "center", marginBottom: 36 },
  brand: { fontSize: 28, fontWeight: "600", color: DARK, letterSpacing: -0.5 },
  tagline: { fontSize: 11, fontWeight: "600", color: GRAY_MID, letterSpacing: 3, marginTop: 4 },
  card: { backgroundColor: "#fff", borderRadius: 24, padding: 32, shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 24, elevation: 6 },
  titleLight: { fontSize: 42, fontWeight: "400", color: "#9ca3af", letterSpacing: -1.5, lineHeight: 44 },
  titleDark: { fontSize: 42, fontWeight: "600", color: DARK, letterSpacing: -1.5, lineHeight: 44, marginTop: -6 },
  subtitle: { fontSize: 15, color: GRAY_MID, marginTop: 8, marginBottom: 28 },
  errorBox: { backgroundColor: "#fef2f2", borderRadius: 10, padding: 12, marginBottom: 16, borderLeftWidth: 3, borderLeftColor: "#ef4444" },
  errorText: { color: "#dc2626", fontSize: 13 },
  form: { gap: 16 },
  fieldGroup: { gap: 6 },
  label: { fontSize: 10, fontWeight: "600", color: GRAY_MID, letterSpacing: 2 },
  input: { borderWidth: 1.5, borderColor: GRAY_300, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: DARK, backgroundColor: "#fafafa" },
  inputFocused: { borderColor: DARK, backgroundColor: "#fff" },
  btnPrimary: { backgroundColor: DARK, borderRadius: 100, paddingVertical: 16, alignItems: "center", marginTop: 8 },
  btnDisabled: { opacity: 0.6 },
  btnPrimaryText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  btnSecondary: { borderRadius: 100, paddingVertical: 14, alignItems: "center", backgroundColor: GRAY_300 },
  btnSecondaryText: { color: "#374151", fontWeight: "500", fontSize: 15 },
  footer: { textAlign: "center", marginTop: 32, fontSize: 11, color: "#9ca3af", letterSpacing: 2, fontWeight: "500" },
});