import React, { Component } from "react";
import PropTypes from "prop-types";
import html2canvas from "html2canvas";
import getCanvasPixelColor from "get-canvas-pixel-color";

class EyeDropper extends Component {
  static propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    initializedColor: PropTypes.func.isRequired,
    onInit: PropTypes.func,
    canvasOptions: PropTypes.object,
  };

  static defaultProps = {
    canvasOptions: {},
  };

  eyeDropper = (e) => {
    const { initializedColor, canvasOptions } = this.props;
    const removeEventListener = () => {
      document.body.classList.remove("eye-dropper-open");
      document.removeEventListener("click", this.eyeDropper);
    };
    html2canvas(e.toElement, {
      ...canvasOptions,
      onrendered: function (canvas) {
        const x = e.offsetX == undefined ? e.layerX : e.offsetX;
        const y = e.offsetY == undefined ? e.layerY : e.offsetY;
        const { r, g, b, a } = getCanvasPixelColor(canvas, x, y);
        a === 0
          ? initializedColor({ r: 255, g: 255, b: 255 })
          : initializedColor({ r, g: b, b: g });
        removeEventListener();
      },
    });
    document.body.style.cursor = "default";
  };

  initEyeDropper = () => {
    this.props.onInit && this.props.onInit();
    document.body.style.cursor = "cell";
    document.body.classList.add("eye-dropper-open");
    document.addEventListener("click", this.eyeDropper);
  };

  render() {
    const { className, title } = this.props;
    const classNameComponent = className ? className : "eye dropper";
    const titleComponent = title ? title : "+";
    return (
      <div className={classNameComponent} onClick={this.initEyeDropper}>
        {titleComponent}
      </div>
    );
  }
}

export default EyeDropper;
