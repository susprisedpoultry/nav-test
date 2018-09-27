import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import MainNavigation from './components/MainNavigation';
import Patient from './components/Patient';
import Search from './components/Search';
import MedPage from './components/MedPage';
import configureStore, { history } from './store';
import { ConnectedRouter } from 'connected-react-router'
import styled from 'styled-components'

import './App.css';


function Home () {
  return (
    <h1>
      HOME
    </h1>
  )
}

const store = configureStore(window.__INITIAL_STATE__);

const AppFrame = styled.div`
  display:flex;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
`

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: #eee;
`

class App extends Component {
  render() {
    return (
      <Provider store={store}>
          <ConnectedRouter history={history}>
            <AppFrame>
              <Route path='/' component={MainNavigation} />
              <ContentContainer>
              <Route exact path='/' component={Home} />
              <Route path='/search' component={Search} />
              <Route path='/med' component={MedPage} />
              <Route path='/patient/:patientId' component={Patient} />
              </ContentContainer>
            </AppFrame>
          </ConnectedRouter>
      </Provider>
    );
  }
}

export default App;
