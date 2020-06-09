import { INCREMENT_NUMBER } from "./actionTypes";

export function incrementNumber(number) {
  return {
    type: INCREMENT_NUMBER,
    payload: number
  };
}
