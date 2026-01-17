// Polyfill process for browser (must be first)
import './process-polyfill';

// Load icon fonts (must be before CSS)
import './load-icons';

// Import CSS
import './index.css';

import { AppRegistry } from 'react-native';
import App from '../src/App';

// Debug logging
console.log('=== React Native Web Debug ===');
console.log('Root element:', document.getElementById('root'));
console.log('App component:', App);

// Register and run the app
AppRegistry.registerComponent('ResumeApp', () => App);

const rootTag = document.getElementById('root');
if (!rootTag) {
  console.error('Root element not found!');
} else {
  try {
    AppRegistry.runApplication('ResumeApp', {
      initialProps: {},
      rootTag: rootTag,
    });
    console.log('App registered and running successfully');
  } catch (error) {
    console.error('Error running application:', error);
    console.error('Error stack:', error.stack);
  }
}
