import { Storage } from 'aws-amplify';

export async function s3Upload(files) {
  const attachments = await Promise.all(files.map(async ({ file }) => {
    console.log(file);
    const filename = `${Date.now()}-${file.name}`;
    const stored = await Storage.vault.put(filename, file, {
      contentType: file.type
    });
    return stored.key;
  }));
  return attachments;
  // const filename = `${Date.now()}-${file.name}`;
  // const stored = await Storage.vault.put(filename, file, {
  //   contentType: file.type
  // });
  // return stored.key;
};

export async function s3Delete(filenames) {
  const attachments = await Promise.all(filenames.map(async (filename) => {
    const removed = await Storage.vault.remove(filename);
    return removed.key;
  }));
  return attachments;
  // const removed = await Storage.vault.remove(filename);
  // return removed.key;
};

export async function s3FileURL(filename) {
  const fileURL = await Storage.vault.get(filename);
  return fileURL;
};
