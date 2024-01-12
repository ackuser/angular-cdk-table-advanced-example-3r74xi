import {
  animate,
  query,
  sequence,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";

export const ROW_ANIMATION = trigger("rowAnimation", [
  state(
    "void",
    style({
      opacity: 0.2
    })
  ),
  transition("void => *", sequence([animate(".5s ease")]))
]);
