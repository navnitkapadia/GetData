import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons

// core components
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Parallax from "components/Parallax/Parallax.jsx";

import aboutPageStyle from "assets/jss/material-kit-react/views/aboutusPage.jsx";

// Sections for this page
import ProductSection from "./Sections/ProductSection.jsx";
import TeamSection from "./Sections/TeamSection.jsx";

const dashboardRoutes = [];

class AboutusPage extends React.Component {
  render() {
    const { classes, ...rest } = this.props;
    return (
      <div>
        <Header
          color="transparent"
          routes={dashboardRoutes}
          brand="Get Data"
          rightLinks={<HeaderLinks />}
          fixed
          changeColorOnScroll={{
            height: 400,
            color: "white"
          }}
          {...rest}
        />
        <Parallax filter image={require("assets/img/landing-bg.jpg")}>
          <div className={classes.container}>
            <GridContainer alignItems="center"  alignContent="center">
              <GridItem xs={12} sm={12} md={12} >
                <h1 className={classes.title}>About Us</h1>
                <h4 className={classes.aboutSub}>
                Meet the amazing team behind this project and find out more about how we work.
                </h4>
              </GridItem>
            </GridContainer>
          </div>
        </Parallax>
        <div className={classNames(classes.main, classes.mainRaised)}>
          <div className={classes.container}>
            <h5>This is the paragraph where you can write more details about your product. Keep you user engaged by providing meaningful information. Remember that by this time, the user is curious, otherwise he wouldn't scroll to get here. Add a button if you want the user to see more.</h5>
            <ProductSection /> 
            <TeamSection />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withStyles(aboutPageStyle)(AboutusPage);
