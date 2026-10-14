import React, { useState } from "react";
import {
  Modal,
  Text,
  View,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import { SafeAreaView } from "react-native-safe-area-context";

import Colors from "../../src/constants/Colors";
import Ionicons from "react-native-vector-icons/Ionicons";

const Indicators = ({ currentIndex, allSize, onClose }) => {
  return (
    <SafeAreaView edges={["top"]} style={styles.indicatorContainer}>
      <View style={styles.indicatorContainer}>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={25} color={Colors.gray.white} />
        </Pressable>
        {allSize > 1 && (
          <Text style={styles.indicatorText}>
            {currentIndex} / {allSize}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const ImageViewerModal = ({ visible, images, onClose, initialIndex }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handleSwipeDown = () => {
    onClose(currentIndex);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      //   animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <ImageViewer
          imageUrls={images}
          index={initialIndex}
          onChange={(index) => setCurrentIndex(index)}
          onSwipeDown={handleSwipeDown}
          enableSwipeDown={true}
          backgroundColor={Colors.background.elevated}
          renderIndicator={(currentIndex, allSize) => (
            // <View style={styles.indicatorContainer}>
            //   <Pressable style={styles.closeButton} onPress={onClose}>
            //     <Ionicons name="close" size={25} color={Colors.gray.white} />
            //   </Pressable>
            //   {allSize > 1 && (
            //     <Text style={styles.indicatorText}>
            //       {currentIndex} / {allSize}
            //     </Text>
            //   )}
            // </View>
            <Indicators
              currentIndex={currentIndex}
              allSize={allSize}
              onClose={onClose}
            />
          )}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  indicatorContainer: {
    flexDirection: "row",
    position: "absolute",
    top: Platform.OS === "ios" ? 30 : 10,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  indicatorText: {
    color: Colors.gray.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    left: 24,
  },
});

export default ImageViewerModal;
