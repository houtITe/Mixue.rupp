import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./config";

// Uploads a file to Firebase Storage under the given folder and returns
// its public download URL. Filenames are prefixed with a timestamp so
// repeated uploads never collide.
export async function uploadImage(file: File, folder: string): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const path = `${folder}/${Date.now()}-${safeName}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
