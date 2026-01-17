import React from 'react';

export default function AhrqHeader() {
  // Read branding config from environment variables
  const brandingEnabled = process.env.REACT_APP_BRANDING_ENABLED === 'true';
  const imageUrl = process.env.REACT_APP_BRANDING_IMAGE_URL;
  const imageAlt = process.env.REACT_APP_BRANDING_IMAGE_ALT || 'Organization logo';
  const brandingText = process.env.REACT_APP_BRANDING_TEXT;
  const linkUrl = process.env.REACT_APP_BRANDING_LINK_URL || '#';
  const brandingColor = process.env.REACT_APP_BRANDING_COLOR || '#990000';

  // Don't render anything if branding is not enabled
  if (!brandingEnabled) {
    return null;
  }

  return (
    <div className="ahrq">
      <div className="usa-banner usa-banner-bg">
        <div className="usa-accordion usa-accordion-text-color">
          <header className="usa-banner__header">
            <div className="row no-gutters row-mobile-offset">
              <div className="col-sm-auto col-lg-auto offset-lg-1 img-icon">
                <img
                  className="usa-banner__header-flag"
                  src={`${process.env.PUBLIC_URL}/assets/images/us_flag_small.png`}
                  alt="U.S. flag"
                />
              </div>

              {imageUrl && (
                <div className="col-sm-auto col-lg-auto banner-hhs img-icon">
                  <img className="usa-banner__header-flag" src={imageUrl} alt={imageAlt} />
                </div>
              )}

              {brandingText && (
                <div className="col-sm-8 col-lg-8 txt-gov-banner">
                  <p className="usa-banner__header-text">
                    <a href={linkUrl}>{brandingText}</a>
                  </p>
                </div>
              )}
            </div>
          </header>
        </div>
      </div>

      {/* Primary header section - only show if branding text exists */}
      {brandingText && (
        <div role="banner" className="container-fluid js-quickedit-main-content">
          <div className="row">
            <header
              id="primary-header"
              className="header row-side-margins mobile-row-side-margins"
              role="heading"
              aria-level="1"
            >
              <div className="col-md-12">
                <div className="primary-header-wrapper">
                  <div className="row">
                    <div className="col-12" style={{ textAlign: 'center' }}>
                      <div className="logo-ahrq">
                        <a
                          href={linkUrl}
                          style={{
                            textDecoration: 'none',
                            color: brandingColor,
                            fontSize: '42px',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            display: 'inline-block'
                          }}
                        >
                          {brandingText}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </header>
          </div>
        </div>
      )}
    </div>
  );
}
