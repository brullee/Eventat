import { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

import UserDetails from "../components/ui/ProfileUi/UserDetails";

import { useDispatch } from "react-redux";
import * as actionType from "../API/actionTypes";

import * as SecureStore from "expo-secure-store";

import Friends from "../components/ui/ProfileUi/Friend";
import Colors from "../src/constants/Colors";
import SubSectionHeader from "../components/Headers/SubSectionHeader";
import StatusBarComponent from "../components/ui/StatusBar";
import DetailCardSection from "../components/EventDetails/DetailCardSection";
import DetailCardSeparator from "../components/EventDetails/DetailCardSeparator";
import { Ionicons } from "@expo/vector-icons";

export default function Profile() {
  const dispatch = useDispatch();
  const [user, setUser] = useState(SecureStore.getItemAsync("profile"));

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = await SecureStore.getItemAsync("profile");
        if (storedUser) {
          const userObject = JSON.parse(storedUser);
          setUser(userObject);
        } else {
          console.log("No user data found in SecureStore.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  async function handleLogOut() {
    await SecureStore.deleteItemAsync("profile");
    dispatch({ type: actionType.LOGOUT });
  }

  return (
    <StatusBarComponent>
      <View style={styles.safeArea}>
        <View style={styles.container}>
          <SubSectionHeader backButton subPageButtons={false} title="Profile" />
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            overScrollMode="never"
          >
            <UserDetails
              image={user?.user?.user?.image}
              name={user?.user?.user?.name}
              email={user?.user?.user?.email}
              studentId={user?.user?.user?.studentId}
              major={user?.user?.user?.major}
            />

            <Text style={styles.sectionTitle}>Friends</Text>

            <View>
              <Friends />
            </View>

            <Text style={styles.sectionTitle}>App Settings</Text>

            <View style={styles.settingsSection}>
              <DetailCardSection
                iconName="notifications-outline"
                settingText="Notifications"
                profilePage
              >
                <Ionicons
                  name="chevron-forward"
                  size={30}
                  color={Colors.gray.light}
                />
              </DetailCardSection>
              <DetailCardSeparator />
              <DetailCardSection
                onPress={handleLogOut}
                iconName="log-out-outline"
                iconSize={32}
                settingText="Log Out"
                profilePage
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </StatusBarComponent>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background.base,
  },
  container: {
    flex: 1,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 16,
  },
  scrollViewContent: {
    paddingHorizontal: 16,
  },
  settingsSection: {
    backgroundColor: Colors.background.surface,
    borderRadius: 12,
    marginBottom: 24,
    overflow: "hidden",
  },
  sectionTitle: {
    fontWeight: "600",
    fontSize: 22,
    paddingLeft: 5,
    color: Colors.accent.primary,
    marginTop: 24,
    marginBottom: 16,
  },
});
