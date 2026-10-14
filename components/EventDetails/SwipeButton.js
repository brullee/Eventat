import React, { useRef } from "react";
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../src/constants/Colors";
import { min } from "moment";

const SwipeButton = ({ onSwipeComplete }) => {
  const slideBarWidth = useRef(new Animated.Value(100)).current;
  const textOpacity = useRef(new Animated.Value(1)).current;
  const { width: screenWidth } = useWindowDimensions();

  // Width of the full swipe container (responsive)
  const containerWidth = Math.min(screenWidth * 0.9, 400);
  const sliderHandleWidth = 46;
  const sliderHandleMarginLeft = 2;
  const minSlideBarWidth = sliderHandleWidth + sliderHandleMarginLeft * 2;

  const minWidthPercent = (minSlideBarWidth / containerWidth) * 100;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,

    onPanResponderGrant: () => {
      Animated.timing(textOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    },

    onPanResponderMove: (_, { dx }) => {
      const progress = Math.max(0, Math.min(dx / containerWidth, 1));
      const width = 100 - progress * (100 - minWidthPercent); // animate from 100% to 13%
      slideBarWidth.setValue(width);
    },

    onPanResponderRelease: (_, { dx }) => {
      const releaseThreshold = containerWidth * 0.42;
      if (dx > releaseThreshold) {
        Animated.timing(slideBarWidth, {
          toValue: minWidthPercent,
          duration: 200,
          useNativeDriver: false,
        }).start(() => onSwipeComplete?.());
      } else {
        Animated.parallel([
          Animated.spring(slideBarWidth, {
            toValue: 100,
            useNativeDriver: false,
          }),
          Animated.timing(textOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }
    },
  });

  return (
    <View style={[styles.container, { width: containerWidth }]}>
      <Animated.View
        style={[
          styles.slideBar,
          {
            width: slideBarWidth.interpolate({
              inputRange: [13, 100],
              outputRange: [containerWidth * 0.13, containerWidth * 1.0],
            }),
          },
        ]}
      >
        <Animated.Text style={[styles.text, { opacity: textOpacity }]}>
          Swipe to Attend
        </Animated.Text>
        <View {...panResponder.panHandlers} style={styles.sliderTouchArea}>
          <View style={styles.slider}>
            <Ionicons
              name="arrow-forward-outline"
              color={Colors.gray.light}
              size={28}
            />
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    alignItems: "flex-end",
  },
  slideBar: {
    borderRadius: 25,
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: Colors.background.surface,
    height: 51,
  },
  text: {
    fontSize: 15,
    position: "absolute",
    alignSelf: "center",
    color: Colors.gray.muted,
  },
  slider: {
    position: "absolute",
    marginLeft: 2,
    width: 46,
    height: 46,
    backgroundColor: Colors.accent.secondary,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
  },
  sliderTouchArea: {
    // position: "absolute",
    // marginLeft: 0, // align to left edge
    width: 80, // bigger width for touch (can tweak)
    height: 80, // bigger height for touch area
    justifyContent: "center",
    // alignItems: "center",
    // Optional: backgroundColor: 'rgba(255,0,0,0.1)', // for debugging touch area
  },
});

export default SwipeButton;
