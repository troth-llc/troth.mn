import React from "react";
import { SliderItem } from "components";
import "./style.scss";
import Slider from "react-slick";
const Scrollable = (props) => {
  const projects = [
    {
      title: "Hello world",
      src: require("assets/image/project/project.png"),
      progress: 20,
      funded: 350,
    },
    {
      title: "Hello Troth",
      src: require("assets/image/project/project.png"),
      progress: 81,
      funded: 52,
    },
    {
      title: "testing",
      src: require("assets/image/project/project.png"),
      progress: 67,
      funded: 977,
    },
  ];
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    variableWidth: true,
    pauseOnHover: true,
  };
  return (
    <Slider {...settings} className="home-slider">
      {projects.map((project, index) => (
        <SliderItem key={index} style={{ width: "280px" }} {...project} />
      ))}
    </Slider>
  );
};
export default Scrollable;
