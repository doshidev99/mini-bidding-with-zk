export declare global {
  interface Window {
    isInitialized: () => boolean;
    initBidding: () => void;
    createSession: (
      username: string,
      roomID: number,
      privateCode: string
    ) => void;
    joinRoom: (roomID: number) => void;
    getCurrentSession: () => void;
  }
}
