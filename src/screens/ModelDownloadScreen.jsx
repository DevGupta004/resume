import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Modal, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { getModelsConfig, getDefaultModelConfig, loadRNFS } from '../utils/modelManager';
import { checkModelExists, downloadModelById, deleteModel } from '../utils/modelManager';

const ModelDownloadScreen = ({ darkMode = false, onBack }) => {
  const insets = useSafeAreaInsets();
  const bgColor = darkMode ? '#111827' : '#FFFFFF';
  const textColor = darkMode ? '#E5E7EB' : '#111827';
  const borderColor = darkMode ? '#374151' : '#E5E7EB';
  const cardBg = darkMode ? '#1F2937' : '#F9FAFB';
  
  const [models] = useState(getModelsConfig().models);
  const [downloadingModelId, setDownloadingModelId] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadedModelId, setDownloadedModelId] = useState(null);

  // Check which model is downloaded
  useEffect(() => {
    const checkDownloaded = async () => {
      try {
        // First check if any model exists
        const exists = await checkModelExists();
        if (!exists) {
          setDownloadedModelId(null);
          return;
        }

        // If model exists, find which one by checking each model file
        const fs = loadRNFS();
        if (!fs || !fs.DocumentDirectoryPath) {
          setDownloadedModelId(null);
          return;
        }

        const docPath = fs.DocumentDirectoryPath;
        for (const model of models) {
          const modelPath = `${docPath}/${model.filename}`;
          try {
            const modelExists = await fs.exists(modelPath);
            if (modelExists) {
              setDownloadedModelId(model.id);
              return;
            }
          } catch (err) {
            console.warn(`Error checking ${model.filename}:`, err);
          }
        }

        // Check default model as fallback
        const defaultModel = getDefaultModelConfig();
        const defaultModelPath = `${docPath}/${defaultModel.filename}`;
        try {
          const defaultExists = await fs.exists(defaultModelPath);
          if (defaultExists) {
            setDownloadedModelId(defaultModel.id);
          } else {
            setDownloadedModelId(null);
          }
        } catch (err) {
          console.warn(`Error checking default model:`, err);
          setDownloadedModelId(null);
        }
      } catch (error) {
        console.error('Error checking downloaded model:', error);
        setDownloadedModelId(null);
      }
    };
    checkDownloaded();
  }, [models]);

  const handleDownload = async (modelId) => {
    setDownloadingModelId(modelId);
    setDownloadProgress(0);
    setShowDownloadModal(true);

    try {
      await downloadModelById(modelId, (progress) => {
        setDownloadProgress(progress);
      });

      setDownloadedModelId(modelId);
      setShowDownloadModal(false);
      Alert.alert(
        'Download Complete!',
        'Model downloaded successfully! You can now use offline AI.',
        [
          {
            text: 'Stay Here',
            style: 'cancel',
          },
          {
            text: 'Go to Chat',
            onPress: () => {
              if (onBack) {
                onBack();
              }
            },
            style: 'default',
          },
        ]
      );
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert(
        'Download Failed',
        error.message || 'Failed to download the model. Please check your internet connection and try again.'
      );
    } finally {
      setDownloadingModelId(null);
      setDownloadProgress(0);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Model',
      'Are you sure you want to delete the downloaded model? You will need to download it again to use offline AI.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const deleted = await deleteModel();
              if (deleted) {
                setDownloadedModelId(null);
                Alert.alert('Success', 'Model deleted successfully.');
              } else {
                Alert.alert('Error', 'Failed to delete the model.');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete the model.');
            }
          },
        },
      ]
    );
  };

  // Header height is 56 + insets.top (from TopHeader component)
  const headerHeight = 56 + insets.top;

  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      {/* Back Button - Positioned below header */}
      <View
        style={{
          paddingTop: headerHeight + 12,
          paddingBottom: 12,
          paddingHorizontal: 16,
          backgroundColor: bgColor,
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        }}
      >
        <Pressable 
          onPress={onBack} 
          style={{ 
            alignSelf: 'flex-start',
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 24,
            backgroundColor: darkMode ? '#1F2937' : '#F3F4F6',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 44,
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="arrow-left" size={18} color={textColor} style={{ marginRight: 6 }} />
          <Text style={{ fontSize: 15, fontWeight: '600', color: textColor }}>Back</Text>
        </Pressable>
      </View>

      {/* Models List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: textColor, marginBottom: 8 }}>
          Download AI Model
        </Text>
        <Text style={{ fontSize: 14, color: darkMode ? '#9CA3AF' : '#6B7280', marginBottom: 16 }}>
          Choose an AI model to download for offline use. Larger models may provide better responses but require more storage.
        </Text>

        {models.map((model) => {
          const isDownloaded = downloadedModelId === model.id;
          const isDownloading = downloadingModelId === model.id;

          return (
            <View
              key={model.id}
              style={{
                backgroundColor: cardBg,
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: borderColor,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: textColor, marginRight: 8 }}>
                      {model.name}
                    </Text>
                    {model.recommended && (
                      <View style={{ backgroundColor: '#10B981', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }}>
                        <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#FFFFFF' }}>RECOMMENDED</Text>
                      </View>
                    )}
                  </View>
                  <Text style={{ fontSize: 14, color: darkMode ? '#9CA3AF' : '#6B7280', marginBottom: 8 }}>
                    {model.description}
                  </Text>
                  <Text style={{ fontSize: 12, color: darkMode ? '#6B7280' : '#9CA3AF' }}>
                    Size: {model.size}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                {isDownloaded ? (
                  <>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#10B981', paddingVertical: 12, borderRadius: 8 }}>
                      <Icon name="check-circle" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                      <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Downloaded</Text>
                    </View>
                    <Pressable
                      onPress={handleDelete}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        borderRadius: 8,
                        backgroundColor: darkMode ? '#374151' : '#EF4444',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon name="trash-2" size={16} color="#FFFFFF" />
                    </Pressable>
                  </>
                ) : (
                  <Pressable
                    onPress={() => handleDownload(model.id)}
                    disabled={isDownloading}
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isDownloading ? (darkMode ? '#374151' : '#D1D5DB') : '#1E88E5',
                      paddingVertical: 12,
                      borderRadius: 8,
                    }}
                  >
                    {isDownloading ? (
                      <>
                        <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
                        <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Downloading...</Text>
                      </>
                    ) : (
                      <>
                        <Icon name="download" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                        <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Download</Text>
                      </>
                    )}
                  </Pressable>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Download Progress Modal */}
      <Modal
        visible={showDownloadModal}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ backgroundColor: bgColor, borderRadius: 16, padding: 24, width: '100%', maxWidth: 400 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: textColor, marginBottom: 16, textAlign: 'center' }}>
              Downloading Model
            </Text>
            <View style={{ height: 8, backgroundColor: darkMode ? '#374151' : '#E5E7EB', borderRadius: 4, marginBottom: 16, overflow: 'hidden' }}>
              <View
                style={{
                  height: '100%',
                  width: `${downloadProgress}%`,
                  backgroundColor: '#1E88E5',
                  borderRadius: 4,
                }}
              />
            </View>
            <Text style={{ fontSize: 14, color: darkMode ? '#9CA3AF' : '#6B7280', textAlign: 'center' }}>
              {downloadProgress}% complete
            </Text>
            {downloadProgress === 0 && (
              <Text style={{ fontSize: 12, color: darkMode ? '#6B7280' : '#9CA3AF', textAlign: 'center', marginTop: 8 }}>
                Connecting to server...
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ModelDownloadScreen;
