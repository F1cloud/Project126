import * as React from "react";
import { Button, Image, View, Platform } from "react-native";
//allows to choose image from computer
import * as ImagePicker from "expo-image-picker";
//access permisions for the camera
import * as Permissions from "expo-permissions";

export default class PickImage extends React.Component {
  state = {
    image: null,
  };

  render() {
    //automatically the value corresponding to the image will be stored in image - access the value
    let { image } = this.state;

    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button
          title="Pick an image from camera roll"
          onPress={this._pickImage}
        />
      </View>
    );
  }

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Platform.OS !== "web") {
      //await - when time is involved - wait for smtg
      //status - value automatically gets saved
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  uploadImage = async (uri) => {
    const data = new FormData();
    //splitting based on the slashes and the last length of the uri extension
    let filename = uri.split("/")[uri.split("/").length - 1]
    //type - trying to get extension
    let type = `image/${uri.split('.')[uri.split('.').length - 1]}`
    // uri - where you are uploading info
    const fileToUpload = {
      uri: uri,
      name: filename,
      type: type,
    };
    data.append("alphabet", fileToUpload);
    //fetch for this link
    fetch("https://f292a3137990.ngrok.io/predict-digit", {
      method: "POST",
      // data that you are uploading
      body: data,
      //heading for info uploaded
      headers: {
        "content-type": "multipart/form-data",
      },
    })
    //when everyhing goes fine, the response will be stored
      .then((response) => response.json())
      // once success display a message and then display what the result was
      .then((result) => {
        console.log("Success:", result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
// pick an image from your computer
    _pickImage = async () => {
      //when everything is going well, computer will catch errors
      try {
        let result = await ImagePicker.launchImageLibraryAsync({
          //4 parameters: image, media type, allows you to edit or not, the ratio, quality
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        if (!result.cancelled) {
          //changing the state's value - result.data
          this.setState({ image: result.data });
          console.log(result.uri)
          this.uploadImage(result.uri);
        }
        // catch - when there's an error
        // E - error
      } catch (E) {
        console.log(E);
      }
    };
}
