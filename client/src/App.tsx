import { HttpLink } from '@apollo/client';
import './App.css'
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { AuthProvider } from './contexts/AuthContext';
import { setContext } from '@apollo/client/link/context';
import ResponderRoute from './components/ResponderRoute';


const authLink = setContext((_, { headers }) => {
  // Get the token from localStorage
  const token = localStorage.getItem('authToken');
  
  // Return the headers with the authorization token
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const httpLink = new HttpLink({ uri: "http://localhost:4000/" })

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});


function App() {

  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <ResponderRoute />
        {/* <AdminRoute /> */}
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App
