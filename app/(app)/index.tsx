import { useAuthStore } from "@features/auth/presentation/store/authStore";
import { Room } from "@features/chat/domain/entities/Room";
import { useRooms } from "@features/chat/presentation/hooks/useRooms";
import { MarketplaceView } from "@features/products/presentation/views/MarketplaceView";

import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import React, { useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  MessageCircle,
  Package,
  ShieldCheck
} from "lucide-react-native";

export default function AppIndexScreen() {
  const router = useRouter();

  const user = useAuthStore((s) => s.user);

  const { rooms, isLoading } = useRooms();

  const [vendedorTab, setVendedorTab] = useState<
    "chats" | "productos"
  >("chats");

  // =====================================
  // LOADING USER
  // =====================================

  if (!user) {
    return (
      <LinearGradient
        colors={["#070B14", "#0F172A", "#111827"]}
        style={styles.centered}
      >
        <View style={styles.glowTop} />
        <View style={styles.glowBottom} />

        <BlurView
          intensity={40}
          tint="dark"
          style={styles.loaderCard}
        >
          <ActivityIndicator
            size="large"
            color="#ef4444"
          />

          <Text style={styles.loadingText}>
            Loading user profile...
          </Text>
        </BlurView>
      </LinearGradient>
    );
  }

  const normalizedRole =
    user.role?.toLowerCase().trim();

  // =====================================
  // CLIENTE → MARKETPLACE
  // =====================================

  if (normalizedRole !== "vendedor") {
    return <MarketplaceView />;
  }

  // =====================================
  // ROOM CARD
  // =====================================

  const renderRoom = ({
    item,
  }: {
    item: Room;
  }) => (
    <TouchableOpacity
      style={styles.roomWrapper}
      onPress={() =>
        router.push(`/chat/${item.id}`)
      }
      activeOpacity={0.88}
    >
      <BlurView
        intensity={35}
        tint="dark"
        style={styles.roomCard}
      >
        {/* Glow */}
        <View style={styles.roomGlow} />

        {/* Avatar */}
        <LinearGradient
          colors={["#ef4444", "#991b1b"]}
          style={styles.roomAvatar}
        >
          <Text style={styles.roomAvatarText}>
            {(item.productName ?? "C")
              .charAt(0)
              .toUpperCase()}
          </Text>
        </LinearGradient>

        {/* Info */}
        <View style={styles.roomInfo}>
          <Text
            numberOfLines={1}
            style={styles.roomName}
          >
            {item.productName}
          </Text>

          <View style={styles.roomMeta}>
            <ShieldCheck
              size={12}
              color="#22c55e"
            />

            <Text style={styles.roomDate}>
              {item.createdAt
                ? new Date(
                    item.createdAt
                  ).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                    }
                  )
                : ""}
            </Text>
          </View>
        </View>

        {/* Chevron */}
        <View style={styles.chevronContainer}>
          <Text style={styles.roomChevron}>
            ›
          </Text>
        </View>
      </BlurView>
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#070B14", "#0F172A", "#111827"]}
        style={styles.container}
      >
        {/* Ambient Glow */}
        <View style={styles.glowTop} />
        <View style={styles.glowBottom} />

        <SafeAreaView style={styles.safe}>
          {/* ================================= */}
          {/* HEADER */}
          {/* ================================= */}


          {/* ================================= */}
          {/* HERO */}
          {/* ================================= */}


          {/* ================================= */}
          {/* TABS */}
          {/* ================================= */}

          <BlurView
            intensity={30}
            tint="dark"
            style={styles.tabsWrapper}
          >
            <TouchableOpacity
              style={[
                styles.tabButton,
                vendedorTab === "chats" &&
                  styles.tabButtonActive,
              ]}
              onPress={() =>
                setVendedorTab("chats")
              }
              activeOpacity={0.85}
            >
              <MessageCircle
                size={16}
                color={
                  vendedorTab === "chats"
                    ? "#fff"
                    : "#94a3b8"
                }
              />

              <Text
                style={[
                  styles.tabText,
                  vendedorTab === "chats" &&
                    styles.tabTextActive,
                ]}
              >
                Chats
              </Text>

              <View
                style={[
                  styles.badge,
                  vendedorTab === "chats" &&
                    styles.badgeActive,
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    vendedorTab === "chats" &&
                      styles.badgeTextActive,
                  ]}
                >
                  {rooms.length}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                vendedorTab === "productos" &&
                  styles.tabButtonActive,
              ]}
              onPress={() =>
                setVendedorTab("productos")
              }
              activeOpacity={0.85}
            >
              <Package
                size={16}
                color={
                  vendedorTab === "productos"
                    ? "#fff"
                    : "#94a3b8"
                }
              />

              <Text
                style={[
                  styles.tabText,
                  vendedorTab === "productos" &&
                    styles.tabTextActive,
                ]}
              >
                Products
              </Text>
            </TouchableOpacity>
          </BlurView>

          {/* ================================= */}
          {/* CONTENT */}
          {/* ================================= */}

          {vendedorTab === "productos" ? (
            <MarketplaceView />
          ) : isLoading ? (
            <View style={styles.centered}>
              <BlurView
                intensity={40}
                tint="dark"
                style={styles.loaderCard}
              >
                <ActivityIndicator
                  size="large"
                  color="#ef4444"
                />

                <Text style={styles.loadingText}>
                  Loading chats...
                </Text>
              </BlurView>
            </View>
          ) : (
            <FlatList
              data={rooms}
              keyExtractor={(r) => r.id}
              renderItem={renderRoom}
              showsVerticalScrollIndicator={
                false
              }
              contentContainerStyle={
                rooms.length === 0
                  ? styles.emptyContainer
                  : styles.listContainer
              }
              ItemSeparatorComponent={() => (
                <View style={{ height: 14 }} />
              )}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <LinearGradient
                    colors={[
                      "#ef4444",
                      "#991b1b",
                    ]}
                    style={
                      styles.emptyIconWrapper
                    }
                  >
                    <MessageCircle
                      size={34}
                      color="#fff"
                    />
                  </LinearGradient>

                  <Text style={styles.emptyTitle}>
                    No chats yet
                  </Text>

                  <Text
                    style={styles.emptySubtitle}
                  >
                    When clients contact you
                    about your products, their
                    conversations will appear
                    here automatically.
                  </Text>
                </View>
              }
            />
          )}
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#070B14",
  },

  safe: {
    flex: 1,
  },

  glowTop: {
    position: "absolute",
    top: -120,
    right: -80,
    width: 240,
    height: 240,
    borderRadius: 240,
    backgroundColor:
      "rgba(239,68,68,0.18)",
  },

  glowBottom: {
    position: "absolute",
    bottom: -120,
    left: -60,
    width: 240,
    height: 240,
    borderRadius: 240,
    backgroundColor:
      "rgba(59,130,246,0.16)",
  },

  // =========================
  // HEADER
  // =========================

  header: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -1,
  },

  headerSubtitle: {
    marginTop: 6,
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2.5,
  },

  profileCircle: {
    width: 52,
    height: 52,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  profileLetter: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },

  // =========================
  // HERO
  // =========================

  heroCard: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 18,
    borderRadius: 28,
    padding: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.08)",
    backgroundColor:
      "rgba(255,255,255,0.04)",
  },

  heroGlow: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor:
      "rgba(239,68,68,0.15)",
  },

  heroLabel: {
    color: "#fca5a5",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 12,
  },

  heroTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 30,
    letterSpacing: -1,
  },

  heroText: {
    marginTop: 12,
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: 22,
  },

  // =========================
  // TABS
  // =========================

  tabsWrapper: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 18,
    borderRadius: 22,
    padding: 6,
    overflow: "hidden",
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.08)",
    backgroundColor:
      "rgba(255,255,255,0.04)",
  },

  tabButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 18,
  },

  tabButtonActive: {
    backgroundColor:
      "rgba(239,68,68,0.18)",
    borderWidth: 1,
    borderColor:
      "rgba(239,68,68,0.22)",
  },

  tabText: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "700",
  },

  tabTextActive: {
    color: "#fff",
  },

  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor:
      "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },

  badgeActive: {
    backgroundColor: "#ef4444",
  },

  badgeText: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "700",
  },

  badgeTextActive: {
    color: "#fff",
  },

  // =========================
  // LIST
  // =========================

  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  roomWrapper: {
    borderRadius: 26,
    overflow: "hidden",
  },

  roomCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 26,
    overflow: "hidden",
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.08)",
    backgroundColor:
      "rgba(255,255,255,0.04)",
  },

  roomGlow: {
    position: "absolute",
    top: -30,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor:
      "rgba(239,68,68,0.12)",
  },

  roomAvatar: {
    width: 58,
    height: 58,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  roomAvatarText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
  },

  roomInfo: {
    flex: 1,
  },

  roomName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  roomMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },

  roomDate: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "500",
  },

  chevronContainer: {
    width: 36,
    height: 36,
    borderRadius: 14,
    backgroundColor:
      "rgba(255,255,255,0.06)",
    justifyContent: "center",
    alignItems: "center",
  },

  roomChevron: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "300",
    marginTop: -2,
  },

  // =========================
  // EMPTY
  // =========================

  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  emptyState: {
    alignItems: "center",
  },

  emptyIconWrapper: {
    width: 92,
    height: 92,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },

  emptyTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 10,
  },

  emptySubtitle: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: 22,
  },

  // =========================
  // LOADING
  // =========================

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  loaderCard: {
    paddingVertical: 30,
    paddingHorizontal: 34,
    borderRadius: 28,
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.08)",
    backgroundColor:
      "rgba(255,255,255,0.04)",
  },

  loadingText: {
    marginTop: 14,
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "500",
  },
});