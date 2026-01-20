import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Pressable, Linking, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isWeb } from '../utils/platform';
import BottomSheet from '../components/BottomSheet';

// Conditional WebView import - only for mobile
let WebView;
if (!isWeb) {
  try {
    WebView = require('react-native-webview').WebView;
  } catch (e) {
    console.warn('react-native-webview not available');
  }
}

const JobsScreen = ({ darkMode = false }) => {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(!isWeb); // Don't show loading on web
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [webViewError, setWebViewError] = useState(isWeb); // Show error immediately on web
  
  // For mobile, set a timeout to detect if WebView fails to load
  useEffect(() => {
    if (!isWeb) {
      // On mobile, set timeout to detect if WebView fails
      const timer = setTimeout(() => {
        if (loading) {
          // If still loading after 4 seconds, likely blocked or slow connection
          setWebViewError(true);
          setLoading(false);
        }
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [loading, isWeb]);
  
  // Google search URL for LinkedIn jobs - React JS Developer
  const googleSearchUrl = 'https://www.google.com/search?q=site:linkedin.com/jobs+react+js+developer&sca_esv=37c453c1e71916bb&sxsrf=ANbL-n62F-uUz5IJLR4OB4rCPgd31twjjg:1768512935467&source=lnt&tbs=qdr:d&sa=X&ved=2ahUKEwiUlLKKwI6SAxUhWXADHcFvFJwQpwV6BAgGEAc&biw=1800&bih=1011&dpr=2&aic=0';

  // JavaScript to intercept link clicks
  const interceptClicks = `
    (function() {
      function interceptLinks() {
        // Intercept all link clicks
        const links = document.querySelectorAll('a[href]');
        links.forEach(link => {
          // Skip if already processed
          if (link.dataset.intercepted === 'true') return;
          link.dataset.intercepted = 'true';
          
          link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only intercept external links (LinkedIn job links)
            if (href && (href.startsWith('http') || href.startsWith('//'))) {
              e.preventDefault();
              e.stopPropagation();
              
              // Send URL to React Native
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'linkClick',
                  url: href.startsWith('//') ? 'https:' + href : href
                }));
              }
              
              return false;
            }
          }, true);
        });
      }
      
      // Run immediately
      interceptLinks();
      
      // Run after page loads
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', interceptLinks);
      }
      
      // Run periodically to catch dynamically added links
      setTimeout(interceptLinks, 500);
      setTimeout(interceptLinks, 1000);
      setTimeout(interceptLinks, 2000);
      
      // Use MutationObserver to catch new links
      const observer = new MutationObserver(interceptLinks);
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    })();
    true;
  `;

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'linkClick' && data.url) {
        setSelectedUrl(data.url);
        setBottomSheetVisible(true);
      }
    } catch (e) {
      console.warn('Error parsing message:', e);
    }
  };

  const handleShouldStartLoadWithRequest = (request) => {
    // For mobile, intercept navigation
    const url = request.url;
    
    // Allow Google search page to load
    if (url.includes('google.com/search')) {
      return true;
    }
    
    // Intercept other links and show in bottom sheet
    if (url.startsWith('http') && !url.includes('google.com')) {
      setSelectedUrl(url);
      setBottomSheetVisible(true);
      return false; // Prevent navigation
    }
    
    return true;
  };

  const bgColor = darkMode ? '#111827' : '#FFFFFF';
  const headerBg = darkMode ? '#111827' : '#FFFFFF';
  const textColor = darkMode ? '#E5E7EB' : '#111827';
  const borderColor = darkMode ? '#374151' : '#E5E7EB';

  // For web, use iframe (Google will likely block it, but we'll try)
  if (isWeb) {
    return (
      <View style={{ flex: 1, backgroundColor: bgColor }}>
        {/* Content for Web - Show fallback immediately since Google blocks iframe */}
        <View style={{ 
          flex: 1,
          paddingTop: isWeb ? insets.top + 64 + 16 : insets.top + 56 + 16,
        }}>
          {/* Don't even try to load iframe on web - show fallback immediately */}
          {webViewError && (
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: bgColor,
              paddingHorizontal: 24,
            }}>
              <View style={{
                backgroundColor: darkMode ? '#1F2937' : '#F9FAFB',
                borderRadius: 16,
                padding: 32,
                maxWidth: 500,
                width: '100%',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: borderColor,
              }}>
                <View style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: darkMode ? 'rgba(30, 136, 229, 0.2)' : 'rgba(30, 136, 229, 0.1)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 24,
                }}>
                  <Text style={{ fontSize: 32 }}>🔍</Text>
                </View>
                
                <Text style={{
                  fontSize: 20,
                  fontWeight: '700',
                  color: textColor,
                  marginBottom: 12,
                  textAlign: 'center',
                }}>
                  Unable to Load Search Results
                </Text>
                
                <Text style={{
                  fontSize: 14,
                  color: darkMode ? '#9CA3AF' : '#6B7280',
                  textAlign: 'center',
                  marginBottom: 24,
                  lineHeight: 20,
                }}>
                  Google Search cannot be embedded due to security restrictions (X-Frame-Options). Click the button below to view LinkedIn React JS Developer jobs in a new browser tab.
                </Text>
                
                <Pressable
                  onPress={() => {
                    if (typeof window !== 'undefined') {
                      window.open(googleSearchUrl, '_blank', 'noopener,noreferrer');
                    }
                  }}
                  style={({ pressed }) => ({
                    backgroundColor: '#1E88E5',
                    paddingHorizontal: 32,
                    paddingVertical: 14,
                    borderRadius: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  })}
                >
                  <Text style={{
                    color: '#FFFFFF',
                    fontSize: 16,
                    fontWeight: '600',
                  }}>
                    Open Jobs Search
                  </Text>
                  <Text style={{
                    color: '#FFFFFF',
                    fontSize: 16,
                  }}>→</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  }

  // For mobile, use React Native WebView
  // If WebView is not available, show fallback
  if (!WebView) {
    const cardBg = darkMode ? '#1F2937' : '#F9FAFB';
    const handleOpenInNewTab = () => {
      if (typeof window !== 'undefined') {
        window.open(googleSearchUrl, '_blank', 'noopener,noreferrer');
      }
    };

    return (
      <View style={{ flex: 1, backgroundColor: bgColor }}>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 24,
          paddingTop: isWeb ? insets.top + 64 + 16 : insets.top + 56 + 16,
        }}>
          <View style={{
            backgroundColor: cardBg,
            borderRadius: 16,
            padding: 32,
            maxWidth: 500,
            width: '100%',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: borderColor,
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: '700',
              color: textColor,
              marginBottom: 12,
              textAlign: 'center',
            }}>
              WebView Not Available
            </Text>
            <Text style={{
              fontSize: 14,
              color: darkMode ? '#9CA3AF' : '#6B7280',
              textAlign: 'center',
              marginBottom: 24,
              lineHeight: 20,
            }}>
              Please install react-native-webview to view job listings.
            </Text>
            <Pressable
              onPress={handleOpenInNewTab}
              style={({ pressed }) => ({
                backgroundColor: '#1E88E5',
                paddingHorizontal: 32,
                paddingVertical: 14,
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}
            >
              <Text style={{
                color: '#FFFFFF',
                fontSize: 16,
                fontWeight: '600',
              }}>
                Open Jobs Search
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  // For mobile, use React Native WebView
  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      {/* WebView for Mobile */}
      <View style={{ 
        flex: 1,
        paddingTop: isWeb ? insets.top + 64 + 16 : insets.top + 56 + 16,
      }}>
        {webViewError ? (
          // Fallback UI if WebView fails due to X-Frame-Options
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
          }}>
            <View style={{
              backgroundColor: darkMode ? '#1F2937' : '#F9FAFB',
              borderRadius: 16,
              padding: 32,
              maxWidth: 500,
              width: '100%',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: borderColor,
            }}>
              <View style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: darkMode ? 'rgba(30, 136, 229, 0.2)' : 'rgba(30, 136, 229, 0.1)',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 24,
              }}>
                <Text style={{ fontSize: 32 }}>🔍</Text>
              </View>
              
              <Text style={{
                fontSize: 20,
                fontWeight: '700',
                color: textColor,
                marginBottom: 12,
                textAlign: 'center',
              }}>
                Unable to Load Search Results
              </Text>
              
              <Text style={{
                fontSize: 14,
                color: darkMode ? '#9CA3AF' : '#6B7280',
                textAlign: 'center',
                marginBottom: 24,
                lineHeight: 20,
              }}>
                Google Search cannot be embedded due to security restrictions or rate limiting. Please open the link in your browser to view job listings.
              </Text>
              
              <Pressable
                onPress={() => {
                  // Use Linking to open in external browser
                  Linking.openURL(googleSearchUrl).catch(err => {
                    console.error('Failed to open URL:', err);
                  });
                }}
                style={({ pressed }) => ({
                  backgroundColor: '#1E88E5',
                  paddingHorizontal: 32,
                  paddingVertical: 14,
                  borderRadius: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                })}
              >
                <Text style={{
                  color: '#FFFFFF',
                  fontSize: 16,
                  fontWeight: '600',
                }}>
                  Open in Browser
                </Text>
                <Text style={{
                  color: '#FFFFFF',
                  fontSize: 16,
                }}>→</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <>
            {loading && (
              <View style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: [{ translateX: -20 }, { translateY: -20 }],
                zIndex: 10,
              }}>
                <ActivityIndicator size="large" color="#1E88E5" />
              </View>
            )}
            
            <WebView
              source={{ uri: googleSearchUrl }}
              style={{ flex: 1 }}
              onLoadStart={() => {
                setLoading(true);
                setWebViewError(false);
              }}
              onLoadEnd={() => setLoading(false)}
              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.warn('WebView error: ', nativeEvent);
                setLoading(false);
                // Show error for any WebView error (Google blocks embedding)
                setWebViewError(true);
              }}
              onHttpError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.warn('WebView HTTP error: ', nativeEvent);
                setLoading(false);
                
                // Handle specific error codes
                if (nativeEvent.statusCode === 429) {
                  // Rate limited - show specific message
                  setWebViewError(true);
                } else if (nativeEvent.statusCode >= 400) {
                  // Other HTTP errors
                  setWebViewError(true);
                }
              }}
              onLoadEnd={(syntheticEvent) => {
                setLoading(false);
                // Check if page actually loaded or was blocked
                const { nativeEvent } = syntheticEvent;
                
                // Check if Google redirected to "sorry" page (rate limiting)
                if (nativeEvent.url && nativeEvent.url.includes('google.com/sorry')) {
                  console.warn('Google rate limit detected - redirecting to sorry page');
                  setWebViewError(true);
                  return;
                }
                
                // If URL is still Google search, it might be blocked
                if (nativeEvent.url && nativeEvent.url.includes('google.com')) {
                  // Give it a moment, then check if content is actually there
                  setTimeout(() => {
                    // If we're still here and no error, but content might be blocked
                    // The timeout in useEffect will handle this
                  }, 1000);
                }
              }}
              onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
              onMessage={handleMessage}
              injectedJavaScript={interceptClicks}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              scalesPageToFit={true}
              userAgent={Platform.OS === 'ios' 
                ? "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
                : "Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36"}
              sharedCookiesEnabled={true}
              thirdPartyCookiesEnabled={true}
            />
          </>
        )}
      </View>
      
      <BottomSheet
        visible={bottomSheetVisible}
        url={selectedUrl}
        onClose={() => {
          setBottomSheetVisible(false);
          setSelectedUrl(null);
        }}
        darkMode={darkMode}
      />
    </View>
  );
};

export default JobsScreen;
