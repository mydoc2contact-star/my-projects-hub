export type StorageFile = {
  url: string;
  key: string;
};

export interface StorageProvider {
  upload(file: File, folder?: string): Promise<StorageFile>;
  remove(urlOrKey: string): Promise<void>;
}
