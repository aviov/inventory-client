import { Storage } from 'aws-amplify';

export async function s3Upload(file) {
  const filename = `${Date.now()}-${file.name}`;
  const stored = await Storage.put(filename, file, {
    contentType: file.type,
    level: 'public'
  });
  return stored.key;
};

export async function s3Delete(filename) {
  await Storage.remove(filename);
  return filename;
  // const removed = await Storage.vault.remove(filename);
  // console.log('removed', removed);
  // return removed.key;
};

export async function s3FileURL(filename) {
  const fileURL = await Storage.get(filename);
  return fileURL;
};
