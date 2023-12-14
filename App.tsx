import React, { useEffect } from "react";

import { GoogleSignin } from "@react-native-community/google-signin";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeBaseProvider } from "native-base";
import { Alert, Text, View } from "react-native";
import { MenuProvider } from "react-native-popup-menu";
import Toast from "react-native-toast-message";
import ChatList from "./src/screens/Chats/ChatList";
import CreateChatForm from "./src/screens/Chats/CreateChatForm";
import Messages from "./src/screens/Chats/Messages";
import GoogleSignIns from "./src/screens/Common/GoogleSignIns";
import Home from "./src/screens/Common/Home";
import UserDetail from "./src/screens/Common/UserDetail";
import DetailsScreen from "./src/screens/Notes/Notes";
import NotesDetail from "./src/screens/Notes/NotesDetail";
import { PermissionsAndroid } from "react-native";
import messaging from "@react-native-firebase/messaging";
import useLocalStorageData from "./src/hooks/useUserAuth";
import firestore from "@react-native-firebase/firestore";
import { NOTIFICATIONS } from "./src/utils/collections";

GoogleSignin.configure({
  webClientId:
    "977614939982-nihf7qkmq6qksv5v5mduhmnnjrt2aq9f.apps.googleusercontent.com",
});
PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS, {
  title: "Utilities Notification Permission",
  message:
    "Utilities App needs access to your Notifications " +
    "so it can send notifications",
  buttonNeutral: "Ask Me Later",
  buttonNegative: "Cancel",
  buttonPositive: "OK",
});
const isPermissionGranted = PermissionsAndroid.RESULTS.GRANTED;
if (isPermissionGranted === "granted") {
} else {
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  Alert.alert("Please Grant the notification Permission");
}

function HomeScreen({ navigation }: any) {
  return <GoogleSignIns nav={navigation} />;
}

function App(): JSX.Element {
  const Stack = createNativeStackNavigator();
  const { getLocalData } = useLocalStorageData();

  const toastConfig = {
    success: ({ text1, props, ...rest }: any) => (
      <View
        style={{
          height: 40,
          backgroundColor: "#4CAF50",
          padding: 12,
          borderRadius: 12,
          justifyContent: "center",
          alignContent: "center",
        }}>
        <Text style={{ color: "white" }}>{text1}</Text>
      </View>
    ),
    error: ({ text1, props, ...rest }: any) => (
      <View style={{ height: 60, backgroundColor: "#F44336", padding: 16 }}>
        <Text style={{ color: "white" }}>{text1}</Text>
      </View>
    ),
  };

  useEffect(() => {
    let FCMToken = "";
    if (isPermissionGranted === "granted") {
      messaging()
        .getToken()
        .then(token => {
          FCMToken = token;
        });
    } else {
    }

    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage.notification,
          );
        }
      });
    const getUser = async () => {
      const user = await getLocalData();
      if (user) {
        const isFCMExist = await firestore()
          .collection(NOTIFICATIONS)
          .where("email", "==", user.email)
          .get();

        if (isFCMExist.empty) {
          await firestore().collection(NOTIFICATIONS).add({
            id: user.id,
            email: user.email,
            isNotificationEnabled: true,
            token: FCMToken,
            user: user.givenName,
            createdAt: new Date(),
          });
        }
      }
    };
    getUser();
  }, []);

  return (
    <>
      <NativeBaseProvider>
        <MenuProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Login"
              screenOptions={{
                animation: "flip",
              }}>
              <Stack.Screen
                name="Login"
                component={HomeScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Notes"
                options={{
                  headerBackVisible: true,
                  headerTitleAlign: "center",
                  headerTitleStyle: { color: "#444444" },
                  headerStyle: {
                    backgroundColor: "#fff",
                  },
                  title: "My Library",
                }}
                component={DetailsScreen}
              />
              <Stack.Screen
                name="Chats"
                options={{
                  headerBackVisible: true,
                  headerTitleAlign: "center",
                  headerTitleStyle: { color: "#444444" },
                  headerStyle: {
                    backgroundColor: "#fff",
                  },
                  title: "Chat List",
                }}
                component={ChatList}
              />
              <Stack.Screen
                name="CreateChat"
                options={{
                  headerBackVisible: true,
                  headerTitleAlign: "center",
                  headerTitleStyle: { color: "#444444" },
                  headerStyle: {
                    backgroundColor: "#fff",
                  },
                  title: "Chat Form",
                }}
                component={CreateChatForm}
              />
              <Stack.Screen
                name="Messages"
                options={{
                  headerTitleAlign: "center",
                  headerTitleStyle: {
                    fontWeight: "bold",
                    fontSize: 18,
                    color: "white",
                  },
                  headerStyle: {
                    backgroundColor: "#7e8de4",
                  },
                }}
                component={Messages}
              />
              <Stack.Screen
                name="Home"
                options={{
                  headerBackVisible: false,
                  headerTitleAlign: "left",
                  headerTitleStyle: { color: "#444444" },
                  headerStyle: {
                    backgroundColor: "#fff",
                  },
                  title: "My Utilities",
                }}
                component={Home}
              />
              <Stack.Screen
                name="NotesDetail"
                options={{
                  title: "Details",
                  headerTitleAlign: "center",
                  headerTitleStyle: { color: "#444444" },
                }}
                component={NotesDetail}
              />
              <Stack.Screen
                name="UserDetail"
                options={{
                  title: "User Detail",
                  headerTitleAlign: "center",
                  headerTitleStyle: { color: "#444444" },
                }}
                component={UserDetail}
              />
            </Stack.Navigator>
          </NavigationContainer>
          <Toast config={toastConfig} />
        </MenuProvider>
      </NativeBaseProvider>
    </>
  );
}

export default App;
