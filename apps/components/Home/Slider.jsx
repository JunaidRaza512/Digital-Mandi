import { FlatList, Image, StyleSheet, Text, View } from "react-native";

export default function Slider({ sliderList }) {
  return (
    <View className="mt-3">
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={sliderList}
        renderItem={({ item, index }) => {
          return (
            <View
              key={index}
              className="w-[320px] h-[180px] justify-center items-center"
            >
              <Image
                source={{
                  uri: item?.image,
                }}
                className="h-[180px] w-[300px] mr-3 rounded-lg object-contain "
                onError={(e) =>
                  console.log("Image load error:", e.nativeEvent.error)
                }
              />
            </View>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
