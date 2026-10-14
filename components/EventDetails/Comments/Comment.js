import { View, Text, StyleSheet, useWindowDimensions } from "react-native";

import Colors from "../../../src/constants/Colors";

function Comment({ text, creatorName, createdAt, userId }) {
  const { width } = useWindowDimensions();
  const containerWidth = width < 411 ? 325 : 346;

  const formatDate = (eventDate) => {
    const event = new Date(eventDate);
    const now = new Date();

    const diffInSeconds = Math.floor((now - event) / 1000);

    const thresholds = [
      { limit: 60, text: "Just now" }, // < 1 minute
      { limit: 3600, unit: "minute", divisor: 60 }, // < 1 hour
      { limit: 86400, unit: "hour", divisor: 3600 }, // < 1 day
      { limit: 172800, text: "Yesterday", condition: () => diffInDays === 1 }, // exactly 1 day ago
      { limit: 1209600, unit: "day", divisor: 86400 }, // < 2 weeks
      { limit: 4838400, unit: "week", divisor: 604800 }, // < 8 weeks
      { limit: 31536000, unit: "month", divisor: 2592000 }, // < 1 year
      { limit: Infinity, unit: "year", divisor: 31536000 }, // ≥ 1 year
    ];

    for (const t of thresholds) {
      if (diffInSeconds < t.limit) {
        if (t.text) return t.text;
        const value = Math.floor(diffInSeconds / t.divisor);
        return `${value} ${t.unit}${value !== 1 ? "s" : ""} ago`;
      }
    }

    return "Some time ago"; // fallback
  };

  return (
    <View style={[styles.container, { width: containerWidth }]}>
      <View style={styles.commentInfo}>
        <View style={styles.userContainer}>
          <View style={styles.placeholderPFP} />
          <Text style={styles.userName}>{creatorName}</Text>
          {/*should add a character limit here at some point */}
        </View>
        <Text style={styles.commentDate}>{formatDate(createdAt)}</Text>
      </View>
      <Text style={styles.commentText}>{text}</Text>
    </View>
  );
}

export default Comment;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    marginVertical: 8,
    // width: 346,
  },
  commentInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  placeholderPFP: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "pink",
    justifyContent: "flex-start",
  },
  userName: {
    marginLeft: 5,
    fontSize: 16,
    color: Colors.gray.light,
    width: 180,
  },
  commentDate: {
    fontSize: 12,
    color: Colors.gray.dark,
  },
  commentText: {
    marginTop: 5,
    color: Colors.gray.muted,
    fontSize: 14,
    lineHeight: 20,
    padding: 0,
  },
});
