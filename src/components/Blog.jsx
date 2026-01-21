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
      if (window.innerWidth >= 1280) {
        return '31%'; // 3 columns on large desktop
      } else if (window.innerWidth >= 768) {
        return '48%'; // 2 columns on tablet/desktop
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

  return (
    <View id="blog" style={{ paddingVertical: 48, backgroundColor: bgColor }}>
      <View style={{ maxWidth: 1280, marginHorizontal: 'auto', paddingHorizontal: Platform.OS === 'web' ? 24 : 16 }}>
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: 32,
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <Text style={{ fontSize: Platform.OS === 'web' ? 36 : 30, fontWeight: '700', color: textColor }}>
            Blog
          </Text>
          <Pressable
            onPress={() => openURL('https://medium.com/@devgupta007')}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 8,
              backgroundColor: darkMode ? 'rgba(30, 136, 229, 0.15)' : 'rgba(30, 136, 229, 0.1)',
              borderWidth: 1,
              borderColor: darkMode ? 'rgba(30, 136, 229, 0.3)' : 'rgba(30, 136, 229, 0.2)',
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
          >
            <Text style={{ color: linkColor, fontWeight: '600', marginRight: 8, fontSize: 14 }}>View on Medium</Text>
            <Icon name="external-link" size={16} color={linkColor} />
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
            marginHorizontal: Platform.OS === 'web' ? -16 : -12,
            gap: Platform.OS === 'web' ? 20 : 16,
          }}>
            {stories.map((story, idx) => (
              <View 
                key={idx} 
                style={{ 
                  width: getCardWidth(),
                  paddingHorizontal: Platform.OS === 'web' ? 16 : 12,
                  marginBottom: Platform.OS === 'web' ? 20 : 16,
                  minWidth: Platform.OS === 'web' && typeof window !== 'undefined' && window.innerWidth >= 768 ? 280 : undefined,
                }}
              >
                <Pressable
                  onPress={() => handleStoryPress(story.link)}
                  style={({ pressed }) => ({
                    borderWidth: 1,
                    borderColor: borderColor,
                    borderRadius: 12,
                    backgroundColor: cardBg,
                    overflow: 'hidden',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: darkMode ? 0.3 : 0.1,
                    shadowRadius: 6,
                    elevation: 3,
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
                        height: Platform.OS === 'web' ? 220 : 200,
                        backgroundColor: borderColor,
                      }}
                      resizeMode="cover"
                    />
                  )}
                  <View style={{ 
                    padding: Platform.OS === 'web' ? 24 : 20,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    <Text 
                      style={{ 
                        fontSize: Platform.OS === 'web' ? 20 : 18, 
                        fontWeight: '600', 
                        marginBottom: 10, 
                        color: textColor,
                        lineHeight: Platform.OS === 'web' ? 28 : 24,
                      }}
                      numberOfLines={2}
                    >
                      {story.title}
                    </Text>
                    <Text 
                      style={{ 
                        marginBottom: 16, 
                        fontSize: Platform.OS === 'web' ? 15 : 14, 
                        color: subTextColor,
                        lineHeight: Platform.OS === 'web' ? 22 : 20,
                        flex: 1,
                      }}
                      numberOfLines={Platform.OS === 'web' ? 4 : 3}
                    >
                      {story.description}
                    </Text>
                    <View style={{ 
                      flexDirection: 'row', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginTop: 'auto',
                      paddingTop: 12,
                    }}>
                      <Text style={{ fontSize: 12, color: subTextColor, fontWeight: '500' }}>
                        {formatDate(story.pubDate)}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 13, color: linkColor, marginRight: 6, fontWeight: '600' }}>
                          Read more
                        </Text>
                        <Icon name="arrow-right" size={14} color={linkColor} />
                      </View>
                    </View>
                    {story.categories && story.categories.length > 0 && (
                      <View style={{ 
                        flexDirection: 'row', 
                        flexWrap: 'wrap', 
                        marginTop: 14,
                        gap: 6,
                      }}>
                        {story.categories.slice(0, 3).map((cat, i) => (
                          <View
                            key={i}
                            style={{
                              paddingVertical: 4,
                              paddingHorizontal: 10,
                              backgroundColor: darkMode ? 'rgba(30, 136, 229, 0.15)' : 'rgba(30, 136, 229, 0.1)',
                              borderRadius: 6,
                            }}
                          >
                            <Text style={{ fontSize: 11, color: linkColor, fontWeight: '500' }}>
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
