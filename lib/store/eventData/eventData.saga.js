import addEventSaga from "./__sagas__/addEvent.saga";
import removeEventSaga from "./__sagas__/removeEvent.saga";

export default [...addEventSaga, ...removeEventSaga];
