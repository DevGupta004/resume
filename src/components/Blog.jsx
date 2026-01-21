import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Image, ActivityIndicator, Platform, RefreshControl, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { openURL } from '../utils/linking';
import { fetchMediumStories, formatDate } from '../utils/mediumService';

const Blog = ({ darkMode = false }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const bgColor = darkMode ? '#111827' : '#FFFFFF';
  const cardBg = darkMode ? '#1F2937' : '#FFFFFF';
  const textColor = darkMode ? '#E5E7EB' : '#111827';
  const subTextColor = darkMode ? '#9CA3AF' : '#6B7280';
  const borderColor = darkMode ? '#374151' : '#E5E7EB';
  const linkColor = darkMode ? '#60A5FA' : '#1E88E5';

  const loadStories = async () => {
    try {
      setError(null);
      const fetchedStories = await fetchMediumStories();
      setStories(fetchedStories);
    } catch (err) {
      console.error('Error loading stories:', err);
      setError('Failed to load blog posts. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStories();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadStories();
  };

  const getCardWidth = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      if (window.innerWidth >= 1400) {
        return '32%'; // 3 columns on extra large desktop
      } else if (window.innerWidth >= 1024) {
        return '48%'; // 2 columns on large desktop/tablet
      } else if (window.innerWidth >= 768) {
        return '48%'; // 2 columns on tablet
      }
    }
    return '100%'; // 1 column on mobile
  };

  const handleStoryPress = (link) => {
    openURL(link);
  };

  if (loading) {
    return (
      <View id="blog" style={{ paddingVertical: 48, backgroundColor: bgColor, minHeight: 400 }}>
        <View style={{ maxWidth: 1280, marginHorizontal: 'auto', paddingHorizontal: 16 }}>
          <Text style={{ fontSize: 30, fontWeight: '600', marginBottom: 24, color: textColor }}>
            Blog
          </Text>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 }}>
            <ActivityIndicator size="large" color={linkColor} />
            <Text style={{ marginTop: 16, color: subTextColor }}>Loading stories...</Text>
          </View>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View id="blog" style={{ paddingVertical: 48, backgroundColor: bgColor }}>
        <View style={{ maxWidth: 1280, marginHorizontal: 'auto', paddingHorizontal: 16 }}>
          <Text style={{ fontSize: 30, fontWeight: '600', marginBottom: 24, color: textColor }}>
            Blog
          </Text>
          <View style={{ 
            padding: 24, 
            backgroundColor: cardBg, 
            borderRadius: 8, 
            borderWidth: 1, 
            borderColor: borderColor,
            alignItems: 'center',
          }}>
            <Icon name="alert-circle" size={48} color={subTextColor} />
            <Text style={{ marginTop: 16, color: textColor, fontSize: 16, textAlign: 'center' }}>
              {error}
            </Text>
            <Pressable
              onPress={loadStories}
              style={({ pressed }) => ({
                marginTop: 16,
                paddingVertical: 12,
                paddingHorizontal: 24,
                backgroundColor: linkColor,
                borderRadius: 8,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Retry</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  const isDesktopWeb = Platform.OS === 'web' && typeof window !== 'undefined' && window.innerWidth >= 1024;
  
  return (
    <View id="blog" style={{ paddingVertical: isDesktopWeb ? 64 : 48, backgroundColor: bgColor }}>
      <View style={{ 
        maxWidth: isDesktopWeb ? 1400 : 1280, 
        marginHorizontal: 'auto', 
        paddingHorizontal: isDesktopWeb ? 48 : Platform.OS === 'web' ? 32 : 16 
      }}>
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: isDesktopWeb ? 48 : 32,
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <Text style={{ 
            fontSize: isDesktopWeb ? 42 : Platform.OS === 'web' ? 36 : 30, 
            fontWeight: '700', 
            color: textColor,
            letterSpacing: -0.5,
          }}>
            Blog
          </Text>
          <Pressable
            onPress={() => openURL('https://medium.com/@devgupta007')}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: isDesktopWeb ? 12 : 10,
              paddingHorizontal: isDesktopWeb ? 24 : 20,
              borderRadius: 8,
              backgroundColor: darkMode ? 'rgba(30, 136, 229, 0.15)' : 'rgba(30, 136, 229, 0.1)',
              borderWidth: 1,
              borderColor: darkMode ? 'rgba(30, 136, 229, 0.3)' : 'rgba(30, 136, 229, 0.2)',
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
          >
            <Text style={{ 
              color: linkColor, 
              fontWeight: '600', 
              marginRight: 8, 
              fontSize: isDesktopWeb ? 15 : 14 
            }}>
              View on Medium
            </Text>
            <Icon name="external-link" size={isDesktopWeb ? 18 : 16} color={linkColor} />
          </Pressable>
        </View>

        {stories.length === 0 ? (
          <View style={{ 
            padding: 48, 
            backgroundColor: cardBg, 
            borderRadius: 12, 
            borderWidth: 1, 
            borderColor: borderColor,
            alignItems: 'center',
          }}>
            <Icon name="book-open" size={48} color={subTextColor} />
            <Text style={{ marginTop: 16, color: textColor, fontSize: 16, textAlign: 'center' }}>
              No blog posts found
            </Text>
            <Text style={{ marginTop: 8, color: subTextColor, fontSize: 14, textAlign: 'center' }}>
              Check back later for new articles!
            </Text>
          </View>
        ) : (
          <View style={{ 
            flexDirection: 'row', 
            flexWrap: 'wrap', 
            marginHorizontal: isDesktopWeb ? -20 : Platform.OS === 'web' ? -16 : -12,
            gap: isDesktopWeb ? 28 : Platform.OS === 'web' ? 24 : 16,
          }}>
            {stories.map((story, idx) => (
              <View 
                key={idx} 
                style={{ 
                  width: getCardWidth(),
                  paddingHorizontal: isDesktopWeb ? 20 : Platform.OS === 'web' ? 16 : 12,
                  marginBottom: isDesktopWeb ? 28 : Platform.OS === 'web' ? 24 : 16,
                  minWidth: Platform.OS === 'web' && typeof window !== 'undefined' && window.innerWidth >= 768 ? (isDesktopWeb ? 380 : 320) : undefined,
                }}
              >
                <Pressable
                  onPress={() => handleStoryPress(story.link)}
                  style={({ pressed }) => ({
                    borderWidth: 1,
                    borderColor: borderColor,
                    borderRadius: 16,
                    backgroundColor: cardBg,
                    overflow: 'hidden',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: darkMode ? 0.3 : 0.12,
                    shadowRadius: isDesktopWeb ? 12 : 8,
                    elevation: 4,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  })}
                >
                  {story.imageUrl && (
                    <Image
                      source={{ uri: story.imageUrl }}
                      style={{
                        width: '100%',
                        height: isDesktopWeb ? 260 : Platform.OS === 'web' ? 240 : 200,
                        backgroundColor: borderColor,
                      }}
                      resizeMode="cover"
                    />
                  )}
                  <View style={{ 
                    padding: isDesktopWeb ? 28 : Platform.OS === 'web' ? 24 : 20,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    <Text 
                      style={{ 
                        fontSize: isDesktopWeb ? 22 : Platform.OS === 'web' ? 20 : 18, 
                        fontWeight: '700', 
                        marginBottom: isDesktopWeb ? 12 : 10, 
                        color: textColor,
                        lineHeight: isDesktopWeb ? 32 : Platform.OS === 'web' ? 28 : 24,
                        letterSpacing: -0.3,
                      }}
                      numberOfLines={2}
                    >
                      {story.title}
                    </Text>
                    <Text 
                      style={{ 
                        marginBottom: isDesktopWeb ? 20 : 16, 
                        fontSize: isDesktopWeb ? 16 : Platform.OS === 'web' ? 15 : 14, 
                        color: subTextColor,
                        lineHeight: isDesktopWeb ? 24 : Platform.OS === 'web' ? 22 : 20,
                        flex: 1,
                      }}
                      numberOfLines={isDesktopWeb ? 5 : Platform.OS === 'web' ? 4 : 3}
                    >
                      {story.description}
                    </Text>
                    <View style={{ 
                      flexDirection: 'row', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginTop: 'auto',
                      paddingTop: isDesktopWeb ? 16 : 12,
                    }}>
                      <Text style={{ 
                        fontSize: isDesktopWeb ? 13 : 12, 
                        color: subTextColor, 
                        fontWeight: '500' 
                      }}>
                        {formatDate(story.pubDate)}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ 
                          fontSize: isDesktopWeb ? 14 : 13, 
                          color: linkColor, 
                          marginRight: 6, 
                          fontWeight: '600' 
                        }}>
                          Read more
                        </Text>
                        <Icon name="arrow-right" size={isDesktopWeb ? 16 : 14} color={linkColor} />
                      </View>
                    </View>
                    {story.categories && story.categories.length > 0 && (
                      <View style={{ 
                        flexDirection: 'row', 
                        flexWrap: 'wrap', 
                        marginTop: isDesktopWeb ? 16 : 14,
                        gap: 8,
                      }}>
                        {story.categories.slice(0, 3).map((cat, i) => (
                          <View
                            key={i}
                            style={{
                              paddingVertical: isDesktopWeb ? 6 : 4,
                              paddingHorizontal: isDesktopWeb ? 12 : 10,
                              backgroundColor: darkMode ? 'rgba(30, 136, 229, 0.15)' : 'rgba(30, 136, 229, 0.1)',
                              borderRadius: 6,
                            }}
                          >
                            <Text style={{ 
                              fontSize: isDesktopWeb ? 12 : 11, 
                              color: linkColor, 
                              fontWeight: '500' 
                            }}>
                              {cat}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default Blog;
