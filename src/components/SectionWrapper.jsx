import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { useScroll } from '../utils/scrollContext';
import { isWeb } from '../utils/platform';

const SectionWrapper = ({ id, children }) => {
  const ref = useRef(null);
  const { registerSection } = useScroll();

  useEffect(() => {
    if (!isWeb && ref.current) {
      // Measure the section position after layout
      setTimeout(() => {
        ref.current?.measureLayout(
          ref.current?.getParent?.() || ref.current,
          (x, y, width, height) => {
            registerSection(id, y);
          },
          () => {
            // Fallback: try to measure using onLayout
          }
        );
      }, 100);
    }
  }, [id, registerSection]);

  return (
    <View
      ref={ref}
      id={id}
      onLayout={(event) => {
        if (!isWeb) {
          const { y } = event.nativeEvent.layout;
          // Accumulate Y positions (sections stack vertically)
          // We need to measure relative to ScrollView, so we'll use a different approach
        }
      }}
    >
      {children}
    </View>
  );
};

export default SectionWrapper;
