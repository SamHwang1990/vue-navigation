/**
 * Helpers for navigation.
 */

import NavigationActions from './NavigationActions';

export default function(navigation) {
  return {
    ...navigation,
    goBackTo: key =>
      navigation.dispatch(
        NavigationActions.backTo({
          key: key
        })
      ),
    goBack: key =>
        navigation.dispatch(
            NavigationActions.back({
              key: key === undefined ? navigation.state.key : key
            })
        ),
    navigate: (routeName, params, action) =>
      navigation.dispatch(
        NavigationActions.navigate({
          routeName,
          params,
          action,
        })
      ),
    setParams: params =>
      navigation.dispatch(
        NavigationActions.setParams({
          params,
          key: navigation.state.key,
        })
      )
  };
}
