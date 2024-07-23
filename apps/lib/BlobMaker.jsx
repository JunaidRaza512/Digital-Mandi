const imgToBlob = async (uri) => {
  try {
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error("Failed to load image");
    }
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error("Error converting image to blob:", error);
    throw error;
  }
};

export { imgToBlob };
