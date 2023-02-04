import { useState } from "react";

export const useToggle = (
  initialState?: boolean
): [boolean, () => void, () => void] => {
  const [state, setState] = useState(initialState || false);

  const toggle = () => setState(!state);

  const onClose = () => setState(false);

  return [state, toggle, onClose];
};
