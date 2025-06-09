import {BrowserRouter, Route, Routes} from 'react-router'; 
import {Toaster} from 'react-hot-toast';
import Header from './components/Header';
import ChapterAudio from './components/ChapterAudio';
import NovelsList from './components/NovelsList';
import ChaptersList from './components/ChaptersList';

function App() {
 
  return (
    <BrowserRouter>
      <div className='container mx-auto'>
        <Header />
        <Routes>
          <Route path="/novels/" element={<NovelsList />} />
          <Route path="/novels/:id/" element={<ChaptersList />} />
          <Route path="/novels/:novelId/chapters/:chapterId" element={<ChapterAudio />} />
          {/* <Route path="/search" element={<SearchNovel />} /> */}

        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  )
}

export default App
