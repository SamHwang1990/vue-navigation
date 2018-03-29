/**
 * Utility that builds the style for the card in the cards stack.
 *
 *     +------------+
 *   +-+            |
 * +-+ |            |
 * | | |            |
 * | | |  Focused   |
 * | | |   Card     |
 * | | |            |
 * +-+ |            |
 *   +-+            |
 *     +------------+
 */

/**
 * Render the initial style when the initial layout isn't measured yet.
 */
function forInitial(props) {
  const { current, scene } = props;

  const focused = current === scene.index;
  const opacity = focused ? 1 : 0;
  // If not focused, move the scene far away.
  const translate = focused ? 0 : 1000000;
  return {
    opacity,
    translateX: translate,
    translateY: translate
  };
}

/**
 * Standard iOS-style slide in from the right.
 */
function forHorizontal(props) {
  const { layout, scene } = props;

  if (!layout.isMeasured) {
    return forInitial(props);
  }

  const index = scene.index;
  const inputRange = [index - 1, index, index + 1];

  const width = layout.initWidth;
  const outputRange = [width, 0, width * -0.3];

  // Add [index - 1, index - 0.99] to the interpolated opacity for screen transition.
  // This makes the screen's shadow to disappear smoothly.
  const opacity = {
    inputRange: [
      index - 1,
      index,
      index + 1,
    ],
    outputRange: [
      0,
      1,
      0
    ],
  };

  const translateY = 0;
  const translateX = {
    inputRange,
    outputRange,
  };

  return {
    opacity,
    translateX,
    translateY
  };
}

/**
 * Standard iOS-style slide in from the bottom (used for modals).
 */
function forVertical(props) {
  const { layout, scene } = props;

  if (!layout.isMeasured) {
    return forInitial(props);
  }

  const index = scene.index;
  const height = layout.initHeight;

  const opacity = {
    inputRange: [
      index - 1,
      index,
      index + 1,
    ],
    outputRange: [
      0,
      1,
      0
    ]
  };

  const translateX = 0;
  const translateY = {
    inputRange: [index - 1, index, index + 1],
    outputRange: [height, 0, 0]
  };

  return {
    opacity,
    translateX,
    translateY
  };
}

/**
 * Standard Android-style fade in from the bottom.
 */
function forFadeFromBottomAndroid(props) {
  const { layout, scene } = props;
  const index = scene.index;
  const inputRange = [index - 1, index, index + 1];

  if (!layout.isMeasured) {
    return forInitial(props);
  }

  const opacity = {
    inputRange,
    outputRange: [0, 1, 0]
  };

  const translateX = 0;
  const translateY = {
    inputRange,
    outputRange: [50, 0, 0, 0]
  };

  return {
    opacity,
    translateX,
    translateY
  };
}

export default {
  forHorizontal,
  forVertical,
  forFadeFromBottomAndroid
};
