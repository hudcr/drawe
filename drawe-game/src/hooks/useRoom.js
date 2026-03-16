import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";

export function useRoom() {
  const createRoom = async (settings) => {
    const result = await httpsCallable(functions, "createRoom")({ settings });
    return result.data.code;
  };

  const joinRoom = async (code) => {
    const upper = code.toUpperCase();
    await httpsCallable(functions, "joinRoom")({ code: upper });
  };

  return { createRoom, joinRoom };
}
