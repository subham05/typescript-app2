import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    elevation: 5,
    alignContent: 'center',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.39,
    shadowRadius: 3,
  },
  headerMainContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 8,
    flex: 1,
  },
  headerShadowNone: {
    elevation: 0,
    shadowOpacity: 0,
  },
  mainInnerStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  backImageContainer: {},
  dashboardContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  dashboardInnerContainer: {
    flexDirection: 'row',
  },
  notificationContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  messageContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  labelText: {
    fontWeight: '700',
    flex: 7,
  },
  backArrowBackground: {
    alignSelf: 'center',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: 'black',
    aspectRatio: 1,
  },
  bashbordview: {
    flex: 0.9,
  },
  countView: {
    aspectRatio: 1,
    backgroundColor: 'orange',
  },
  container: {},

  menuIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  backconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    flex: 5,
    paddingLeft: 10,
    justifyContent: 'center',
  },
  indicatorContainer: {
    flex: 2,
    flexDirection: 'row',
    position: 'relative',
  },
});
