import React from 'react';

export default function Footer() {
  return (
    <div className="ahrq">
      <footer>
        <div className="row row-side-margins hide-on-desktop">
          <div className="col-sm-12" id="top-button-container">
            <a href="#maincontent" id="top-button">
              Back to Top
              <img
                alt="Go back to top"
                height="25"
                src={`${process.env.PUBLIC_URL}/assets/images/chevron-circle-up-solid.png`}
                width="25"
              />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
