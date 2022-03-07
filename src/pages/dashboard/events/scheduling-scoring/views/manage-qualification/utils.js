import { isPast } from "date-fns";

function shouldDisableEditing(eventDateEnd) {
  if (!eventDateEnd) {
    return true;
  }
  return isPast(eventDateEnd);
}

export { shouldDisableEditing };
