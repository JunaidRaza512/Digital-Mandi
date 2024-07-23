import {
  Alert,
  Button,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { Formik } from "formik";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { Image, Modal } from "react-native";
import Toast from "react-native-toast-message";
import { imgToBlob } from "../lib/BlobMaker";
import { storage } from "../../firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ActivityIndicator } from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import { useUser } from "@clerk/clerk-expo";
import moment from "moment";

export default function AddPost() {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [categoryList, setCategoryList] = useState([]);

  const { user } = useUser();
  // fetching categories using below function in useEffect
  /* const defaultCategories = [
    { id: "1", name: "Furniture" },
    { id: "2", name: "Electronics" },
    { id: "3", name: "Clothing" },
    { id: "4", name: "Properties" },
    { id: "5", name: "Cosmetics" },
    { id: "6", name: "Home Appliances" },
  ];
 */
  // Combining default and fetched categories
  /* useEffect(() => {
    setCategoryList((prevCategoryList) => [
      ...prevCategoryList,
      ...defaultCategories,
    ]);
  }, []); */

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoryList([]);
      try {
        const querySnapShot = await getDocs(collection(db, "Category"));
        const newCategories = querySnapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCategoryList((prevCategoryList) => [
          ...prevCategoryList,
          ...newCategories,
        ]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);
  //Request Permission
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    }

    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraStatus.status !== "granted") {
      alert("Sorry, we need camera permissions to make this work!");
    }
  };
  //Image Picker
  const pickImage = async (source, setFieldValue) => {
    await requestPermission();
    let result;

    if (source === "camera") {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    }

    if (!result?.canceled) {
      // setImage(result.assets[0].uri);
      // setModalVisible(false);  const uri = result.assets[0].uri;
      const uri = result.assets[0].uri;

      try {
        // Resize the image
        const resizedImage = await ImageManipulator.manipulateAsync(
          uri,
          [{ resize: { width: 800, height: 600 } }],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );

        // Check the file size
        const fileInfo = await fetch(resizedImage.uri);
        const fileBlob = await fileInfo.blob();
        const fileSize = fileBlob.size;

        // If the image is still too large, resize it further
        if (fileSize > 100 * 1024) {
          const furtherResizedImage = await ImageManipulator.manipulateAsync(
            resizedImage.uri,
            [{ resize: { width: 400, height: 300 } }],
            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
          );
          setImage(furtherResizedImage.uri);
          setFieldValue("image", uri);
          setModalVisible(false);
        } else {
          setImage(resizedImage.uri);
          setFieldValue("image", uri);
          setModalVisible(false);
        }
      } catch (error) {
        console.error("Error resizing image:", error);
        setModalVisible(false);
      }
    }
  };
  const onSubmit = async (values, { resetForm }) => {
    const formattedDate = moment().format("YYYY-MM-DD HH:mm:ss");
    //values.image = image;
    const errors = {};

    const requiredFields = [
      { field: "address", message: "Address must be present there" },
      { field: "price", message: "Price must be present there" },
      { field: "desc", message: "Description must be present there" },
      { field: "title", message: "Title must be present there" },
      { field: "image", message: "Image must be present there" },
    ];

    requiredFields.forEach(({ field, message }) => {
      if (!values[field]) {
        Toast.show(
          {
            type: "error",
            text1: "Error",
            text2: message,
            position: "bottom",
          },
          2000
        );
        errors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required`;
      }
    });

    if (Object.keys(errors).length > 0) {
      // If there are errors, do not proceed with form submission
      console.log(errors);

      return errors;
    }
    setLoading(true);
    try {
      const blob = await imgToBlob(image);
      const storageRef = ref(storage, "communityPost/" + Date.now() + ".jpg");
      // 'file' comes from the Blob or File API
      const unsubscribe = uploadBytes(storageRef, blob);

      // Wait for upload to complete
      await unsubscribe;

      const downloadURL = await getDownloadURL(storageRef);
      values.userName = user.fullName;
      values.userEmail = user.primaryEmailAddress.emailAddress;
      values.userImage = user.imageUrl;

      // Return or use the download URL as needed
      //return downloadURL;
      const imageData = {
        ...values,
        image: downloadURL,
        createdAt: formattedDate, // Replace the 'image' field with the download URL
      };
      const docRef = await addDoc(collection(db, "posts"), imageData);
      setLoading(false);
      resetForm();
      setImage("");
      Toast.show(
        {
          type: "success",
          text1: "Success",
          text2: "Your Post is Uploaded Successfully",
          position: "bottom",
        },
        500
      );
    } catch (error) {
      Toast.show(
        {
          type: "error",
          text1: "Error",
          text2: "Your Image Failed to Upload",
          position: "bottom",
        },
        2000
      );
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView className="flex-1">
      <ScrollView className="p-9 bg-gray flex-1">
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text className="text-[24px] mt-1 text-red-500 font-bold">
            Create a New Listing
          </Text>
        </View>
        {/*  <Text className="text-[15px] text-gray-500 mb-1">
          Kick start your new journey on this amazing platform
        </Text> */}
        <Formik
          initialValues={{
            title: "",
            desc: "",
            category: "Furniture",
            address: "",
            price: "",
            image: "",
            userName: "",
            userEmail: "",
            userImage: "",
          }}
          onSubmit={onSubmit}
          // validate={onValidate}
        >
          {({ handleChange, handleSubmit, values, setFieldValue }) => (
            <View>
              <TouchableOpacity
                style={{ marginBottom: 4, marginTop: 5 }}
                onPress={() => setModalVisible(true)}
              >
                {image ? (
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: image }}
                      style={{
                        width: 100,
                        height: 100,
                        alignSelf: "center",
                        borderRadius: 50,
                        borderWidth: 1,
                        resizeMode: "cover",
                      }}
                    />
                  </View>
                ) : (
                  <View style={styles.imageContainer}>
                    <Image
                      source={require("../../assets/images/upload.png")}
                      style={{
                        width: 100,
                        height: 100,
                        alignSelf: "center",
                      }}
                    />
                  </View>
                )}
              </TouchableOpacity>
              <View
                style={{
                  elevation: 10,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.5,
                  shadowRadius: 0,
                  marginTop: 1,
                }}
                className="bg-white  p-2 border-gray-50  rounded-lg"
              >
                <TextInput
                  className="border-gray-400"
                  style={styles.input}
                  placeholder=" Enter Title"
                  onChangeText={handleChange("title")}
                  value={values.title}
                />
                <TextInput
                  className="border-gray-400"
                  style={styles.input}
                  placeholder=" Enter Description"
                  onChangeText={handleChange("desc")}
                  numberOfLines={5}
                  multiline
                  value={values.desc}
                />
                <TextInput
                  className="border-gray-400"
                  style={styles.input}
                  placeholder=" Enter Price"
                  onChangeText={handleChange("price")}
                  keyboardType="number-pad"
                  value={values.price}
                />
                <TextInput
                  className="border-gray-400"
                  style={styles.input}
                  placeholder=" Enter Complete Address"
                  onChangeText={handleChange("address")}
                  value={values.address}
                />

                {/* category List Dropdown */}
                <View className="border border-gray-300 rounded-lg mt-3">
                  <Picker
                    selectedValue={values.category}
                    onValueChange={(itemValue) =>
                      setFieldValue("category", itemValue)
                    }
                  >
                    {categoryList &&
                      categoryList.map((item, index) => (
                        <Picker.Item
                          key={index}
                          label={item.name}
                          value={item.name}
                        />
                      ))}
                  </Picker>
                </View>
              </View>
              <TouchableOpacity
                style={{ backgroundColor: loading ? "#ccc" : "blue" }}
                onPress={handleSubmit}
                className="p-3.5 bg-blue-500 rounded-full mt-3"
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                  <Text className="text-white text-center font text-[16px] ">
                    Submit
                  </Text>
                )}
              </TouchableOpacity>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Select Image Source</Text>
                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={() => pickImage("camera", setFieldValue)}
                    >
                      <Text style={styles.modalButtonText}>Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={() => pickImage("gallery", setFieldValue)}
                    >
                      <Text style={styles.modalButtonText}>Gallery</Text>
                    </TouchableOpacity>
                    <Pressable
                      style={[styles.modalButton, styles.modalCancelButton]}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.modalButtonText}>Cancel</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>
            </View>
          )}
        </Formik>
        <Toast />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 0.5,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 6,
    fontSize: 15,
    textAlignVertical: "top",
    marginTop: 10,
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
  modalButton: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: "100%",
    marginVertical: 5,
  },
  modalButtonText: {
    color: "white",
    textAlign: "center",
  },
  modalCancelButton: {
    backgroundColor: "red",
  },
  imageContainer: {
    alignSelf: "center",
    width: 105,
    height: 105,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#fff", // Border color
    elevation: 5, // Elevate the container
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    backgroundColor: "#fff",
    // Background color for the container to hide parent background
  },
});
