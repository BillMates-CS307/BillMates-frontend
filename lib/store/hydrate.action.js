import { createAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

export const hydrateAction = createAction(HYDRATE);
