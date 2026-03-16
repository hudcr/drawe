import { createContext, useContext, useEffect, useState } from "react";
import { doc, collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const GameContext = createContext(null);

export function GameProvider({ roomCode, children }) {
  const [room, setRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [drawings, setDrawings] = useState([]);

  useEffect(() => {
    if (!roomCode) return;

    const unsubRoom = onSnapshot(doc(db, "rooms", roomCode), (snap) =>
      setRoom(snap.exists() ? snap.data() : null)
    );
    const unsubPlayers = onSnapshot(
      collection(db, "rooms", roomCode, "players"),
      (snap) => setPlayers(snap.docs.map((d) => d.data()))
    );
    const unsubDrawings = onSnapshot(
      collection(db, "rooms", roomCode, "drawings"),
      (snap) => setDrawings(snap.docs.map((d) => d.data()))
    );

    return () => { unsubRoom(); unsubPlayers(); unsubDrawings(); };
  }, [roomCode]);

  return (
    <GameContext.Provider value={{ room, players, drawings }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  return useContext(GameContext);
}
