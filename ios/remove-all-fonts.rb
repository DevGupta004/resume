#!/usr/bin/env ruby
require 'xcodeproj'

project_path = 'TempRNProject.xcodeproj'
project = Xcodeproj::Project.open(project_path)

target = project.targets.find { |t| t.name == 'TempRNProject' }
unless target
  puts "Error: Could not find TempRNProject target"
  exit 1
end

resources_build_phase = target.resources_build_phase
removed_count = 0

# Collect files to remove first (can't modify while iterating)
files_to_remove = []
resources_build_phase.files.each do |file_ref|
  if file_ref.file_ref && file_ref.file_ref.path && file_ref.file_ref.path.end_with?('.ttf')
    files_to_remove << file_ref
  end
end

# Remove collected files
files_to_remove.each do |file_ref|
  file_ref.remove_from_project
  removed_count += 1
  puts "  - Removed #{file_ref.file_ref.path} from Resources"
end

project.save
puts "\n✓ Removed #{removed_count} font files from Resources build phase"
puts "  Fonts will be handled by CocoaPods from react-native-vector-icons"
