import { useEffect } from "react";
import axios from "axios";
import './index.css';
import {BrowserRouter, Route, Routes} from 'react-router'; 
import {Toaster} from 'react-hot-toast';
import Header from './components/Header';
import NovelsList from './components/NovelsList';
import ChaptersList from './components/ChaptersList';
import ScrapForm from './components/ScrapForm';
import ChapterAudio from "./components/ChapterAudio";

function App() {

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/csrf/", { withCredentials: true });
  }, []);
 
  return (
    <BrowserRouter>
      <div className='container mx-auto'>
        <Header />
        <Routes>
          <Route path="/novels/" element={<NovelsList />} />
          <Route path="/scrap/" element={<ScrapForm />} />
          <Route path="/novels/:id/" element={<ChaptersList />} />
          <Route path="/novels/:novelId/chapters/:chapterId" element={<ChapterAudio />} />
          <Route path="/novels/:novelId/chapters/:chapterId/audio" element={<ChapterAudio />} />

        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  )
}

export default App
