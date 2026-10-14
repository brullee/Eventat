import { View, StyleSheet } from "react-native";

import Colors from "../../src/constants/Colors";

function DetailCardSeparator() {
  return (
    <View
      style={{
        borderBottomColor: Colors.gray.darkest,
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginHorizontal: 20,
      }}
    />
  );
}

export default DetailCardSeparator;
