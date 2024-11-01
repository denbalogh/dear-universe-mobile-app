import { ImageRequireSource } from "react-native";

const images = [
  require("../../assets/images/photos/1.jpg"),
  require("../../assets/images/photos/2.jpg"),
  require("../../assets/images/photos/3.jpg"),
  require("../../assets/images/photos/4.jpg"),
  require("../../assets/images/photos/5.jpg"),
  require("../../assets/images/photos/6.jpg"),
  require("../../assets/images/photos/7.jpg"),
  require("../../assets/images/photos/8.jpg"),
  require("../../assets/images/photos/9.jpg"),
  require("../../assets/images/photos/10.jpg"),
];

export const getRandomImage = () => {
  return images[Math.floor(Math.random() * images.length)];
};

export const getRandomImages = (count: number) => {
  return Array.from({ length: count }, () => getRandomImage()).map(
    (source: ImageRequireSource) => ({ source }),
  );
};
