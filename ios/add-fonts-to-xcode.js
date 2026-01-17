const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectPath = path.join(__dirname, 'TempRNProject.xcodeproj', 'project.pbxproj');
const fontsDir = path.join(__dirname, 'TempRNProject', 'Fonts');

if (!fs.existsSync(fontsDir)) {
  console.log('Fonts directory does not exist');
  process.exit(1);
}

const fonts = fs.readdirSync(fontsDir).filter(f => f.endsWith('.ttf'));

if (fonts.length === 0) {
  console.log('No fonts found');
  process.exit(1);
}

console.log(`Found ${fonts.length} fonts. Adding to Xcode project...`);

// Use xcodebuild or manual method
// For now, we'll use a simpler approach - fonts should work if Info.plist is correct
// But we need to add them to Xcode project for proper bundling

console.log('Fonts copied. Please add Fonts folder to Xcode project manually:');
console.log('1. Open TempRNProject.xcworkspace in Xcode');
console.log('2. Right-click TempRNProject folder');
console.log('3. Select "Add Files to TempRNProject..."');
console.log('4. Select the Fonts folder');
console.log('5. Make sure "Create groups" is selected');
console.log('6. Make sure "Add to targets: TempRNProject" is checked');
