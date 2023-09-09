import React from 'react';
import { BrowserRouter , Route, Routes } from "react-router-dom";
import Detail from "./pages/Detail";
import Home from "./pages/Home";
import MyPage from "./pages/mypage";
import Redirect from "./pages/login";
import Singing from './pages/Singing';
import Search from './pages/Search';
import Prefer from "./pages/Prefer";
import Game from './pages/Game';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path='/Game' element={<Game></Game>}></Route>
          <Route path = "/prefer" element={<Prefer/>}></Route>
          <Route path='/search/:target' element ={<Search></Search>}></Route>
          <Route path ="/singing" element={<Singing/>}> </Route>
          <Route path ="/login" element={<Redirect/>}> </Route>
          <Route path ="/mypage" element={<MyPage></MyPage>}> </Route>
          <Route path ="/detail/:target" element={<Detail></Detail>}> </Route>
          <Route path ="/" element={<Home></Home>}> </Route>
        </Routes>
      </BrowserRouter>
   </>
  );
}

export default App;
