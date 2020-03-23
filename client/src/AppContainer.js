import React, { Component } from "react";
import { withRouter } from "react-router";
import { MDCTextField } from "@material/textfield";
import { MDCRipple } from "@material/ripple";
class App extends Component {
  componentDidMount() {
    this.ripple();
  }
  componentDidUpdate() {
    this.ripple();
  }
  ripple = () => {
    const ripples = document.querySelectorAll(
      ".mdc-button, .mdc-fab ,.mdc-list ,.mdc-menu"
    );
    const icons = document.querySelectorAll(".mdc-icon-button");
    icons.forEach(icon => (new MDCRipple(icon).unbounded = true));
    ripples.forEach(ripple => new MDCRipple(ripple));
    // input ripple
    const textfields = document.querySelectorAll(".mdc-text-field");
    textfields.forEach(textfield => new MDCTextField(textfield));
  };
  // componentWillUnmount() {
  //   this.unlisten();
  // }
  render() {
    return <div>{this.props.children}</div>;
  }
}
export default withRouter(App);
