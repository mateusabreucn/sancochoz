"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";
import { ShowcaseState, ShowcaseAction } from "./showcase.types";
import { showcaseReducer, initialState } from "./showcaseReducer";

const StateCtx = createContext<ShowcaseState | null>(null);
const DispatchCtx = createContext<React.Dispatch<ShowcaseAction> | null>(null);

export function ShowcaseProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(showcaseReducer, initialState);
  return (
    <StateCtx.Provider value={state}>
      <DispatchCtx.Provider value={dispatch}>
        {children}
      </DispatchCtx.Provider>
    </StateCtx.Provider>
  );
}

export function useShowcaseState(): ShowcaseState {
  const ctx = useContext(StateCtx);
  if (!ctx) throw new Error("useShowcaseState outside ShowcaseProvider");
  return ctx;
}

export function useShowcaseDispatch(): React.Dispatch<ShowcaseAction> {
  const ctx = useContext(DispatchCtx);
  if (!ctx) throw new Error("useShowcaseDispatch outside ShowcaseProvider");
  return ctx;
}
