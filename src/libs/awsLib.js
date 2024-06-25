import { remove, downloadData, uploadData } from 'aws-amplify/storage';

export async function s3Upload({ filename, file }) {
  console.log('filename', filename);
  const operation = uploadData({
    path: `public/${Date.now()}-${filename}`,
    data: file,
    options: {
      contentType: file.type
    }
  });
  const { path } = await operation.result;
  return path;
};
// export async function s3Upload(file) {
//   const filename = `${Date.now()}-${file.name}`;
//   const stored = await uploadData(filename, file, {
//     contentType: file.type,
//     level: 'public'
//   });
//   return stored.key;
// };

export async function s3Delete(filename) {
  const { path } = await remove({ path: filename });
  console.log('path', path);
  return path;
  // const removed = await Storage.vault.remove(filename);
  // return removed.key;
};

export async function s3FileURL(filename) {
  const result = await downloadData({
    path: `${filename}`
  }).result;
  // console.log('result', result);
  const file = new File([result.body], filename, { type: result.contentType || 'application/octet-stream' });
  return file;
};
// export async function s3FileURL(filename) {
//   const fileURL = await downloadData({ path: `public/${filename}` });
//   return fileURL.body;
// };
