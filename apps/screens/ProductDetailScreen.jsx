import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Linking from "expo-linking";
import { Entypo } from "@expo/vector-icons";
import * as Sharing from "expo-sharing";
import { useUser } from "@clerk/clerk-expo";
import {
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import axios from "axios";

export default function ProductDetailScreen() {
  const { params } = useRoute();
  const { user } = useUser();
  const navigation = useNavigation();
  /*  const [mapRegion, setMapRegion] = useState({
    latitude: 44.968046,
    longitude: -94.420307,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }); */
  const [location, setLocation] = useState(null);
  const [productDetail, setProductDetail] = useState([]);

  useEffect(() => {
    if (params && params.itemDetail) {
      setProductDetail(params.itemDetail);
      getCoordinatesFromAddress(params.itemDetail.address);
    }
  }, [params]);
  useEffect(() => {
    if (productDetail) {
      shareButton();
    }
  }, [productDetail]);
  /* geo coding converting address into coordinates */
  const getCoordinatesFromAddress = async (address) => {
    const apiKey = "AIzaSyD9VrMSGHeQl53p31IF8QVIA9t6Vy-Hhqw";
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      const { results } = response.data;
      if (results.length > 0) {
        const { lat, lng } = results[0].geometry.location;
        setLocation({ latitude: lat, longitude: lng });
      } else {
        Alert.alert("Error", "No results found");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };
  const shareButton = () => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => shareProduct()}>
          <Entypo
            name="share"
            size={24}
            color="white"
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
      ),
    });
  };
  const shareProduct = async () => {
    try {
      const result = await Share.share({
        message: `${productDetail?.title}\n${productDetail?.desc}\n${productDetail?.image}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  const sendEmailMessage = () => {
    const subject = `Information required about ${productDetail.title}`;
    const body = `Hi ${productDetail.userName} I want to buy ${productDetail.title} so  fill me in on the process to be followed`;
    Linking.openURL(
      `mailto:${productDetail.userEmail}?subject=${subject}&body=${body}`
    );
  };
  const deletePost = () => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to proceed?",
      [
        {
          text: "No",
          onPress: () => console.log("No Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => deleteFromFirestore(),
        },
      ],
      { cancelable: false }
    );
  };
  const deleteFromFirestore = async () => {
    const q = query(
      collection(db, "posts"),
      where("title", "==", productDetail.title)
    );
    const snapShot = await getDocs(q);
    snapShot.forEach((doc) => {
      deleteDoc(doc.ref).then((response) => {
        navigation.goBack();
      });
    });
  };
  return (
    <ScrollView className="flex-1 bg-white ">
      <Image
        source={{ uri: productDetail.image }}
        className="w-full h-64  object-cover"
      />
      <View
        style={{ elevation: 5 }}
        className="bg-white mt-3 mx-2 justify-start  rounded-lg flex-1 p-2 shadow-lg border-[1px] border-gray-100"
      >
        <View className="flex-row items-center justify-between">
          <Text className="mt-1 text-[20px] text-gray-700 shadow-lg ">
            {productDetail?.title}
          </Text>
          <Text
            style={{ elevation: 10 }}
            className="mt-1 text-[16px] text-white rounded-full bg-red-500 text-center p-2 "
          >
            {productDetail?.category}
          </Text>
        </View>

        <Text className="mt-1 text-[17px] text-gray-500  ">
          {productDetail?.desc}
        </Text>
        <View className="flex-row items-center gap-3 mt-1">
          <Text className="text-[17px] text-gray-800">Price:</Text>
          <Text className="mt-1 text-[17px] text-green-600   ">
            ${productDetail?.price}
          </Text>
        </View>
        {/* User Info */}
        <View className="flex-row items-center gap-3 mt-2">
          <Image
            source={{ uri: productDetail.userImage }}
            className="w-12 h-12 rounded-full  shadow-lg "
          />
          <View>
            <Text className="font-bold text-[18px] text-gray-800">
              {productDetail.userName}
            </Text>
            <Text className="text-gray-500 text-sm">
              {productDetail.userEmail}
            </Text>
          </View>
        </View>
        {/* Map */}
        <View
          style={{
            flex: 1,
            marginTop: 20,
            borderRadius: 16, // Adjust the value as needed
            overflow: "hidden",
          }}
        >
          {location ? (
            <MapView
              style={{
                width: Dimensions.get("screen").width * 0.89,
                height: Dimensions.get("screen").height * 0.23,
              }}
              provider={PROVIDER_GOOGLE}
              showsUserLocation={true}
              region={{
                ...location,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker coordinate={location} />
            </MapView>
          ) : null}
        </View>
        {/* Send Message */}
        {user?.primaryEmailAddress.emailAddress === productDetail.userEmail ? (
          <TouchableOpacity
            onPress={() => deletePost()}
            style={{ elevation: 5 }}
            className="mt-4 items-center rounded-full bg-red-500 p-4 justify-center"
          >
            <Text className="text-white text-center">Delete Post</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => sendEmailMessage()}
            style={{ elevation: 5 }}
            className="mt-7 items-center rounded-full bg-blue-500 p-4 justify-center"
          >
            <Text className="text-white text-center">Send Message</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
