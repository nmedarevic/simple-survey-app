import { HttpLink } from '@apollo/client';
import './App.css'
import LoginPage from './components/pages/LoginPage'
import SurveyComponent from './components/Survey'
import { simpleConfig } from './form-config/simple-config'

import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";

const client = new ApolloClient({
  link: new HttpLink({ uri: "http://localhost:4000/" }),
  cache: new InMemoryCache(),
});

function App() {

  return (
    <ApolloProvider client={client}>
      <LoginPage />
    </ApolloProvider>
    // <SurveyComponent config={simpleConfig}/>
  )
}

export default App
