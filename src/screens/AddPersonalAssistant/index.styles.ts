import {colors} from 'common/theme/colors';
import {Platform, StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  flex: {
    flex: 1,
  },
  view: {
    marginLeft: 10,
    marginTop: 5,
    // width: '75%',
  },
  contactContainerStyle: {
    height: 50,
    width: '100%',
    backgroundColor: colors.white,
  },
  extensionWidth: {
    width: '73%',
  },
  companyExtWidth: {
    width: '25%',
  },
  label: {
    marginTop: 10,
    marginBottom: 10,
    color: colors.primary_003,
  },
  fieldView: {
    width: '47%',
  },
  gpsIcon: {
    width: 20,
    height: 20,
    tintColor: colors.primary_003,
  },
  rowVerticalStyle: {
    alignItems: 'flex-start',
  },
  saveButton: {
    marginTop: 15,
    // backgroundColor: colors.primary,
    width: '47%',
    marginBottom: 16,
    borderRadius: 3,
  },
  addMoreButton: {
    marginTop: 15,
    // backgroundColor: colors.grey_001,
    width: '47%',
    borderWidth: 1,
    // borderColor: colors.primary,
    marginBottom: 16,
    borderRadius: 3,
  },
  companyLogo: {
    height: 65,
    width: 65,
    borderRadius: 5,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.grey_008,
    borderStyle: 'dashed',
  },
  companyLogoStyle: {
    width: 65,
    height: 65,
    position: 'relative',
  },
  closeStyle: {
    position: 'absolute',
    top: -7,
    left: 57,
    backgroundColor: colors.grey_001,
    borderRadius: 8,
    borderColor: colors.grey_003,
    borderWidth: 0.3,
  },
  saveButtonEdit: {
    marginTop: 15,
    // backgroundColor: colors.primary,
    width: '100%',
    marginBottom: 16,
    borderRadius: 3,
  },
  moreIcon: {
    marginTop: 3,
  },
  companyView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginRight: 8,
    paddingHorizontal: 5,
    borderRadius: 5,
    paddingVertical: 2,
    zIndex: 999999999999,
    backgroundColor: colors.grey_002,
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  bottomModalView: {
    backgroundColor: 'white',
    paddingTop: 15,
    maxHeight: '60%',
    height: Platform.OS === 'ios' ? '45%' : undefined,
  },
  attachmentView: {
    marginBottom: 16,
    marginTop: 16,
    // width: '90%',
  },
});
