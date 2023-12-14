import firestore from "@react-native-firebase/firestore";

import { GROUPS, MESSAGES, getCurrentTimestamp } from "./collections";
import useLocalStorageData from "../hooks/useUserAuth";
import { get } from "lodash";
import sendNotifications from "./sendNotifications";

export const listenToMessages: any = (threadId: any) => {
  try {
    return firestore()
      .collection(GROUPS)
      .doc(threadId)
      .collection(MESSAGES)
      .orderBy("createdAt", "desc");
  } catch (error) {
    console.log(`Error listening to messages for thread ${threadId}: `, error);
  }
};
const createLatestMessage = async (threadId: any, text: any, image = "") => {
  try {
    return await firestore()
      .collection(GROUPS)
      .doc(threadId)
      .set(
        {
          latestMessage: {
            text,
            createdAt: new Date(),
          },
        },
        { merge: true },
      );
  } catch (error) {
    console.log("Error creating latest message: ", error);
  }
};

const createUserMessage = async (
  threadId: any,
  text: any,
  user: any,
  userNickname: any,
  image: any = "",
) => {
  try {
    return await firestore()
      .collection(GROUPS)
      .doc(threadId)
      .collection(MESSAGES)
      .add({
        text,
        createdAt: getCurrentTimestamp(),
        user: {
          _id: user.id,
          name: user?.givenName,
          avatar: user.photo,
          bornyearValue: "67",
          sex: "M",
        },
        image,
      });
  } catch (error) {
    console.log("Error creating user message: ", error);
  }
};

export const createMessage = async (
  threadId: any,
  text: any,
  userNickname: any,
  image = "",
  user: any,
) => {
  await createLatestMessage(threadId, text, image);
  const resp = await createUserMessage(
    threadId,
    text,
    user,
    userNickname,
    image,
  );
  return resp;
};

// export const listenToMandatoryThreads = async ({ uid }: { uid: string }) => {
//   if (!uid) {
//     return;
//   }
//   try {
//     const querySnapshot = await firestore()
//       .collection(GROUPS)
//       .where("roomType", "!=", "자유")
//       .where("enteredUser", "array-contains", uid)
//       .orderBy("roomType")
//       .orderBy("latestMessage.createdAt", "desc");

//     if (!querySnapshot) {
//       return;
//     }
//     return querySnapshot;
//   } catch (error) {
//     console.log("Error listening to threads: ", error);
//   }
// };

export const listenToFreeThreads = async () => {
  try {
    const querySnapshot = await firestore()
      .collection(GROUPS)
      .where("roomType", "==", "Group")
      .orderBy("latestMessage.createdAt", "desc");

    if (!querySnapshot) {
      return;
    }
    return querySnapshot;
  } catch (error) {
    console.log("Error listening to threads: ", error);
  }
};
