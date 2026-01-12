import { Chatrix } from './components/Chatrix'
import { AuthProvider } from './components/Auth/AuthContex'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Landing from './pages/Landing';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Landing/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/home' element={<Chatrix/>}/>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
