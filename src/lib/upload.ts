import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

import { storage } from "./firebase";

const upload = async (file: File) => {
  // Determine the folder based on file type
  const isImage = file.type.startsWith("image/");
  const folder = isImage ? "images" : "files";

  // Creating the storage reference with the image name
  const storageRef = ref(
    storage,
    `${folder}/${Date.now()}-${file.name.toLowerCase().replaceAll(" ", "-")}`
  );

  // Uploading the file we got in the form
  const uploadTask = uploadBytesResumable(storageRef, file);

  // Create promise for the upload task
  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // eslint-disable-next-line no-unused-vars
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      // Reject on error
      (error) => {
        reject("Something went wrong!" + error.code);
      },
      // Resolve on success
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};

export default upload;
