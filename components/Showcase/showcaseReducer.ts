import { ShowcaseState, ShowcaseAction } from "./showcase.types";

export const initialState: ShowcaseState = {
  category: "videomaking",
  activeVideoId: null,
  globalMuted: true,
  isDragging: false,
};

export function showcaseReducer(
  state: ShowcaseState,
  action: ShowcaseAction
): ShowcaseState {
  switch (action.type) {
    case "SET_CATEGORY":
      return { ...state, category: action.category, activeVideoId: null };
    case "SET_ACTIVE":
      return { ...state, activeVideoId: action.id };
    case "RESET_ACTIVE":
      return { ...state, activeVideoId: null };
    case "TOGGLE_MUTE":
      return { ...state, globalMuted: !state.globalMuted };
    case "SET_DRAGGING":
      return { ...state, isDragging: action.dragging };
    default:
      return state;
  }
}
