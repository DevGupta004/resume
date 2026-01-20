import { Platform } from 'react-native';
import { isMobile, isWeb } from './platform';
import modelsConfig from '../config/models.json';

// Get default model from config
const getDefaultModel = () => {
  const defaultId = modelsConfig.defaultModelId;
  return modelsConfig.models.find(m => m.id === defaultId) || modelsConfig.models[0];
};

// Export models config
export const getModelsConfig = () => modelsConfig;
export const getDefaultModelConfig = () => getDefaultModel();

const DEFAULT_MODEL = getDefaultModel();
const DOWNLOAD_URL = DEFAULT_MODEL.url;
const MODEL_FILENAME = DEFAULT_MODEL.filename;

// Track active downloads to detect interruptions
const activeDownloads = new Map();

// Support downloading specific model by ID
export const downloadModelById = async (modelId, onProgress) => {
  if (isWeb || !isMobile) {
    throw new Error('Model download is only available on mobile devices');
  }
  
  if (!isRNFSAvailable()) {
    throw new Error('File system access not available. Please ensure react-native-fs is properly linked.');
  }
  
  const model = modelsConfig.models.find(m => m.id === modelId);
  if (!model) {
    throw new Error(`Model with id ${modelId} not found`);
  }
  
  const fs = loadRNFS();
  const modelPath = `${fs.DocumentDirectoryPath}/${model.filename}`;
  
  // Check if already exists
  const exists = await fs.exists(modelPath);
  if (exists) {
    if (onProgress) onProgress(100);
    return modelPath;
  }
  
  // Download the model using the same logic as downloadModel
  return new Promise((resolve, reject) => {
    const downloadJob = fs.downloadFile({
      fromUrl: model.url,
      toFile: modelPath,
      begin: (res) => {
        if (onProgress) onProgress(0);
      },
      progress: (res) => {
        const bytesWritten = res.bytesWritten || 0;
        const contentLength = res.contentLength || 0;
        if (contentLength > 0 && onProgress) {
          const progress = Math.round((bytesWritten / contentLength) * 100);
          onProgress(progress);
        }
      },
    });
    
    downloadJob.promise
      .then((res) => {
        if (res.statusCode === 200) {
          if (onProgress) onProgress(100);
          resolve(modelPath);
        } else {
          reject(new Error(`Download failed with status ${res.statusCode}`));
        }
      })
      .catch(reject);
  });
};

// Lazy load react-native-fs to avoid NativeEventEmitter errors
let RNFS = null;
let RNFSLoaded = false;
let RNFSLoadError = null;

/**
 * Load react-native-fs (MOBILE ONLY - NEVER RUNS ON WEB)
 */
