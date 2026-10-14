import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Modal, Button } from "react-native";
import StatusBarComponent from "../../components/ui/StatusBar";
import MapView, { Marker } from "react-native-maps";
import Colors from "../../src/constants/Colors";
import Header from "../../components/Headers/Header";
import { showEvents } from "../../API/action/event";
import * as actionType from "../../API/actionTypes";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const App = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [selectedEvent, setSelectedEvent] = useState(null); // State for selected event

  const allEvents = useSelector((state) => state.event.events || []);

  const fetchEvents = () => {
    dispatch(showEvents({ type: actionType.FETCH_ALL }));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <StatusBarComponent>
      <View style={styles.safeArea}>
        <Header noFilter />
        <View style={styles.container}>
          <MapView
            style={styles.mapStyle}
            initialRegion={{
              latitude: 32.0401803456018,
              longitude: 35.900398904295194,
              latitudeDelta: 0.009,
              longitudeDelta: 0.009,
            }}
          >
            {allEvents?.map((marker) => (
              <Marker
                key={marker.id}
                coordinate={{
                  latitude: marker?.latitude || 32.0401803456018,
                  longitude: marker?.longitude || 35.900398904295194,
                }}
                onPress={() => setSelectedEvent(marker)}
              />
            ))}
          </MapView>

          {/* Modal for displaying selected event details */}
          {selectedEvent && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={!!selectedEvent}
              onRequestClose={() => setSelectedEvent(null)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>
                    {selectedEvent.event_name || "Event Name"}
                  </Text>
                  <Text style={styles.modalDescription}>
                    {selectedEvent.event_desc || "No Description Available"}
                  </Text>
                  <Button
                    title="Event Details"
                    onPress={() =>
                      navigation.navigate("EventDetails", {
                        eventId: selectedEvent?.id,
                      })
                    }
                    color={Colors.primary}
                  />
                  <Button
                    title="Close"
                    onPress={() => setSelectedEvent(null)}
                    color={Colors.primary}
                  />
                </View>
              </View>
            </Modal>
          )}
        </View>
      </View>
    </StatusBarComponent>
  );
};

export default App;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background.base,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background.base,
    borderWidth: 1,
  },
  mapStyle: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 20,
  },
});
