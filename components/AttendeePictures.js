import { View, Image, Text, StyleSheet } from "react-native";
import Colors from "../src/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

// Helper to generate a random picsum URL
const getRandomPic = () => {
  const w = 90 + Math.floor(Math.random() * 20); // 90-109
  const h = 90 + Math.floor(Math.random() * 20); // 90-109

  return `https://picsum.photos/${w}/${h}?random=${Math.floor(
    Math.random() * 10000
  )}`;
};

function AttendeePictures({
  attendees = 0,
  enableAttendeeCount = false,
  pageType = null,
  joined_users,
}) {
  const imageWidth = 34;
  const overlap = 12;


  let showImages = attendees;
  let showCircle = false;

  if (attendees > 4) {
    showImages = 3;
    showCircle = true;
  } else if (attendees === 0) {
    showImages = 0;
    showCircle = true;
  } else {
    showImages = attendees;
    showCircle = false;
  }

  const totalWidth =
    showImages === 1
      ? imageWidth
      : imageWidth +
        (showImages - 1) * (imageWidth - overlap) +
        (showCircle ? imageWidth - overlap : 0);

  // Generate random images for display
  const images = Array.from({ length: showImages }, getRandomPic);

  return (
    <View
      style={[
        styles.container,
        {
          marginVertical: enableAttendeeCount ? 6 : 0,
          width: enableAttendeeCount ? 105 : null,
        },
      ]}
    >
      <View
        style={[
          styles.attendeeImageContainer,
          { width: totalWidth, marginBottom: enableAttendeeCount ? 4 : 0 },
        ]}
      >
        {images.map((img, index) => (
          <Image
            key={index}
            source={{ uri: img }}
            style={[
              styles.attendeeImage,
              { left: index * (imageWidth - overlap), zIndex: index - 3 },
            ]}
          />
        ))}

        {showCircle && (
          <View
            style={[
              styles.circle,
              { left: showImages * (imageWidth - overlap), zIndex: 0 },
            ]}
          >
            {attendees > 0 ? (
              <Text
                style={[
                  styles.circlePlus,
                  {
                    color:
                      pageType === "History"
                        ? Colors.gray.medium
                        : Colors.accent.secondary,
                  },
                ]}
              >
                +
              </Text>
            ) : (
              <Ionicons
                size={23}
                name="sad-outline"
                style={{
                  color:
                    pageType === "History"
                      ? Colors.gray.medium
                      : Colors.accent.secondary,
                }}
              />
            )}
          </View>
        )}
      </View>
      {enableAttendeeCount && (
        <Text style={styles.attendeeCount}>{attendees} att.</Text>
      )}
    </View>
  );
}

export default AttendeePictures;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    marginHorizontal: 4,
  },
  attendeeImageContainer: {
    height: 34,
    position: "relative",
    alignSelf: "center",
  },
  attendeeImage: {
    width: 34,
    height: 34,
    borderRadius: 17,
    position: "absolute",
  },
  circle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.background.elevated,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  circlePlus: {
    fontSize: 16,
    fontWeight: 600,
  },
  attendeeCount: {
    fontSize: 15,
    color: Colors.gray.light,
  },
});
