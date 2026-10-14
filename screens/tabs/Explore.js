import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

import StatusBarComponent from "../../components/ui/StatusBar";
import Colors from "../../src/constants/Colors";
import EventCard from "../../components/Cards/EventCard";
import RefreshableScrollView from "../../components/RefreshableScrollView";
import { useDispatch, useSelector } from "react-redux";
import { showEvents } from "../../API/action/event";
import * as actionType from "../../API/actionTypes";
import Header from "../../components/Headers/Header";

export default function Explore() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("Upcoming");

  const allEvents = useSelector((state) => state.event.events || []);
  const fetchEvents = () => {
    dispatch(showEvents({ type: actionType.FETCH_ALL }));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = allEvents?.filter((event) => {
    const eventDate = new Date(event.event_date);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const weekend = new Date();
    weekend.setDate(today.getDate() + (6 - today.getDay()));

    let dateMatches;
    if (activeTab === "Today") {
      dateMatches = eventDate.toDateString() === today.toDateString();
    } else if (activeTab === "Tomorrow") {
      dateMatches = eventDate.toDateString() === tomorrow.toDateString();
    } else if (activeTab === "Weekend") {
      dateMatches = eventDate.toDateString() === weekend.toDateString();
    } else if (activeTab === "Upcoming") {
      dateMatches = true; // Show all events
    } else {
      dateMatches = eventDate > today;
    }

    const nameMatches = event.event_name
      .toLowerCase()
      .includes(searchText.toLowerCase());

    return dateMatches && nameMatches;
  });

  const navigation = useNavigation();

  return (
    <StatusBarComponent>
      <View style={styles.container}>
        <Header
          searchText={searchText}
          onSearchChange={setSearchText}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <RefreshableScrollView
          onRefresh={fetchEvents}
          style={styles.bodyContainer}
        >
          {filteredEvents?.map((event, index) => (
            <View key={event.id}>
              <EventCard
                eventName={event?.event_name}
                eventDate={event?.event_date}
                eventLocation={event?.event_desc}
                logo={event?.user?.image}
                eventOrganizer={event?.user?.name}
                eventImage={event?.posters[0]}
                faculty={event?.faculty}
                onPress={() =>
                  navigation.navigate("EventDetails", {
                    eventId: event?.id,
                  })
                }
                attendeeCount={event?.joined_users?.length || 0}
                joined_users={event?.joined_users || []}
              />
              {index < filteredEvents.length - 1 && (
                <View style={styles.separator} />
              )}
            </View>
          ))}
        </RefreshableScrollView>
      </View>
    </StatusBarComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.base,
  },
  headerContainer: {
    backgroundColor: Colors.background.elevated,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: Colors.background.base,
  },
  searchBarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
  },
  bodyContainer: {
    // flex: 1,
    marginTop: 5,
    paddingVertical: 10,
    alignItems: "center",
  },
  searchbar: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.background.surface,
    paddingLeft: 15,
    color: "#FFFFFF",
  },
  iconContainer: {
    padding: 5,
    paddingLeft: 15,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.gray.darkest,
    marginVertical: 12,
    marginBottom: 20,
    marginHorizontal: 15,
  },
});
