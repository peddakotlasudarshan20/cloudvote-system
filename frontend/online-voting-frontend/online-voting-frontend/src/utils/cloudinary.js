const CLOUD_NAME = 'egzikie3'
const UPLOAD_PRESET = 'voting_app'

/**
 * Upload a file to Cloudinary using an unsigned upload preset.
 * @param {File} file - The file object to upload
 * @param {function} onProgress - Optional callback(percent) for upload progress
 * @returns {Promise<string>} - Resolves to the secure_url of the uploaded image
 */
export async function uploadToCloudinary(file, onProgress) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', 'voting_app')

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`)

    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100))
        }
      })
    }

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText)
        resolve(data.secure_url)
      } else {
        reject(new Error('Upload failed: ' + xhr.statusText))
      }
    })

    xhr.addEventListener('error', () => reject(new Error('Network error during upload')))
    xhr.send(formData)
  })
}
