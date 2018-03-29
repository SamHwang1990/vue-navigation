
import cardStackStyleInterpolator from './cardStackStyleInterpolator';

// Used for all animations unless overriden
const DefaultTransitionSpec = {
  duration: 250,
  easing: 'ease-in',
  tween: 'linear'
};

const IOSTransitionSpec = {
  duration: 500,
  easing: 'ease-in',
  tween: 'linear'
};

// Standard iOS navigation transition
const SlideFromRightIOS = {
  transitionSpec: IOSTransitionSpec,
  screenInterpolator: cardStackStyleInterpolator.forHorizontal,
  containerStyle: {
    backgroundColor: '#000',
  },
};

// Standard iOS navigation transition for modals
const ModalSlideFromBottomIOS = {
  transitionSpec: IOSTransitionSpec,
  screenInterpolator: cardStackStyleInterpolator.forVertical,
  containerStyle: {
    backgroundColor: '#000',
  },
};

// Standard Android navigation transition when opening an Activity
const FadeInFromBottomAndroid = {
  transitionSpec: {
    duration: 350,
    easing: 'ease-in',
    tween: 'linear'
  },
  screenInterpolator: cardStackStyleInterpolator.forFadeFromBottomAndroid,
};

// Standard Android navigation transition when closing an Activity
const FadeOutToBottomAndroid = {
  transitionSpec: {
    duration: 230,
    easing: 'ease-in',
    tween: 'linear'
  },
  screenInterpolator: cardStackStyleInterpolator.forFadeFromBottomAndroid,
};

function defaultTransitionConfig(
  // props for the new screen
  transitionProps,
  // props for the old screen
  prevTransitionProps,
  // whether we're animating in/out a modal screen
  isModal
) {
  if (Platform.isAndroid()) {
    // Use the default Android animation no matter if the screen is a modal.
    // Android doesn't have full-screen modals like iOS does, it has dialogs.
    if (
      prevTransitionProps &&
      transitionProps.index < prevTransitionProps.index
    ) {
      // Navigating back to the previous screen
      return FadeOutToBottomAndroid;
    }
    return FadeInFromBottomAndroid;
  }
  // iOS and other platforms
  if (isModal) {
    return ModalSlideFromBottomIOS;
  }
  return SlideFromRightIOS;
}

function getTransitionConfig(
  transitionConfigurer,
  // props for the new screen
  transitionProps,
  // props for the old screen
  prevTransitionProps,
  isModal
) {
  const defaultConfig = defaultTransitionConfig(
    transitionProps,
    prevTransitionProps,
    isModal
  );
  if (transitionConfigurer) {
    return {
      ...defaultConfig,
      ...transitionConfigurer(),
    };
  }
  return defaultConfig;
}

export default {
  DefaultTransitionSpec,
  defaultTransitionConfig,
  getTransitionConfig,
};
