#!/usr/bin/env ruby
require 'xcodeproj'

project_path = 'TempRNProject.xcodeproj'
project = Xcodeproj::Project.open(project_path)

# Find the main target
target = project.targets.find { |t| t.name == 'TempRNProject' }
unless target
  puts "Error: Could not find TempRNProject target"
  exit 1
end

# Find the Fonts group
main_group = project.main_group['TempRNProject']
fonts_group = main_group['Fonts'] if main_group

if fonts_group
  # Get resources build phase
  resources_build_phase = target.resources_build_phase
  
  # Remove all font files from resources build phase
  font_extensions = ['.ttf']
  removed_count = 0
  
  resources_build_phase.files.each do |file_ref|
    if file_ref.file_ref && file_ref.file_ref.path
      font_extensions.each do |ext|
        if file_ref.file_ref.path.end_with?(ext)
          file_ref.remove_from_project
          removed_count += 1
          puts "  - Removed #{file_ref.file_ref.path} from Resources"
        end
      end
    end
  end
  
  # Remove Fonts group from project (optional - keeps fonts visible but not copied)
  # fonts_group.remove_from_project
  
  puts "\n✓ Removed #{removed_count} font files from Resources build phase"
  puts "  Note: Fonts will still be copied by CocoaPods from react-native-vector-icons"
else
  puts "Fonts group not found in project"
end

project.save
puts "\n✓ Project updated successfully!"
