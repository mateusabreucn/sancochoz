export type Category = "videomaking" | "webdesign" | "socialmedia";

export interface VideoEntry {
  id: string;
  category: Category;
  src: string;
  title: string;
}

export interface ShowcaseState {
  category: Category;
  activeVideoId: string | null;
  globalMuted: boolean;
  isDragging: boolean;
}

export type ShowcaseAction =
  | { type: "SET_CATEGORY"; category: Category }
  | { type: "SET_ACTIVE"; id: string }
  | { type: "RESET_ACTIVE" }
  | { type: "TOGGLE_MUTE" }
  | { type: "SET_DRAGGING"; dragging: boolean };
