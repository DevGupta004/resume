// Load react-native-vector-icons fonts for web
// Using a simpler approach - copy fonts to public and reference them
if (typeof document !== 'undefined') {
  const iconFontStyles = `
    @font-face {
      src: url('/fonts/Feather.ttf') format('truetype');
      font-family: 'Feather';
      font-style: normal;
      font-weight: normal;
      font-display: swap;
    }
    @font-face {
      src: url('/fonts/FontAwesome.ttf') format('truetype');
      font-family: 'FontAwesome';
      font-style: normal;
      font-weight: normal;
      font-display: swap;
    }
    @font-face {
      src: url('/fonts/MaterialCommunityIcons.ttf') format('truetype');
      font-family: 'MaterialCommunityIcons';
      font-style: normal;
      font-weight: normal;
      font-display: swap;
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.type = 'text/css';

  if (styleEl.styleSheet) {
    styleEl.styleSheet.cssText = iconFontStyles;
  } else {
    styleEl.appendChild(document.createTextNode(iconFontStyles));
  }

  document.head.appendChild(styleEl);
}
