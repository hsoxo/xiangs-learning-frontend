import React from 'react'
import './App.css'
import Login from './pages/Login'
import { useSelector } from './redux'
import Questions from './pages/Questions'

const q = [
  {
    id: 1,
    q: '1.“四史”：（                     ）。 ',
    a: '答案：党史、新中国史、改革开放史、社会主义发展史',
  },
  {
    id: 2,
    q: '2.1919年，李大钊在 （      ）杂志发表了（      ） 一文，系统地介绍了马克思主义的唯物史观、政治经济学和科学社会主义的基本原理。 ',
    a: '答案：《新青年》、《我的马克思主义观》',
  },
]
function App() {
  const { token } = useSelector(state => state.app)
  return (
    <div className="App">
      {/*<AppBar position="static" color="primary">*/}
      {/*  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>*/}
      {/*    李响的党史学习知识竞赛*/}
      {/*  </Typography>*/}
      {/*</AppBar>*/}
      {token ? <Questions /> : <Login />}
    </div>
  )
}

export default App