const loadRNFS = () => {
  // STRICT CHECK: Never load on web
  if (isWeb) {
    if (!RNFSLoaded) {
      RNFSLoaded = true;
      console.log('loadRNFS: Skipped - web platform detected');
    }
    return null;
  }
  
  // Return cached result
  if (RNFSLoaded) {
    return RNFS;
  }
  
  // Don't try to load on web (double check)
  if (!isMobile || isWeb) {
    RNFSLoaded = true;
    return null;
  }

  // If we've already tried and failed, don't try again
  if (RNFSLoadError) {
    return null;
  }

  // Use a try-catch with error boundary to prevent crashes
  try {
    // Wrap require in an immediately invoked function to isolate errors
    RNFS = (() => {
      try {
        // Only require if we're on mobile and require is available
        // On web, react-native-fs is excluded via webpack alias
        if (isWeb) {
          console.log('loadRNFS: Skipping - web platform');
          return null;
        }
        
        // Check if require is available (should be on React Native)
        if (typeof require === 'undefined') {
          console.log('loadRNFS: Skipping - require undefined');
          return null;
        }
        
        console.log('loadRNFS: Attempting to require react-native-fs...');
        
        // Direct require - safe because we've already checked isWeb
        // React Native's Metro bundler will handle this correctly
        // Webpack won't bundle this because of the alias and IgnorePlugin
        const module = require('react-native-fs');
        
        console.log('loadRNFS: Module loaded:', !!module);
        console.log('loadRNFS: Module type:', typeof module);
        console.log('loadRNFS: Module keys:', module ? Object.keys(module).slice(0, 10) : 'null');
        
        // Quick validation - if DocumentDirectoryPath doesn't exist, 
        // the native module isn't linked
        if (!module || typeof module !== 'object') {
          console.warn('loadRNFS: Module is not a valid object');
          return null;
        }
        
        // Check DocumentDirectoryPath immediately to fail fast
        const docPath = module.DocumentDirectoryPath;
        console.log('loadRNFS: DocumentDirectoryPath:', docPath ? `${docPath.substring(0, 50)}...` : 'undefined');
        
        if (typeof docPath !== 'string' || docPath.length === 0) {
          console.warn('loadRNFS: DocumentDirectoryPath is not a valid string');
          return null;
        }
        
        console.log('loadRNFS: Successfully loaded react-native-fs');
        return module;
      } catch (requireError) {
        // Log the error for debugging
        console.error('loadRNFS: Require error:', requireError.message);
        console.error('loadRNFS: Error stack:', requireError.stack);
        return null;
      }
    })();
    
    // Validate RNFS if we got something back
    if (RNFS && typeof RNFS === 'object') {
      // Verify it has the methods we need
      const requiredMethods = ['exists', 'downloadFile', 'stat', 'unlink'];
      const missingMethods = requiredMethods.filter(method => typeof RNFS[method] !== 'function');
      
      if (missingMethods.length === 0 && typeof RNFS.DocumentDirectoryPath === 'string') {
        RNFSLoaded = true;
        console.log('loadRNFS: Validation passed, RNFS is ready');
        return RNFS;
      } else {
        console.warn('loadRNFS: Missing required methods:', missingMethods);
        console.warn('loadRNFS: DocumentDirectoryPath type:', typeof RNFS.DocumentDirectoryPath);
        RNFS = null;
        RNFSLoadError = new Error(`Missing required methods: ${missingMethods.join(', ')}`);
      }
    } else {
      RNFS = null;
      RNFSLoadError = new Error('react-native-fs module not available or not properly linked. The native module may need to be rebuilt. Try: cd ios && pod install && cd .. && yarn ios');
    }
  } catch (e) {
    // Catch any unexpected errors
    console.error('loadRNFS: Unexpected error:', e.message);
    console.error('loadRNFS: Error stack:', e.stack);
    RNFS = null;
    RNFSLoadError = e;
  }
  
  RNFSLoaded = true;
  return RNFS;
};

/**
 * Get model path (MOBILE ONLY)
 */
const getModelPath = async (modelId = null) => {
  // STRICT CHECK: Never return path on web
  if (isWeb || !isMobile) {
    if (isWeb) {
      console.log('getModelPath: Skipped - web platform');
    }
    return '';
  }
  
  const fs = loadRNFS();
  console.log('getModelPath - RNFS:', !!fs);
  console.log('getModelPath - DocumentDirectoryPath:', fs?.DocumentDirectoryPath);
  
  if (!fs || !fs.DocumentDirectoryPath) {
    console.log('getModelPath - Returning empty (RNFS not available)');
    return '';
  }
  
  // If specific model ID requested, return that path
  if (modelId) {
    const model = modelsConfig.models.find(m => m.id === modelId);
    if (model) {
      const fullPath = `${fs.DocumentDirectoryPath}/${model.filename}`;
      console.log('getModelPath - Specific model path:', fullPath);
      return fullPath;
    }
  }
  
  // Otherwise, find the first existing model file
  const docPath = fs.DocumentDirectoryPath;
  for (const model of modelsConfig.models) {
    const modelPath = `${docPath}/${model.filename}`;
    try {
      const exists = await fs.exists(modelPath);
      if (exists) {
        console.log('getModelPath - Found existing model:', modelPath);
        return modelPath;
      }
    } catch (err) {
      console.warn(`getModelPath - Error checking ${model.filename}:`, err);
    }
  }
  
  // Fallback to default model path
  const fullPath = `${fs.DocumentDirectoryPath}/${MODEL_FILENAME}`;
  console.log('getModelPath - Using default model path:', fullPath);
  return fullPath;
};

