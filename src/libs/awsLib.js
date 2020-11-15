import { Storage } from 'aws-amplify';

export async function s3Upload(file) {
  const filename = `${Date.now()}-${file.name}`;
  const stored = await Storage.vault.put(filename, file, {
    contentType: file.type
  });
  return stored.key;
};

export async function s3Delete(filename) {
  const removed = await Storage.vault.remove(filename);
  return removed.key;
};

export async function s3FileURL(filename) {
  const fileURL = await Storage.vault.get(filename);
  return fileURL;
};
