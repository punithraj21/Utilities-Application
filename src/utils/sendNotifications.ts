import functions from "@react-native-firebase/functions";

const sendNotifications = async () => {
  try {
    const result = await functions().httpsCallable("sendNotifications")();
    console.log(result.data);
  } catch (error) {
    console.error(error);
  }
};

export default sendNotifications;
