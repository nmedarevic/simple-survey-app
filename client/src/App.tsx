import './App.css'
import { ApolloProvider } from "@apollo/client/react";
import { AuthProvider } from './contexts/AuthContext';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LoadingFallback } from './components/atoms/Loading';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Role } from './schemaTypes/graphql';
import { RouteEnum } from './routes';
import { client } from './apollo-client';

const LoginPage = lazy(() => import('./components/pages/LoginPage'));
const SurveyPage = lazy(() => import('./components/pages/SurveyPage'));
const AdminPage = lazy(() => import('./components/pages/AdminPage'));

function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
      <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public route */}
              <Route path={RouteEnum.Login} element={<LoginPage />} />
              
              {/* Protected routes */}
              <Route 
                path={RouteEnum.ResponderSurvey}
                element={
                  <ProtectedRoute allowedRole={Role.Responder}>
                    <SurveyPage />
                  </ProtectedRoute>
                } 
              />
              <Route path={RouteEnum.Responder} element={<Navigate to={RouteEnum.ResponderSurvey} replace />} />

              <Route 
                path={RouteEnum.ResponderMySurveys}
                element={
                  <ProtectedRoute allowedRole={Role.Responder}>
                    <></>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path={RouteEnum.ReviewerAllSurveys}
                element={
                  <ProtectedRoute allowedRole={Role.Reviewer}>
                    <AdminPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Default redirect */}
              <Route path={RouteEnum.Root} element={<Navigate to={RouteEnum.Login} replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App
