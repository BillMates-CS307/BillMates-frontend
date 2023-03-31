import changeSettingsSaga from "./__sagas__/changeSettings.saga";
import changeUserInformationSaga from "./__sagas__/changeUserInformation.saga";
import deleteUserSaga from "./__sagas__/deleteUser.saga";
import linkVenmoSaga from "./__sagas__/linkVenmo.saga";

export default [
  ...changeUserInformationSaga,
  ...changeSettingsSaga,
  ...deleteUserSaga,
  ...linkVenmoSaga,
];
