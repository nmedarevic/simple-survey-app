import './App.css'
import SurveyComponent from './components/Survey'
import { simpleConfig } from './form-config/simple-config'

function App() {
  
  return (
    <>
      <div>
        <SurveyComponent config={simpleConfig}/>
      </div>
      <h1>Vite + React</h1>
    </>
  )
}

export default App
