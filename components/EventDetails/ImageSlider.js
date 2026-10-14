import React, { useState } from "react";
import {
  View,
  Image,
  Pressable,
  StyleSheet,
  Dimensions,
  useWindowDimensions,
  Platform,
} from "react-native";

import Carousel, { Pagination } from "react-native-snap-carousel";

import CustomShadow from "../CustomShadow";
import Colors from "../../src/constants/Colors";
import ImageViewerModal from "./ImageViewerModal";

const { width } = Dimensions.get("window");

function ImageSlider({ images }) {
  const { width: Width } = useWindowDimensions();
  const imageWidth = Width < 411 ? 360 : 380;
  const imageHeight = Width < 411 ? 260 : 280;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [shouldAnimatePagination, setShouldAnimatePagination] = useState(true);

  const renderItem = ({ item, index }) => (
    <View style={styles.imageSliderContainer}>
      <CustomShadow>
        <View style={styles.slide}>
          <Pressable
            onPress={() => {
              setIsModalVisible(true);
              setActiveIndex(index);
            }}
          >
            <Image
              source={{ uri: item }}
              style={[styles.image, { width: imageWidth, height: imageHeight }]}
            />
          </Pressable>
        </View>
      </CustomShadow>
    </View>
  );

  const handleModalClose = (currentIndex) => {
    setShouldAnimatePagination(false);
    setActiveIndex(currentIndex);
    setIsModalVisible(false);
    setTimeout(() => setShouldAnimatePagination(true), 0.2);
  };
  return (
    <View>
      {images?.length > 0 && (
        <View
          style={[styles.container, { height: images.length > 1 ? 320 : 310 }]}
        >
          <Carousel
            data={images}
            renderItem={renderItem}
            sliderWidth={width}
            itemWidth={380}
            onBeforeSnapToItem={(index) => setActiveIndex(index)}
            firstItem={activeIndex}
          />
          {images?.length > 1 && (
            <View style={styles.paginationContainer}>
              <Pagination
                dotsLength={images.length}
                activeDotIndex={activeIndex}
                dotStyle={styles.dotStyle}
                inactiveDotStyle={styles.inactiveDotStyle}
                inactiveDotScale={0.6}
                animatedDuration={shouldAnimatePagination ? 200 : 0}
                animatedTension={shouldAnimatePagination ? null : 0}
              />
            </View>
          )}

          <ImageViewerModal
            visible={isModalVisible}
            images={images.map((url) => ({ url }))}
            onClose={handleModalClose}
            initialIndex={activeIndex}
          />
        </View>
      )}
    </View>
  );
}

export default ImageSlider;

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderRadius: 8,
  },
  slide: {
    overflow: "hidden",
    borderRadius: 8,
  },
  imageSliderContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    resizeMode: "cover",
    height: 280,
    // width: 380,
  },
  paginationContainer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? -10 : -20,
    alignSelf: "center",
  },
  dotStyle: {
    backgroundColor: Colors.accent.secondary,
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 2,
  },
  inactiveDotStyle: {
    backgroundColor: Colors.gray.dark,
  },
});
