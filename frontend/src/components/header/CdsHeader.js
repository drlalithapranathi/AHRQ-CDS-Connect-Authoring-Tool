import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';

import { Login, Logout } from 'components/auth';
import darkTheme from 'styles/theme';

const CdsHeader = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const [appHeader, setAppHeader] = useState({
    titleTop: 'Clinical Decision Support',
    titleBottom: 'Authoring Tool',
    alertMessage: '',
    homeLink: '',
    homeLinkText: 'Home'
  });

  useEffect(() => {
    // Fetch app header config from API at runtime
    fetch(`${process.env.REACT_APP_API_URL}/config`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch config');
        }
        return response.json();
      })
      .then(config => {
        if (config.appHeader) {
          setAppHeader(config.appHeader);
        }
      })
      .catch(error => {
        console.error('Error fetching app header config:', error);
      });
  }, []);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={darkTheme}>
        {appHeader.alertMessage && (
          <div className="cds-header-alert" dangerouslySetInnerHTML={{ __html: appHeader.alertMessage }} />
        )}
        <header className="cds-header">
          <div className="cds-header__cdsbanner">
            <div className="cds-header__cdsbanner-wrapper">
              <div className="cds-header__cdsbanner-text">
                <a href="/" alt="home">
                  <div className="text-top">{appHeader.titleTop}</div>
                  <div className="text-bottom">{appHeader.titleBottom}</div>
                </a>
              </div>

              <div className="cds-header__cdsbanner-auth">
                {appHeader.homeLink && (
                  <a href={appHeader.homeLink} className="cds-home-link">
                    <FontAwesomeIcon icon={faLink} /> {appHeader.homeLinkText}
                  </a>
                )}

                {isAuthenticated ? <Logout /> : <Login />}
              </div>
            </div>
          </div>
        </header>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default CdsHeader;
