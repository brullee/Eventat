import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  showPendingRequests,
  fetchFriendsList,
  showProfile,
} from "../../../API/action/friend";

import Colors from "../../../src/constants/Colors";

const { width } = Dimensions.get("window");

const Friends = () => {
  const dispatch = useDispatch();
  const [receiverId, setReceiverId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [viewAll, setViewAll] = useState(false);

  const pendingRequests = useSelector(
    (state) => state.friendReducer.pendingRequests || []
  );
  const friendsList = useSelector(
    (state) => state.friendReducer.friendsList || []
  );
  const showProfiles = useSelector(
    (state) => state.friendReducer.profile || []
  );

  useEffect(() => {
    dispatch(showPendingRequests());
    dispatch(fetchFriendsList());
    dispatch(showProfile());
  }, [dispatch]);

  useEffect(() => {
    if (viewAll) {
      const results = showProfiles.filter((profile) =>
        profile.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProfiles(results);
    }
  }, [searchQuery, showProfiles, viewAll]);

  const handleSendRequest = () => {
    if (receiverId) {
      dispatch(sendFriendRequest(receiverId));
      setReceiverId("");
    } else {
      Alert.alert("Please enter a receiver ID");
    }
  };

  const handleAcceptRequest = (requestId) => {
    dispatch(acceptFriendRequest(requestId));
  };

  const handleRejectRequest = (requestId) => {
    dispatch(rejectFriendRequest(requestId));
  };

  const handleViewAll = () => {
    setViewAll(true);
    setFilteredProfiles(showProfiles);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Send Friend Request</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Enter Receiver ID"
          value={receiverId}
          onChangeText={setReceiverId}
          placeholderTextColor={Colors.gray.dark}
        />
        <Pressable style={styles.sendButton} onPress={handleSendRequest}>
          <Text style={styles.sendButtonText}>Send</Text>
        </Pressable>
      </View>

      <Text style={styles.heading}>Pending Requests</Text>
      {pendingRequests.map((item) => (
        <View style={styles.requestItem} key={item?.id}>
          <Text style={styles.requestText}>{item?.sender?.name}</Text>
          <View style={styles.requestActions}>
            <Pressable
              style={styles.acceptButton}
              onPress={() => handleAcceptRequest(item?.sender?.id)}
            >
              <Text style={styles.acceptButtonText}>Accept</Text>
            </Pressable>
            <Pressable
              style={styles.rejectButton}
              onPress={() => handleRejectRequest(item?.sender?.id)}
            >
              <Text style={styles.rejectButtonText}>Reject</Text>
            </Pressable>
          </View>
        </View>
      ))}

      <Text style={styles.heading}>Friends List</Text>
      {friendsList.map((item) => (
        <View key={item.id}>
          <Text style={styles.friendItem}>{item.name}</Text>
        </View>
      ))}

      <Text style={styles.heading}>Search and View All Profiles</Text>
      {viewAll && (
        <TextInput
          style={styles.input}
          placeholder="Search by Name"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={Colors.gray.dark}
        />
      )}
      {!viewAll && (
        <Pressable style={styles.viewAllButton} onPress={handleViewAll}>
          <Text style={styles.viewAllButtonText}>View All</Text>
        </Pressable>
      )}

      {viewAll &&
        filteredProfiles.map((item) => (
          <View style={styles.profileItem} key={item.id}>
            <Text style={styles.profileText}>{item.name}</Text>
            <Text style={styles.profileSubText}>{item.email}</Text>
            <Pressable
              style={styles.sendButton}
              onPress={() => dispatch(sendFriendRequest(item.id))}
            >
              <Text style={styles.sendButtonText}>Send Request</Text>
            </Pressable>
          </View>
        ))}
    </View>
  );
};

export default Friends;

const styles = StyleSheet.create({
  container: {
    width: width - 32,
    flex: 1,
    padding: 16,
    backgroundColor: Colors.background.surface,
    borderRadius: 12,
  },
  heading: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 10,
    marginTop: 5,
    color: Colors.gray.muted,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  input: {
    borderRadius: 8,
    padding: 10,
    backgroundColor: Colors.background.base,
    color: Colors.gray.light,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: Colors.accent.secondary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  sendButtonText: {
    color: Colors.background.surface,
    fontWeight: "bold",
  },
  requestItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: Colors.background.base,
    borderRadius: 8,
    elevation: 2,
  },
  requestText: {
    fontSize: 16,
    color: Colors.gray.light,
  },
  requestActions: {
    flexDirection: "row",
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: Colors.accent.secondary,
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  acceptButtonText: {
    color: Colors.gray.white,
    fontWeight: "bold",
  },
  rejectButton: {
    backgroundColor: Colors.accent.primary,
    padding: 10,
    borderRadius: 8,
  },
  rejectButtonText: {
    color: Colors.gray.white,
    fontWeight: "bold",
  },
  friendItem: {
    fontSize: 16,
    color: Colors.gray.light,
    padding: 10,
    backgroundColor: Colors.background.base,
    borderRadius: 8,
    marginBottom: 10,
  },
  viewAllButton: {
    backgroundColor: Colors.background.base,
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  viewAllButtonText: {
    color: Colors.gray.light,
    textAlign: "center",
  },
  profileItem: {
    marginTop: 10,
    padding: 10,
    // marginBottom: 10,
    backgroundColor: Colors.background.base,
    borderRadius: 8,
  },
  profileText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.accent.primary,
  },
  profileSubText: {
    fontSize: 14,
    color: Colors.gray.medium,
    marginBottom: 10,
  },
});
