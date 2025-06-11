import { saveFileToCloudinary } from './saveFileToCloudinary.js';
import { saveFileToUploadDir } from './saveFileToUploadDir.js';
import { getEnvVar } from './getEnvVar.js';

export const getPhotoUrl = async (file) => {
  if (!file) return null;

  if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
    return await saveFileToCloudinary(file);
  } else {
    return await saveFileToUploadDir(file);
  }
};
