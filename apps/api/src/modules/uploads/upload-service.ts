import cloudinary from "../../lib/cloudinary";

export const uploadService = {

  async deleteFile(publicId: string) {

    return cloudinary.uploader.destroy(publicId);

  },

  async replaceFile(

    oldPublicId: string | null | undefined,

    newPublicId: string

  ) {

    if (oldPublicId) {

      await cloudinary.uploader.destroy(

        oldPublicId

      );

    }

    return newPublicId;

  },

  getPublicId(url: string) {

  const split =

    url.split("/upload/");

  if (split.length < 2) {

    return null;

  }

  let publicId = split[1] ?? "";

  publicId = publicId.replace(

    /^v\d+\//,

    ""

  );

  publicId = publicId.substring(

    0,

    publicId.lastIndexOf(".")

  );

  return publicId;

},

};