import changeSettingsSaga from "./__sagas__/changeSettings.saga";
import changeUserInformationSaga from "./__sagas__/changeUserInformation.saga";

export default [...changeUserInformationSaga, ...changeSettingsSaga];
