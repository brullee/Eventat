import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";
import CustomShadow from "../components/CustomShadow";

import { useDispatch, useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";

import Colors from "../src/constants/Colors";
import EventDetailsHeader from "../components/Headers/EventDetailsHeader";

import StatusBarComponent from "../components/ui/StatusBar";
import RefreshableScrollView from "../components/RefreshableScrollView";
import TextDetails from "../components/TextDetails";
import DetailCardSeparator from "../components/EventDetails/DetailCardSeparator";
import DetailCardSection from "../components/EventDetails/DetailCardSection";
import AttendeePictures from "../components/AttendeePictures";

import {
  joinEvent,
  checkIfUserJoinedEvent,
  leaveEvent,
} from "../API/action/eventUser";

import { findOneEvent } from "../API/action/event";

import * as actionType from "../API/actionTypes";
import CommentSection from "../components/EventDetails/Comments/CommentSection";
import EventDetailsFooter from "../components/EventDetails/EventDetailsFooter";
import ImageSlider from "../components/EventDetails/ImageSlider";
import PosterDetails from "../components/PosterDetails";
import * as SecureStore from "expo-secure-store";

function EventDetails() {
  const { width } = useWindowDimensions();
  const cardWidth = width < 411 ? 370 : 380;
  const aboutWidth = width < 411 ? 360 : 370;

  const [user, setUser] = useState(SecureStore.getItemAsync("profile"));
  const [joinState, setJoinState] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();
  const route = useRoute();

  const { eventId } = route.params;

  const oneEvent = useSelector((state) => state.event.oneEvent || {});

  useEffect(() => {
    dispatch(findOneEvent(eventId));
  }, [dispatch, eventId]);

  const dispatch = useDispatch();

  const checkIfUserJoined = useSelector(
    (state) => state.eventUser.checkIfUserJoinedEvent
  );

  const fetchStatus = async () => {
    setLoading(true);
    await dispatch(checkIfUserJoinedEvent(oneEvent?.id));
    setLoading(false);
  };

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
    fetchStatus();
    setJoinState(checkIfUserJoined);
  }, [dispatch, oneEvent?.id, checkIfUserJoined]);

  function joinHandler() {
    setJoinState(!joinState);
  }

  async function joinHandler() {
    if (!joinState) {
      await dispatch(joinEvent(oneEvent?.id));
      setJoinState(true);
    } else {
      await dispatch(leaveEvent(oneEvent?.id));
      setJoinState(false);
    }
  }

  function formatTime(dateString) {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");

    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${hours}:${minutes} ${period}`;
  }

  function formatDate(dateString) {
    const date = new Date(dateString);

    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayOfWeek = daysOfWeek[date.getDay()];

    const dayOfMonth = date.getDate();

    const monthsOfYear = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = monthsOfYear[date.getMonth()];

    const year = date.getFullYear();

    return `${dayOfWeek}, ${dayOfMonth} ${month} ${year}`;
  }

  const isClub = oneEvent?.clubId ? true : false;

  return (
    <StatusBarComponent>
      <View style={styles.container}>
        <EventDetailsHeader />
        {loading ? (
          <ActivityIndicator
            size="large"
            color={Colors.accent.secondary}
            style={{ marginTop: 15 }}
          />
        ) : (
          <>
            <RefreshableScrollView
              style={[{ paddingBottom: 60, alignItems: "center" }]}
              onRefresh={fetchStatus}
            >
              <View style={styles.imagesContainer}>
                <ImageSlider images={oneEvent?.posters} />
              </View>

              <View style={styles.titleContainer}>
                <Text style={styles.titleText}>{oneEvent?.event_name}</Text>
              </View>

              {isClub ? (
                <PosterDetails
                  isApproved={isApproved}
                  creatorImage={oneEvent?.club?.posters[0]}
                  creatorName={oneEvent?.club?.name}
                  inEventDetails={true}
                  club={true}
                  onPress={() =>
                    navigation.navigate("ClubDetails", {
                      screen: "ClubDetails",
                      clubId: oneEvent?.club.id,
                    })
                  }
                />
              ) : (
                <PosterDetails
                  isApproved={isApproved}
                  creatorImage={oneEvent?.user?.image}
                  creatorName={oneEvent?.user?.name}
                  inEventDetails={true}
                  club={false}
                />
              )}

              {/* DETAILS SECTION */}
              <View style={styles.detailsContainer}>
                <CustomShadow>
                  <View style={[styles.detailsCard, { width: cardWidth }]}>
                    {/* DATE AND TIME SUB-SECTION*/}
                    <DetailCardSection
                      iconName="calendar-clear-outline"
                      primary={formatDate(oneEvent?.event_date)}
                      secondary={formatTime(oneEvent?.event_date)}
                    >
                      <Ionicons
                        name="chevron-forward"
                        size={30}
                        color={Colors.gray.light}
                      />
                    </DetailCardSection>

                    {/* SEPARATOR */}
                    <DetailCardSeparator />

                    {/* LOCATION SUB-SECTION*/}
                    <DetailCardSection
                      iconName="location-outline"
                      primary={oneEvent?.faculty}
                      secondary={oneEvent?.room + ", " + oneEvent?.floor}
                    >
                      <Ionicons
                        name="chevron-forward"
                        size={30}
                        color={Colors.gray.light}
                      />
                    </DetailCardSection>

                    {/* SEPARATOR */}
                    <DetailCardSeparator />

                    {/* ATTENDEES SUB-SECTION*/}
                    <DetailCardSection
                      iconName="checkmark-circle-outline"
                      primary="Attendees"
                      secondary={
                        oneEvent?.joined_users?.length == 0
                          ? "No Attendees"
                          : oneEvent?.joined_users?.length
                      }
                    >
                      <AttendeePictures
                        attendees={oneEvent?.joined_users?.length}
                      />
                    </DetailCardSection>
                  </View>
                </CustomShadow>
              </View>

              {/* ABOUT SECTION */}
              <View style={[styles.aboutContainer, { width: aboutWidth }]}>
                <Text style={styles.aboutTitle}>About</Text>
                <TextDetails
                  description={oneEvent?.event_desc}
                  textStyle={styles.sectionText}
                  maxLines={5}
                />
              </View>

              {/* COMMENTS SECTION */}

              <CommentSection
                eventId={oneEvent?.id}
                userImage={user?.user?.user?.image}
              />
            </RefreshableScrollView>
            <EventDetailsFooter
              isAttending={joinState}
              onJoinLeave={joinHandler}
            />
          </>
        )}
      </View>
    </StatusBarComponent>
  );
}

export default EventDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.base,
  },
  imagesContainer: {
    marginTop: 12,
  },
  titleContainer: {
    marginBottom: 14,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  titleText: {
    fontSize: 35,
    fontWeight: 500,
    color: Colors.accent.primary,
    textAlign: "center",
  },
  posterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 5,
    maxWidth: 400,
  },
  posterName: {
    fontSize: 20,
    marginHorizontal: 8,
    marginRight: 0,
    color: Colors.gray.light,
    width: 200,
  },
  joinButtonContaienr: {
    position: "absolute",
    left: 282,
    width: 90,
  },
  detailsContainer: {
    marginVertical: 24,
  },
  detailsCard: {
    backgroundColor: Colors.background.surface,
    // width: 380,
    borderRadius: 16,
  },
  aboutContainer: {
    marginHorizontal: 15,
    width: 370,
  },
  aboutTitle: {
    fontSize: 23,
    color: Colors.accent.primary,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: Colors.gray.light,
    fontWeight: 400,
  },
  readMoreButton: {
    color: Colors.accent.secondary,
    fontWeight: 600,
  },
  posterImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  navigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 90,
  },
  attendingImages: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: 90,
  },
});
