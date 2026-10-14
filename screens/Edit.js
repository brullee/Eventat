import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
  Alert,
  Image,
  Platform,
  Modal,
} from "react-native";

import StatusBarComponent from "../components/ui/StatusBar";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { useDispatch } from "react-redux";
import { createEvent, updateEvent } from "../API/action/event";
import SubSectionHeader from "../components/Headers/SubSectionHeader";
import DateTimePicker from "@react-native-community/datetimepicker";
import AuthTextInput from "../components/ui/AuthUi/AuthTextInput";
import AuthButton from "../components/ui/AuthUi/AuthButton";
import Colors from "../src/constants/Colors";

import { Dropdown } from "react-native-element-dropdown";

const { width } = Dimensions.get("window");

const Edit = ({ eventID = 3 }) => {
  const [tempDate, setTempDate] = useState(new Date());
  const [tempTime, setTempTime] = useState(new Date());

  const dispatch = useDispatch();
  const [eventName, setEventName] = useState("");
  const [eventDateTime, setEventDateTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [eventFaculty, setEventFaculty] = useState("");
  const [eventFloor, setEventFloor] = useState("");
  const [eventRoom, setEventRoom] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [images, setImages] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const totalImages = images.length + result.assets.length;
      if (totalImages > 6) {
        Alert.alert(
          "Image Limit Reached",
          "You can only upload up to 6 images."
        );
      } else {
        setImages((prevImages) => [
          ...prevImages,
          ...result.assets.slice(0, 6 - prevImages.length),
        ]);
      }
    }
  };

  const faculties = {
    "Conference Hall": "32.04235706530699, 35.90077170744573",
    "Faculty of Sharia & Islamic Studies":
      "32.04147166360305, 35.90049085546174",
    "Faculty of Engineering": "32.04110517252083, 35.90046230634091",
    "Student Activities Building": "32.041927962418825, 35.899582162383595",
    "Faculty of Economics and Administrative Sciences":
      "32.04044638372422, 35.90106738527859",
    "Faculty of IT": "32.040468804302854, 35.901375581054666",
    "Faculty of Pharmacy": "32.04022038450591, 35.90199291891347",
    "Presidency Building": "32.041619257774244, 35.902921284895164",
    "Faculty of Arts and Humanities": "32.03986960264171, 35.90239394345769",
    "King Hussein Sports Hall": "32.039664673423765, 35.90119666863786",
    "University Library": "32.0384689358981, 35.90094348597592",
    "Faculty of Nursing": "32.038288381582205, 35.90200846069219",
    "Faculty of Dentistry": "32.03955906760852, 35.902149117734986",
    "Faculty of Allied Medical Sciences":
      "32.03827496940359, 35.902139639993976",
    "ASU Stadium": "32.03847634377796, 35.8982060809678",
    "Animal House": "32.0375780674437, 35.90048945904207",
    "Square 360": "32.04117773331819, 35.90179475191668",
  };

  const facultyOptions = Object.keys(faculties).map((faculty) => ({
    label: faculty,
    value: faculty,
  }));

  const uploadImages = async () => {
    try {
      setUploading(true);
      const uploadedUrls = await Promise.all(
        images.map(async (image) => {
          const response = await fetch(image.uri);
          const blob = await response.blob();
          const fileName = `${new Date().getTime()}-${image.uri
            .split("/")
            .pop()}`;
          const imageRef = ref(storage, `${fileName}`);
          await uploadBytes(imageRef, blob);
          return await getDownloadURL(imageRef);
        })
      );
      setUploading(false);
      return uploadedUrls;
    } catch (error) {
      setUploading(false);
      Alert.alert(
        "Upload Error",
        error.message || "An unknown error occurred."
      );
      return [];
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDate = new Date(eventDateTime);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      setEventDateTime(newDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(eventDateTime);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      newDate.setSeconds(0);
      setEventDateTime(newDate);
    }
  };

  const handleFacultyChange = (faculty) => {
    setEventFaculty(faculty);
    const coords = faculties[faculty].split(", ");
    setLatitude(parseFloat(coords[0]));
    setLongitude(parseFloat(coords[1]));
  };

  const handleImagePress = (index) => {
    setSelectedImageIndex(index);
    setShowDeleteModal(true);
  };

  const confirmDeleteImage = () => {
    if (selectedImageIndex !== null) {
      const newImages = [...images];
      newImages.splice(selectedImageIndex, 1);
      setImages(newImages);
    }
    setShowDeleteModal(false);
    setSelectedImageIndex(null);
  };

  const handleSubmit = async () => {
    const uploadedUrls = await uploadImages();

    const eventData = {
      event_name: eventName,
      event_desc: eventDescription,
      event_date: eventDateTime,
      faculty: eventFaculty,
      floor: eventFloor,
      room: eventRoom,
      posters: uploadedUrls,
    };

    dispatch(updateEvent(eventID, eventData));
    setEventName("");
    setEventDescription("");
    setEventFaculty("");
    setEventFloor("");
    setEventRoom("");
    setImages([]);
    Alert.alert("Success", "Event created successfully.");
  };

  return (
    <StatusBarComponent>
      <View style={{ flex: 1, backgroundColor: Colors.background.base }}>
        <SubSectionHeader
          title="Edit"
          subPageButtons={false}
          backButton={true}
        />
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          overScrollMode="never"
        >
          <View style={styles.container}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Event Name</Text>

              <AuthTextInput
                placeholder="Event Name"
                value={eventName}
                onChangeText={setEventName}
              />
            </View>

            <Text style={[styles.label, { alignSelf: "flex-start" }]}>
              Date & Time
            </Text>

            {Platform.OS === "android" ? (
              <View style={styles.inputContainerRow}>
                <View style={styles.inputContainer}>
                  <Pressable
                    style={styles.dateButton}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={styles.text}>
                      {eventDateTime.toLocaleDateString()}
                    </Text>
                  </Pressable>
                  {showDatePicker && (
                    <DateTimePicker
                      value={eventDateTime}
                      mode="date"
                      onChange={handleDateChange}
                    />
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <Pressable
                    style={styles.timeButton}
                    onPress={() => setShowTimePicker(true)}
                  >
                    <Text style={styles.text}>
                      {eventDateTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </Text>
                  </Pressable>
                  {showTimePicker && (
                    <DateTimePicker
                      value={eventDateTime}
                      mode="time"
                      onChange={handleTimeChange}
                    />
                  )}
                </View>
              </View>
            ) : (
              <View style={styles.inputContainerRow}>
                <View style={styles.inputContainer}>
                  <Pressable
                    style={styles.dateButton}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={styles.text}>
                      {eventDateTime.toLocaleDateString()}
                    </Text>
                  </Pressable>
                  {showDatePicker && (
                    <Modal
                      transparent
                      animationType="slide"
                      visible={showDatePicker}
                      onRequestClose={() => setShowDatePicker(false)}
                    >
                      <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                          <View style={styles.modalButtons}>
                            <Pressable onPress={() => setShowDatePicker(false)}>
                              <Text style={styles.modalCancel}>Cancel</Text>
                            </Pressable>
                            <Pressable
                              onPress={() => {
                                const newDate = new Date(eventDateTime);
                                newDate.setFullYear(tempDate.getFullYear());
                                newDate.setMonth(tempDate.getMonth());
                                newDate.setDate(tempDate.getDate());
                                setEventDateTime(newDate);
                                setShowDatePicker(false);
                              }}
                            >
                              <Text style={styles.modalConfirm}>Confirm</Text>
                            </Pressable>
                          </View>
                          <DateTimePicker
                            value={tempDate}
                            mode="date"
                            display="spinner"
                            onChange={(e, selectedDate) => {
                              if (selectedDate) setTempDate(selectedDate);
                            }}
                          />
                        </View>
                      </View>
                    </Modal>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <Pressable
                    style={styles.timeButton}
                    onPress={() => setShowTimePicker(true)}
                  >
                    <Text style={styles.text}>
                      {eventDateTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </Text>
                  </Pressable>
                  {showTimePicker && (
                    <Modal
                      transparent={true}
                      animationType="slide"
                      visible={showTimePicker}
                      onRequestClose={() => setShowTimePicker(false)}
                    >
                      <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                          <View style={styles.modalButtons}>
                            <Pressable onPress={() => setShowTimePicker(false)}>
                              <Text style={styles.modalCancel}>Cancel</Text>
                            </Pressable>
                            <Pressable
                              onPress={() => {
                                const newDate = new Date(eventDateTime);
                                newDate.setHours(tempTime.getHours());
                                newDate.setMinutes(tempTime.getMinutes());
                                newDate.setSeconds(0);
                                setEventDateTime(newDate);
                                setShowTimePicker(false);
                              }}
                            >
                              <Text style={styles.modalConfirm}>Confirm</Text>
                            </Pressable>
                          </View>
                          <DateTimePicker
                            value={tempTime}
                            mode="time"
                            display="spinner"
                            onChange={(e, selectedTime) => {
                              if (selectedTime) setTempTime(selectedTime);
                            }}
                          />
                        </View>
                      </View>
                    </Modal>
                  )}
                </View>
              </View>
            )}

            <View style={{ alignSelf: "flex-start" }}>
              <Text style={styles.label}>Faculty</Text>
            </View>
            <View
              style={[
                styles.inputContainer,
                { borderRadius: 50, overflow: "hidden" },
              ]}
            >
              <Dropdown
                style={[
                  styles.picker,
                  {
                    backgroundColor: Colors.background.surface,
                    borderRadius: 18,
                    paddingHorizontal: 15,
                    height: 48,
                  },
                ]}
                placeholderStyle={{
                  fontSize: 16,
                  color: Colors.gray.medium,
                }}
                selectedTextStyle={{
                  fontSize: 16,
                  color: Colors.gray.light,
                  background: Colors.background.surface,
                }}
                data={facultyOptions}
                labelField="label"
                valueField="value"
                placeholder="Select a faculty"
                value={eventFaculty}
                onChange={(item) => handleFacultyChange(item.value)}
                itemTextStyle={{
                  color: Colors.gray.light,
                  fontSize: 16,
                }}
                containerStyle={{
                  borderRadius: 16,
                  backgroundColor: Colors.background.surface,
                  borderColor: Colors.background.surface,
                  overflow: "hidden",
                }}
                iconColor={Colors.accent.secondary}
                activeColor={Colors.background.surface}
              />
            </View>

            <Text style={styles.label}>Floor & Room</Text>

            <View style={styles.inputContainerRow}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { textAlign: "center" }]}
                  value={eventFloor}
                  onChangeText={setEventFloor}
                  placeholder="Enter Floor"
                  placeholderTextColor={Colors.gray.dark}
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { textAlign: "center" }]}
                  value={eventRoom}
                  onChangeText={setEventRoom}
                  placeholder="Enter Room"
                  placeholderTextColor={Colors.gray.dark}
                />
              </View>
            </View>

            <Text style={styles.label}>Image</Text>

            <View style={styles.uploadImagesContainer}>
              <View style={[styles.uploadButtonRow]}>
                <Pressable onPress={pickImages} style={styles.button}>
                  <Text style={styles.buttonText}>Upload Image</Text>
                </Pressable>

                <Text style={[styles.text, { marginLeft: 10 }]}>
                  {images.length} {images.length === 1 ? "Image" : "Images"}{" "}
                  selected
                </Text>
              </View>

              {images.length > 0 && (
                <ScrollView
                  horizontal
                  overScrollMode="never"
                  contentContainerStyle={{
                    marginTop: 2,
                    marginBottom: 0,
                  }}
                >
                  {images.map((image, index) => (
                    <Pressable
                      key={index}
                      onPress={() => handleImagePress(index)}
                    >
                      <View>
                        <Image
                          source={{ uri: image.uri }}
                          style={{ width: 100, height: 100, margin: 5 }}
                        />
                      </View>
                    </Pressable>
                  ))}
                </ScrollView>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.descriptionInput,
                  { borderRadius: 18 },
                ]}
                value={eventDescription}
                onChangeText={setEventDescription}
                placeholder="Event description"
                placeholderTextColor={Colors.gray.dark}
                multiline
              />
            </View>

            <AuthButton onPress={handleSubmit}>Save</AuthButton>
          </View>
        </ScrollView>
        <Modal
          transparent
          animationType="slide"
          // animationType={Platform.OS === "IOS" ? "slide" : "none"}
          visible={showDeleteModal}
          onRequestClose={() => setShowDeleteModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { paddingBottom: 30 }]}>
              <Text
                style={[
                  styles.text,
                  { textAlign: "center", paddingBottom: 40 },
                ]}
              >
                Are you sure you want to delete this?
              </Text>
              <View style={[styles.modalButtons, { paddingHorizontal: 50 }]}>
                <Pressable onPress={() => setShowDeleteModal(false)}>
                  <Text style={styles.modalCancel}>Cancel</Text>
                </Pressable>
                <Pressable onPress={confirmDeleteImage}>
                  <Text style={styles.modalConfirm}>Delete</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </StatusBarComponent>
  );
};

export default Edit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    alignItems: "center",
    backgroundColor: Colors.background.base,
    paddingTop: 15,
    paddingBottom: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputContainerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width - 32,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    marginTop: 5,
    marginLeft: 15,
    fontWeight: "600",
    color: Colors.gray.light,
    alignSelf: "flex-start",
  },
  input: {
    backgroundColor: Colors.background.surface,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 24,
    fontSize: 16,
    color: Colors.gray.light,
    minHeight: 47,
    width: 147,
    alignSelf: "center",
  },
  descriptionInput: {
    minHeight: 95,
    lineHeight: 20,
    textAlignVertical: "top",
    width: width - 32,
  },
  dateButton: {
    backgroundColor: Colors.background.surface,
    width: 147,
    borderRadius: 24,
    height: 47,
    justifyContent: "center",
    alignItems: "center",
  },
  timeButton: {
    backgroundColor: Colors.background.surface,
    width: 147,
    borderRadius: 24,
    height: 47,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    color: Colors.gray.light,
  },
  uploadImagesContainer: {
    marginBottom: 15,
    width: width - 32,
  },
  uploadButtonRow: {
    flexDirection: "row",
    alignItems: "center",
    width: width - 32,
  },
  button: {
    backgroundColor: Colors.background.surface,
    borderRadius: 20,
    padding: 8,
    alignItems: "center",
    width: 150,
  },
  buttonText: {
    fontFamily: "Roboto",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 24,
    color: Colors.accent.secondary,
  },
  picker: {
    height: 55,
    width: width - 32,
    backgroundColor: Colors.background.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: Platform.OS === "ios" ? "flex-end" : "center",
    alignItems: Platform.OS === "android" && "center",
    backgroundColor: Platform.OS === "android" && "rgba(0, 0, 0, 0)",
  },
  modalContent: {
    backgroundColor:
      Platform.OS === "android"
        ? Colors.background.elevated
        : Colors.background.surface,
    borderRadius: 16,
    padding: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalCancel: {
    fontSize: 16,
    color: Colors.gray.light,
  },
  modalConfirm: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.accent.secondary,
  },
});
