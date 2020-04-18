import React from "react";
import { SliderItem } from "components";
import "./style.scss";
import Slider from "react-slick";
const Scrollable = (props) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    // autoplay: true,
    // focusOnSelect: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    variableWidth: true,
  };
  return (
    <Slider {...settings} className="home-slider">
      <SliderItem style={{ width: "280px" }} />
      <SliderItem style={{ width: "280px" }} />
      <SliderItem style={{ width: "280px" }} />
    </Slider>
  );
};
export default Scrollable;
