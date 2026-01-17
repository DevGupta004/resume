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

# Find the main group
main_group = project.main_group['TempRNProject']
unless main_group
  puts "Error: Could not find TempRNProject group"
  exit 1
end

# Check if Fonts group exists, create if not
fonts_group = main_group['Fonts']
unless fonts_group
  fonts_group = main_group.new_group('Fonts', 'Fonts')
end

# Font files directory
fonts_dir = 'TempRNProject/Fonts'
font_files = Dir.glob("#{fonts_dir}/*.ttf")

if font_files.empty?
  puts "No font files found in #{fonts_dir}"
  exit 1
end

puts "Found #{font_files.length} font files"

# Add each font file to the project
font_files.each do |font_path|
  font_name = File.basename(font_path)
  
  # Check if file reference already exists
  existing_file = fonts_group.files.find { |f| f.path == font_name }
  if existing_file
    puts "  ✓ #{font_name} already in project"
    next
  end
  
  # Add file reference
  file_ref = fonts_group.new_file(font_path)
  
  # Add to target's resources build phase
  resources_build_phase = target.resources_build_phase
  file_ref_build_file = resources_build_phase.add_file_reference(file_ref)
  
  puts "  + Added #{font_name}"
end

project.save
puts "\n✓ Fonts added to Xcode project successfully!"
