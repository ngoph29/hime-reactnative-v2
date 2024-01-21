import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { CameraScreen, Camera } from "react-native-camera-kit";
import { upload, ocr } from "../api/services";
import {
  ViroARScene,
  ViroText,
  ViroConstants,
  ViroARSceneNavigator,
} from '@viro-community/react-viro';


function CCameraScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [camera, setCamera] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const status = await Camera.checkDeviceCameraAuthorizationStatus();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    console.log("gonna taking a picture with camera", camera);
    setIsLoading(true);
    const photo = await camera.camera.capture();
    setPhoto(photo.uri);
    setShowCamera(false);
    setShowReview(true);
    setIsLoading(false);
  };

  const retakePicture = () => {
    setPhoto(null);
    setShowCamera(true);
    setShowReview(false);
  };

  const aiDetection = async () => {
    setIsLoading(true);
    // Send the photo to the server here
    const response = await upload(photo);
    navigation.navigate("Library", { data: response });
    setIsLoading(false);
    setShowReview(false);
  };

  const ocrDetection = async () => {
    setIsLoading(true);
    // Send the photo to the server here
    const response = await ocr(photo);
    navigation.navigate("Library", { data: response });
    setIsLoading(false);
    setShowReview(false);
  };

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {!photo && (
        <TouchableOpacity style={styles.button} onPress={() => setShowCamera(true)}>
          <Text style={styles.text}>Chụp</Text>
        </TouchableOpacity>
      )}
      {photo && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo }} style={styles.preview} />
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button} onPress={retakePicture}>
              <Text style={styles.text}>Chụp lại</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setShowReview(true)}>
              <Text style={styles.text}>Chụp</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <Modal visible={showCamera} animationType="slide">
        <CameraScreen
          hideControls={false}
          style={styles.camera}
          ref={(ref) => {
            setCamera(ref);
          }}
        ></CameraScreen>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => takePicture()}>
            <Text style={styles.text}>Chụp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setShowCamera(false)}>
            <Text style={styles.text}>Thoát</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal visible={showReview} animationType="slide">
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo }} style={styles.preview} />
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.button} onPress={retakePicture}>
                <Text style={styles.text}>Chụp lại</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={aiDetection}>
                <Text style={styles.text}>Nhận diện</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={ocrDetection}>
                <Text style={styles.text}>OCR</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

export default CCameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "coral",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  text: {
    color: "white",
    fontSize: 18,
  },
  previewContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  preview: {
    width: "100%",
    height: "80%",
    resizeMode: "contain",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    padding: 30,
  },
});
