const API_KEY = "AIzaSyBM58htiqa4l4uyMrk3RSQ59amsomCnEKo";

export const searchPoly = async (keywords: string): Promise<any> => {
  var url = `https://poly.googleapis.com/v1/assets?keywords=${keywords}&format=GLTF2&key=${API_KEY}&maxComplexity=MEDIUM&pageSize=1`;

  const response = await fetch(url);
  const json = await response.json();
  console.log(json);
  return json;
};