/**
 * Check if react-native-fs is available and properly linked (MOBILE ONLY)
 */
const isRNFSAvailable = () => {
  // STRICT CHECK: Never available on web
  if (isWeb || !isMobile) {
    return false;
  }
  
  try {
    const fs = loadRNFS();
    if (!fs) {
      return false;
    }
    
    // Check if DocumentDirectoryPath exists and is a valid string
    const docPath = fs.DocumentDirectoryPath;
    if (typeof docPath !== 'string' || docPath.length === 0) {
      console.warn('react-native-fs DocumentDirectoryPath is not valid');
      return false;
    }
    
    // Check if required methods exist
    const requiredMethods = ['exists', 'downloadFile', 'stat', 'unlink'];
    const missingMethods = requiredMethods.filter(method => typeof fs[method] !== 'function');
    
    if (missingMethods.length > 0) {
      console.warn('react-native-fs missing methods:', missingMethods);
      return false;
    }
    
    return true;
  } catch (error) {
    console.warn('Error checking RNFS availability:', error);
    return false;
  }
};

/**
 * Validate if model file is complete and not corrupted (MOBILE ONLY)
 * @param {string} modelPath - Path to the model file
 * @param {number} expectedSizeMB - Expected size in MB (optional)
 * @returns {Promise<{valid: boolean, size: number, reason?: string}>}
 */
const validateModelFile = async (modelPath, expectedSizeMB = null) => {
  if (isWeb || !isMobile || !isRNFSAvailable()) {
    return { valid: false, size: 0, reason: 'Not on mobile platform' };
  }

  try {
    const fs = loadRNFS();
    if (!fs || !fs.stat) {
      return { valid: false, size: 0, reason: 'File system not available' };
    }

    const exists = await fs.exists(modelPath);
    if (!exists) {
      return { valid: false, size: 0, reason: 'File does not exist' };
    }

    const stats = await fs.stat(modelPath);
    const sizeMB = stats.size / (1024 * 1024);

    // Check if file is too small (likely incomplete)
    // Minimum reasonable size is 50MB for any GGUF model
    if (stats.size < 50 * 1024 * 1024) {
      console.warn(`Model file too small: ${sizeMB.toFixed(2)} MB (likely incomplete)`);
      return { valid: false, size: sizeMB, reason: 'File too small, likely incomplete' };
    }

    // If expected size is provided, check against it
    if (expectedSizeMB && sizeMB < expectedSizeMB * 0.9) {
      // Allow 10% tolerance
      console.warn(`Model file size mismatch: ${sizeMB.toFixed(2)} MB vs expected ${expectedSizeMB} MB`);
      return { valid: false, size: sizeMB, reason: 'File size mismatch' };
    }

    return { valid: true, size: sizeMB };
  } catch (error) {
    console.error('Error validating model file:', error);
    return { valid: false, size: 0, reason: `Validation error: ${error.message}` };
  }
};

/**
 * Clean up incomplete or corrupted model files (MOBILE ONLY)
 * @param {string} modelPath - Path to the model file to clean up
 * @returns {Promise<boolean>}
 */
