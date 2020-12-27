import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as Sharing from "expo-sharing";
import uploadToAnonymousFiles from "anonymous-files"; //this is a web service that allows to upload or files to the web

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync(); //to ask the user for permission to access to the photos
    if (permissionResult.granted === false) {
      //if the user denies the permission
      alert("Permission to access camera is required");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync(); // I save the image that was picked in a const

    if (pickerResult.cancelled === true) {
      //if the user didnt pick any image
      return;
    }

    if (Platform.OS === "web") {
      //if the app is being open in the web we have to set up the share option in a different way

      const RemoteUri = await uploadToAnonymousFiles(pickerResult.uri); //I upload the image to the web service anonymous files

      setSelectedImage({ localUri: pickerResult.uri, RemoteUri }); //I update the state by giving it another property that is going to contain the remote url where i upload my image
    } else {
      setSelectedImage({ localUri: pickerResult.uri }); //I save the image that the user pick in my state selectedImage
    }
  };

  const openShareDialog = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      //if the device doesnt support the sharing option(if we are using the app in the web)
      alert(
        `The image is available for sharing at: ${selectedImage.RemoteUri}`
      );
      return;
    }

    await Sharing.shareAsync(selectedImage.localUri); //to share the image that we have in our state(local uri is the property where the image have the url)
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pick an Image!!</Text>
      <TouchableOpacity onPress={openImagePickerAsync}>
        <Image
          source={{
            uri:
              selectedImage !== null
                ? selectedImage.localUri
                : "https://picsum.photos/200/200",
          }}
          style={styles.image}
        />
      </TouchableOpacity>
      {selectedImage ? ( //we checked if the state selectedImage is not null(meaning that the user picked an image), if this is the case then we can show the option to share the image
        <TouchableOpacity onPress={openShareDialog} style={styles.button}>
          <Text style={styles.buttonText}>Share this Image</Text>
        </TouchableOpacity>
      ) : (
        <View />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#292929",
  },
  title: { fontSize: 30, color: "#fff" },
  image: { height: 200, width: 200, borderRadius: 100, resizeMode: "contain" },
  button: { backgroundColor: "deepskyblue", padding: 7, marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 20 },
});

export default App;
