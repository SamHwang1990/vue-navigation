import invariant from '../utils/invariant';

/**
 * Make sure screen options returned by the `getScreenOption` are valid
 */
export default (screenOptions, route) => {
  if (typeof screenOptions.title === 'function') {
    invariant(
      false,
      [
        `\`title\` cannot be defined as a function in navigation options for \`${route.routeName}\` screen. \n`,
        'Try replacing the following:',
        '{',
        '    title: ({ state }) => state...',
        '}',
        '',
        'with:',
        '({ navigation }) => ({',
        '    title: navigation.state...',
        '})',
      ].join('\n')
    );
  }
};
