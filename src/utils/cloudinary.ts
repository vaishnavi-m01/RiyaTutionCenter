import axios from 'axios';

// Replace these with your Cloudinary credentials
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dxqrfqirc/image/upload';
const UPLOAD_PRESET = 'riyaTution';

export const uploadToCloudinary = async (fileUri: string): Promise<string | null> => {
    if (!fileUri) return null;

    const formData = new FormData();
    formData.append('file', {
        uri: fileUri,
        type: 'image/jpeg',
        name: 'upload.jpg',
    } as any);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
        console.log('Uploading to Cloudinary...');
        const response = await axios.post(CLOUDINARY_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.data && response.data.secure_url) {
            console.log('Cloudinary Upload Success:', response.data.secure_url);
            return response.data.secure_url;
        }
        return null;
    } catch (error: any) {
        console.error('Cloudinary Upload Error:', error?.response?.data || error.message);
        return null;
    }
};
