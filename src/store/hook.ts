import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { ThunkDispatch } from "@reduxjs/toolkit";
import type { UnknownAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

export type AppThunkDispatch = ThunkDispatch<RootState, any, UnknownAction>;
export const useAppDispatch = () => useDispatch<AppThunkDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;