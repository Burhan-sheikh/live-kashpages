import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase/config';

/**
 * Upload user profile image
 */
export async function uploadProfileImage(userId: string, file: File) {
  try {
    const storageRef = ref(storage, `users/${userId}/profile/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return { url, error: null };
  } catch (error: any) {
    return { url: null, error: error.message };
  }
}

/**
 * Upload shop cover image
 */
export async function uploadShopCover(shopId: string, file: File) {
  try {
    const storageRef = ref(storage, `shops/${shopId}/cover/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return { url, error: null };
  } catch (error: any) {
    return { url: null, error: error.message };
  }
}

/**
 * Upload shop gallery image
 */
export async function uploadGalleryImage(shopId: string, file: File) {
  try {
    const timestamp = Date.now();
    const storageRef = ref(storage, `shops/${shopId}/gallery/${timestamp}_${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return { url, error: null };
  } catch (error: any) {
    return { url: null, error: error.message };
  }
}

/**
 * Upload SEO image
 */
export async function uploadSEOImage(shopId: string, file: File) {
  try {
    const storageRef = ref(storage, `shops/${shopId}/seo/og-image.${file.name.split('.').pop()}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return { url, error: null };
  } catch (error: any) {
    return { url: null, error: error.message };
  }
}

/**
 * Upload favicon
 */
export async function uploadFavicon(shopId: string, file: File) {
  try {
    const storageRef = ref(storage, `shops/${shopId}/seo/favicon.ico`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return { url, error: null };
  } catch (error: any) {
    return { url: null, error: error.message };
  }
}

/**
 * Delete file from storage
 */
export async function deleteFile(fileUrl: string) {
  try {
    const storageRef = ref(storage, fileUrl);
    await deleteObject(storageRef);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}