const cleanupIncompleteModel = async (modelPath) => {
  if (isWeb || !isMobile || !isRNFSAvailable()) {
    return false;
  }

  try {
    const fs = loadRNFS();
    if (!fs || !fs.unlink) {
      return false;
    }

    const exists = await fs.exists(modelPath);
    if (exists) {
      console.log(`Cleaning up incomplete model file: ${modelPath}`);
      await fs.unlink(modelPath);
      console.log('Incomplete model file deleted');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error cleaning up incomplete model:', error);
    return false;
  }
};

/**
 * Check if the model file exists locally and is valid (MOBILE ONLY)
 * Checks for any model file from the config and validates completeness
 */
export const checkModelExists = async () => {
  // STRICT CHECK: Never check on web
  if (isWeb || !isMobile || !isRNFSAvailable()) {
    if (isWeb) {
      console.log('checkModelExists: Skipped - web platform');
    }
    return false; // Only check on mobile with RNFS available
  }

  try {
    const fs = loadRNFS();
    if (!fs || !fs.DocumentDirectoryPath) {
      return false;
    }
    
    // Check for any model file from config
    const docPath = fs.DocumentDirectoryPath;
    console.log('checkModelExists - DocumentDirectoryPath:', docPath);
    console.log('checkModelExists - Checking models:', modelsConfig.models.map(m => m.filename));
    
    for (const model of modelsConfig.models) {
      const modelPath = `${docPath}/${model.filename}`;
      console.log(`checkModelExists - Checking: ${modelPath}`);
      try {
        const exists = await fs.exists(modelPath);
        console.log(`checkModelExists - ${model.filename} exists:`, exists);
        if (exists) {
          // Validate the file is complete
          const validation = await validateModelFile(modelPath, model.sizeMB);
          if (validation.valid) {
            console.log(`checkModelExists - Model found and valid: ${model.filename} (${validation.size.toFixed(2)} MB)`);
            return true;
          } else {
            console.warn(`checkModelExists - Model file incomplete/corrupted: ${validation.reason}`);
            // Clean up incomplete file
            await cleanupIncompleteModel(modelPath);
            return false;
          }
        }
      } catch (err) {
        console.error(`checkModelExists - Error checking ${model.filename}:`, err);
      }
    }
    
    // Also check default model path for backward compatibility
    const defaultModelPath = `${docPath}/${MODEL_FILENAME}`;
    const exists = await fs.exists(defaultModelPath);
    if (exists) {
      // Validate the default model file too
      const validation = await validateModelFile(defaultModelPath);
      if (validation.valid) {
        console.log(`Model found at default path: ${defaultModelPath} (${validation.size.toFixed(2)} MB)`);
        return true;
      } else {
        console.warn(`Default model file incomplete: ${validation.reason}`);
        await cleanupIncompleteModel(defaultModelPath);
        return false;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error checking model existence:', error);
    return false;
  }
};

/**
 * Get the local model path
 */
export { getModelPath };
export { loadRNFS };

/**
 * Download the model file with progress callback (MOBILE ONLY)
 * @param {Function} onProgress - Callback with progress (0-100)
 * @returns {Promise<void>}
 */
export const downloadModel = async (onProgress) => {
  // STRICT CHECK: Never allow download on web
  if (isWeb) {
    throw new Error('Model download is not available on web. This feature is mobile-only.');
  }
  
  if (!isMobile) {
    throw new Error('Model download is only available on mobile devices (iOS/Android)');
  }

  // Check RNFS availability with detailed error message
  if (!isRNFSAvailable()) {
    const fs = loadRNFS();
    let errorMsg = 'File system access not available. ';
    
    if (!fs) {
      errorMsg += 'react-native-fs module is not loaded. ';
    } else if (!fs.DocumentDirectoryPath) {
      errorMsg += 'DocumentDirectoryPath is not available. ';
    } else {
      errorMsg += 'Some required methods are missing. ';
    }
    
    errorMsg += 'Please ensure react-native-fs is properly linked. ';
    errorMsg += 'For iOS: cd ios && pod install && cd .. && yarn ios';
    
    throw new Error(errorMsg);
  }

  try {
    const fs = loadRNFS();
    const modelPath = await getModelPath();
    
    console.log('=== MODEL DOWNLOAD DEBUG ===');
    console.log('RNFS available:', !!fs);
    console.log('Model path:', modelPath);
    console.log('DocumentDirectoryPath:', fs?.DocumentDirectoryPath);
    console.log('Model filename:', MODEL_FILENAME);
    console.log('Download URL:', DOWNLOAD_URL);
    console.log('===========================');
    
    if (!modelPath) {
      throw new Error('Unable to determine model storage path');
    }

    // Check if already exists
    const exists = await checkModelExists();
    console.log('Model already exists:', exists);
    if (exists) {
      if (onProgress) onProgress(100);
      return modelPath;
    }

    console.log('Starting download from:', DOWNLOAD_URL);
    console.log('Saving to:', modelPath);
    console.log('Full path:', modelPath);

    // Track this download
    const downloadId = `${modelPath}-${Date.now()}`;
    activeDownloads.set(downloadId, {
      path: modelPath,
      startTime: Date.now(),
      lastProgress: 0,
    });

    // Track progress updates
    let lastProgressUpdate = 0;
    let hasReceivedProgress = false;
    
    // Create download promise with improved progress tracking
    const downloadPromise = fs.downloadFile({
      fromUrl: DOWNLOAD_URL,
      toFile: modelPath,
      begin: (res) => {
        console.log('Download begin callback. Content length:', res.contentLength);
        if (onProgress) onProgress(0);
      },
      progress: (res) => {
        hasReceivedProgress = true;
        const bytesWritten = res.bytesWritten || 0;
        const contentLength = res.contentLength || 0;
        
        console.log(`Download progress: ${bytesWritten} / ${contentLength} bytes`);
        
        if (contentLength > 0) {
          const progress = Math.round((bytesWritten / contentLength) * 100);
          lastProgressUpdate = progress;
          console.log(`Progress: ${progress}%`);
          
          // Update active download tracking
          const downloadInfo = activeDownloads.get(downloadId);
          if (downloadInfo) {
            downloadInfo.lastProgress = progress;
            downloadInfo.lastUpdate = Date.now();
          }
          
          if (onProgress) {
            onProgress(progress);
          }
        } else if (bytesWritten > 0) {
          // If contentLength is not available yet, show indeterminate progress
          // Show at least 1% to indicate download is happening
          if (onProgress) {
            onProgress(1);
          }
        }
      },
    });

    // Monitor for stalled downloads
    const startTime = Date.now();
    const progressCheckInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (!hasReceivedProgress && elapsed > 15000) {
        console.warn('No progress received after 15 seconds - download may be stalled');
      }
    }, 5000);

    // Wait for download to complete
    let result;
    try {
      result = await downloadPromise.promise;
      clearInterval(progressCheckInterval);
      
      // Remove from active downloads tracking
      activeDownloads.delete(downloadId);
      
      // Ensure we show 100% on completion
      if (onProgress && result.statusCode === 200) {
        onProgress(100);
      }
    } catch (error) {
      clearInterval(progressCheckInterval);
      
      // Remove from active downloads tracking
      activeDownloads.delete(downloadId);
      
      console.error('Download error details:', error);
      console.warn('Download was interrupted or failed - cleaning up incomplete file');
      
      // Clean up incomplete file on error
      try {
        const exists = await fs.exists(modelPath);
        if (exists) {
          console.log('Cleaning up incomplete download due to error');
          await fs.unlink(modelPath);
          console.log('Incomplete download cleaned up successfully');
        }
      } catch (cleanupError) {
        console.warn('Failed to clean up incomplete download:', cleanupError);
      }
      
      throw error;
    }

    if (result && result.statusCode === 200) {
      // Validate the downloaded file is complete
      const validation = await validateModelFile(modelPath);
      if (!validation.valid) {
        // Clean up incomplete file
        await cleanupIncompleteModel(modelPath);
        throw new Error(`Downloaded file is incomplete: ${validation.reason}. Please try downloading again.`);
      }
      
      console.log('Model downloaded successfully to:', modelPath);
      console.log(`File size: ${validation.size.toFixed(2)} MB`);
      if (onProgress) onProgress(100);
      return modelPath;
    } else if (result && result.statusCode) {
      // Clean up incomplete file on non-200 status
      try {
        const exists = await fs.exists(modelPath);
        if (exists) {
          console.log('Cleaning up incomplete download (non-200 status)');
          await fs.unlink(modelPath);
        }
      } catch (cleanupError) {
        console.warn('Failed to clean up incomplete download:', cleanupError);
      }
      throw new Error(`Download failed with status code: ${result.statusCode}`);
    } else {
      // Clean up on unknown error
      try {
        const exists = await fs.exists(modelPath);
        if (exists) {
          console.log('Cleaning up incomplete download (unknown error)');
          await fs.unlink(modelPath);
        }
      } catch (cleanupError) {
        console.warn('Failed to clean up incomplete download:', cleanupError);
      }
      throw new Error('Download failed: Unknown error');
    }
  } catch (error) {
    console.error('Error downloading model:', error);
    throw error;
  }
};

/**
 * Get model file size in MB (MOBILE ONLY)
 */
export const getModelSize = async () => {
  // STRICT CHECK: Never check on web
  if (isWeb || !isMobile || !isRNFSAvailable()) {
    if (isWeb) {
      console.log('getModelSize: Skipped - web platform');
    }
    return 0;
  }

  try {
    const exists = await checkModelExists();
    if (!exists) {
      // Approximate size from URL (Q3_K_L is around 1.1GB)
      return 1100; // MB
    }

    const fs = loadRNFS();
    const modelPath = await getModelPath();
    if (!modelPath) {
      return 1100;
    }

    const stat = await fs.stat(modelPath);
    return Math.round(stat.size / (1024 * 1024)); // Convert to MB
  } catch (error) {
    console.error('Error getting model size:', error);
    return 1100; // Default approximate size
  }
};

/**
 * Delete the downloaded model file (MOBILE ONLY)
 */
export const deleteModel = async () => {
  // STRICT CHECK: Never delete on web
  if (isWeb || !isMobile || !isRNFSAvailable()) {
    if (isWeb) {
      console.log('deleteModel: Skipped - web platform');
    }
    return false;
  }

  try {
    const exists = await checkModelExists();
    if (exists) {
      const fs = loadRNFS();
      const modelPath = await getModelPath();
      if (modelPath) {
        await fs.unlink(modelPath);
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Error deleting model:', error);
    return false;
  }
};

/**
 * Clean up any incomplete downloads on app start
 * This handles cases where the app was killed during download
 */
export const cleanupIncompleteDownloads = async () => {
  if (isWeb || !isMobile || !isRNFSAvailable()) {
    return;
  }

  try {
    const fs = loadRNFS();
    if (!fs || !fs.DocumentDirectoryPath) {
      return;
    }

    const docPath = fs.DocumentDirectoryPath;
    
    // Check all model files and clean up incomplete ones
    for (const model of modelsConfig.models) {
      const modelPath = `${docPath}/${model.filename}`;
      const exists = await fs.exists(modelPath);
      
      if (exists) {
        const validation = await validateModelFile(modelPath);
        if (!validation.valid) {
          console.log(`Found incomplete model file: ${model.filename} - cleaning up`);
          await cleanupIncompleteModel(modelPath);
        }
      }
    }
    
    // Also check default model path
    const defaultModelPath = `${docPath}/${MODEL_FILENAME}`;
    const exists = await fs.exists(defaultModelPath);
    if (exists) {
      const validation = await validateModelFile(defaultModelPath);
      if (!validation.valid) {
        console.log('Found incomplete default model file - cleaning up');
        await cleanupIncompleteModel(defaultModelPath);
      }
    }
  } catch (error) {
    console.error('Error cleaning up incomplete downloads:', error);
  }
};

/**
 * Diagnostic function to check RNFS status
 * Useful for debugging linking issues
 */
export const diagnoseRNFS = () => {
  if (!isMobile) {
    return {
      available: false,
      reason: 'Not on mobile platform',
      details: 'This function only works on mobile devices',
    };
  }

  const fs = loadRNFS();
  const details = {
    moduleLoaded: !!fs,
    documentDirectoryPath: fs?.DocumentDirectoryPath || 'not available',
    hasExists: typeof fs?.exists === 'function',
    hasDownloadFile: typeof fs?.downloadFile === 'function',
    hasStat: typeof fs?.stat === 'function',
    hasUnlink: typeof fs?.unlink === 'function',
    error: RNFSLoadError?.message || null,
  };

  return {
    available: isRNFSAvailable(),
    reason: details.error || (details.moduleLoaded ? 'Module loaded but missing methods' : 'Module not loaded'),
    details,
  };
};
