import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";

export function useGame() {
  const startGame = (code) =>
    httpsCallable(functions, "startGame")({ code });

  const submitDrawing = (code, dataURL) =>
    httpsCallable(functions, "submitDrawing")({ code, dataURL });

  const submitVotes = (code, ratings) =>
    httpsCallable(functions, "submitVotes")({ code, ratings });

  return { startGame, submitDrawing, submitVotes };
}
