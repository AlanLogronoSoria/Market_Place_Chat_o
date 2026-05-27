import { useAuthStore } from "@features/auth/presentation/store/authStore";
import { Room } from "@features/chat/domain/entities/Room";
import { useRooms } from "@features/chat/presentation/hooks/useRooms";
import { MarketplaceView } from "@features/products/presentation/views/MarketplaceView";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Paleta de colores unificada de SkyChat
const DARK = "#202A36";
const GRAY_MID = "#6b7280";
const GRAY_LIGHT = "#f3f4f6";
const GRAY_300 = "#d1d5db";

export default function AppIndexScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { rooms, isLoading } = useRooms();

  // 💡 ESTADO LOCAL: Permite al vendedor alternar entre revisar chats y subir productos
  const [vendedorTab, setVendedorTab] = useState<"chats" | "productos">("chats");

  if (!user) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={DARK} />
        <Text style={styles.loadingText}>Cargando perfil de usuario...</Text>
      </View>
    );
  }

  const normalizedRole = user.role?.toLowerCase().trim();

  // =========================================================================
  // 1️⃣ FLUJO CLIENTE: Va directo y únicamente al Marketplace (Catálogo)
  // =========================================================================
  if (normalizedRole !== "vendedor") {
    return <MarketplaceView />;
  }

  // =========================================================================
  // 2️⃣ FLUJO VENDEDOR: Panel con pestañas de navegación interna
  // =========================================================================
  const renderRoom = ({ item }: { item: Room }) => (
    <TouchableOpacity
      style={styles.roomItem}
      onPress={() => router.push(`/chat/${item.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.roomAvatar}>
        <Text style={styles.roomAvatarText}>
          {(item.productName ?? "C").charAt(0).toUpperCase()}
        </Text>
      </View>

      <View style={styles.roomInfo}>
        <Text style={styles.roomName}>{item.productName}</Text>
        <Text style={styles.roomDate}>
          {item.createdAt 
            ? new Date(item.createdAt).toLocaleDateString("en-US", { 
                month: "short", 
                day: "numeric", 
                year: "numeric" 
              }) 
            : ""}
        </Text>
      </View>

      <Text style={styles.roomChevron}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* NAVEGACIÓN SUPERIOR EXCLUSIVA VENDEDOR */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, vendedorTab === "chats" && styles.tabButtonActive]}
          onPress={() => setVendedorTab("chats")}
        >
          <Text style={[styles.tabText, vendedorTab === "chats" && styles.tabTextActive]}>
            Mis Chats ({rooms.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, vendedorTab === "productos" && styles.tabButtonActive]}
          onPress={() => setVendedorTab("productos")}
        >
          <Text style={[styles.tabText, vendedorTab === "productos" && styles.tabTextActive]}>
            Gestionar Productos
          </Text>
        </TouchableOpacity>
      </View>

      {/* RENDERIZADO CONDICIONAL DE CONTENIDO SEGÚN LA PESTAÑA */}
      {vendedorTab === "productos" ? (
        // Si elige productos, inyectamos la vista que ya tiene el formulario de creación
        <MarketplaceView />
      ) : isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={DARK} />
          <Text style={styles.loadingText}>Cargando chats...</Text>
        </View>
      ) : (
        <FlatList
          data={rooms}
          keyExtractor={(r) => r.id}
          renderItem={renderRoom}
          contentContainerStyle={rooms.length === 0 ? { flex: 1 } : { paddingBottom: 30 }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyIcon}>✦</Text>
              <Text style={styles.emptyTitle}>Bandeja vacía</Text>
              <Text style={styles.emptySubtitle}>
                Cuando un cliente pregunte por tus productos publicados, aparecerá en esta lista de inmediato.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

// Estilos del contenedor y del Tab Bar
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: GRAY_LIGHT 
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: GRAY_300,
    paddingTop: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  tabButtonActive: {
    borderBottomColor: DARK, // Línea indicadora azul oscura abajo
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: GRAY_MID,
  },
  tabTextActive: {
    color: DARK,
  },
  centered: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    gap: 8,
    backgroundColor: GRAY_LIGHT
  },
  loadingText: { 
    color: GRAY_MID, 
    fontSize: 14, 
    marginTop: 8 
  },
  emptyIcon: { 
    fontSize: 32, 
    color: GRAY_300, 
    marginBottom: 8 
  },
  emptyTitle: { 
    fontSize: 18, 
    fontWeight: "600", 
    color: DARK 
  },
  emptySubtitle: { 
    fontSize: 14, 
    color: GRAY_MID, 
    textAlign: "center",
    paddingHorizontal: 40 
  },
  roomItem: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingHorizontal: 20, 
    paddingVertical: 16, 
    backgroundColor: "#fff", 
    gap: 14 
  },
  roomAvatar: { 
    width: 44, 
    height: 44, 
    borderRadius: 12, 
    backgroundColor: DARK, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  roomAvatarText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "600" 
  },
  roomInfo: { 
    flex: 1 
  },
  roomName: { 
    fontSize: 16, 
    fontWeight: "600", 
    color: DARK 
  },
  roomDate: { 
    fontSize: 12, 
    color: GRAY_MID, 
    marginTop: 2 
  },
  roomChevron: { 
    fontSize: 22, 
    color: GRAY_300, 
    fontWeight: "300" 
  },
  separator: { 
    height: 1, 
    backgroundColor: GRAY_LIGHT, 
    marginLeft: 78 
  },
});