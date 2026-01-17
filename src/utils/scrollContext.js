import React, { createContext, useContext, useRef } from 'react';

const ScrollContext = createContext(null);

export const ScrollProvider = ({ children, scrollViewRef }) => {
  const sectionPositions = useRef({});

  const registerSection = (sectionId, yPosition) => {
    sectionPositions.current[sectionId] = yPosition;
  };

  const scrollToSection = (sectionId) => {
    const position = sectionPositions.current[sectionId];
    if (position !== undefined && scrollViewRef?.current) {
      const headerHeight = 56;
      scrollViewRef.current.scrollTo({
        y: Math.max(0, position - headerHeight - 20),
        animated: true,
      });
    }
  };

  return (
    <ScrollContext.Provider value={{ registerSection, scrollToSection, sectionPositions: sectionPositions.current }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScroll must be used within ScrollProvider');
  }
  return context;
};
