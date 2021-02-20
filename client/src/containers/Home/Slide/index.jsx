import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Slide1 from "assests/slide1.jpg";
import Slide2 from "assests/slide2.jpg";
import Slide3 from "assests/slide3.jpg";

function Slider() {
  return (
    <Carousel autoPlay infiniteLoop axis="horizontal" showThumbs="false">
      <div>
        <img src={Slide2} alt="image2" />
        <p className="legend" style={{ background: "#d1ced4", color: "black" }}>
          Welcome to the ESLSCA University Egypt Portal
        </p>
      </div>
      <div>
        <img src={Slide3} alt="image3" />
        <p className="legend" style={{ background: "#d1ced4", color: "black" }}>
          Welcome to the ESLSCA University Egypt Portal
        </p>
      </div>
      <div>
        <img src={Slide1} alt="image1" />
        <p className="legend" style={{ background: "#d1ced4", color: "black" }}>
          Welcome to the ESLSCA University Egypt Portal
        </p>
      </div>
    </Carousel>
  );
}

export default Slider;
