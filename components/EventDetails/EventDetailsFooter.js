import { View, Text, Pressable, StyleSheet, Platform } from "react-native";

import SwipeButton from "./SwipeButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import Colors from "../../src/constants/Colors";

function EventDetailsFooter({ isAttending, onJoinLeave }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.footer,
        {
          height: Platform.ios ? 90 : 95,
          paddingBottom: insets.bottom - (Platform.ios ? 10 : 15),
        },
      ]}
    >
      {isAttending ? (
        <View style={styles.attendingContainer}>
          <View style={styles.cancelContainer}>
            <Text style={[styles.text, { fontSize: 16, fontWeight: 500 }]}>
              You're Attending!
            </Text>
            <Pressable onPress={onJoinLeave}>
              <Text style={styles.cancelText}>Cancel Attendance</Text>
            </Pressable>
          </View>
          <Pressable>
            <View style={styles.shareButton}>
              <Ionicons
                name="share-outline"
                color={Colors.gray.light}
                size={20}
                style={styles.icon}
              />
              <Text style={styles.text}> Share</Text>
            </View>
          </Pressable>
        </View>
      ) : (
        <SwipeButton onSwipeComplete={onJoinLeave} />
      )}
    </View>
  );
}

export default EventDetailsFooter;

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingBottom: 0,
    backgroundColor: Colors.background.elevated,
    borderTopColor: Colors.gray.darkest,
    borderTopWidth: 1,
  },
  attendingContainer: {
    width: "90%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  shareButton: {
    flexDirection: "row",
    width: 160,
    height: 50,
    borderRadius: 8,
    backgroundColor: Colors.background.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: Colors.gray.light,
  },
  cancelContainer: {
    justifyContent: "space-between",

    height: 48,
  },
  cancelText: {
    color: Colors.accent.secondary,
  },
});
