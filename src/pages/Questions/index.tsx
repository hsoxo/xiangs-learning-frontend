import React, { useRef, useState } from 'react'
import { QueryStatus } from '@reduxjs/toolkit/query'
import {
  Box,
  Button,
  ButtonBase,
  IconButton,
  InputBase,
  LinearProgress,
  Paper,
  styled,
  Typography,
} from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import AutoAwesomeSharpIcon from '@mui/icons-material/AutoAwesomeSharp'
import ChevronRightSharpIcon from '@mui/icons-material/ChevronRightSharp'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ShuffleRoundedIcon from '@mui/icons-material/ShuffleRounded'
import { LoadingButton } from '@mui/lab'
import {
  useAnswerMutation,
  useGetQuestionQuery,
  useGetQuestionsQuery,
  usePutImportantMutation,
  useShuffleQuestionsMutation,
} from '../../redux/api'
import { QuestionType } from '../../types'
import Selections from './Selections'

const QUESTION_TYPE_STRING: { [key in QuestionType]: string } = {
  ss: '单选题',
  ms: '多选题',
  f: '填空题',
  tf: '判断题',
}

function arraysAreIdentical(arr1: string[], arr2: string[]) {
  if (arr1.length !== arr2.length) return false
  return arr1.every(s => arr2.includes(s))
}

const Questions = () => {
  const [curIndex, setCurIndex] = useState(0)
  const [selection, setSelection] = useState<string[]>([])
  const [showAnswer, setShowAnswer] = useState(false)
  const [showNav, setShowNav] = useState(false)
  const [goToQId, setGoToQId] = useState('0')
  const answerRef = useRef<HTMLDivElement | null>(null)
  const { currentData } = useGetQuestionsQuery()
  const [answer, answerStatus] = useAnswerMutation()
  const [shuffle] = useShuffleQuestionsMutation()
  const [putImportant, { isLoading: putImportantLoading }] = usePutImportantMutation()
  const cur = currentData?.[curIndex]
  const { currentData: question } = useGetQuestionQuery({ id: cur?.id || 0 }, { skip: !cur })
  useGetQuestionQuery({ id: currentData?.[curIndex + 1]?.id || 0 }, { skip: !currentData })
  useGetQuestionQuery({ id: currentData?.[curIndex + 2]?.id || 0 }, { skip: !currentData })

  const handleAnswerClick = (value: string) => {
    if (showAnswer) return
    if (cur) {
      if ([QuestionType.SingleSelect, QuestionType.TrueFalse].includes(cur.t)) {
        setSelection([value])
      } else if (cur.t === QuestionType.MultiSelect) {
        if (selection.includes(value)) {
          setSelection(selection.filter(s => s !== value))
        } else {
          setSelection([...selection, value])
        }
      }
    }
  }

  const handleNextQuestion = async () => {
    setSelection([])
    setShowAnswer(false)
    currentData && setCurIndex(curIndex + 1)
    if (cur && cur.t === QuestionType.Fill && showAnswer) {
      cur &&
        answerStatus.status === QueryStatus.uninitialized &&
        (await answer({
          id: cur.id,
          a: '',
          p: 2,
        }))
    }
    await answerStatus.reset()
  }

  const handleShowAnswer = () => {
    if (cur) {
      setShowAnswer(true)
      answerRef.current?.scrollIntoView()
      const a = cur.a.split('')
      if (cur.t !== QuestionType.Fill) {
        const p = selection.length === 0 ? 2 : arraysAreIdentical(a, selection) ? 1 : 0
        answer({
          id: cur.id,
          a: selection.join(''),
          p,
        })
      }
    }
  }

  const handleFillWrong = () => {
    cur &&
      answerStatus.status === QueryStatus.uninitialized &&
      answer({
        id: cur.id,
        a: '',
        p: 0,
      })
  }

  const handleImportant = () => {
    cur && question && putImportant({ id: cur.id, important: !question.important })
  }

  const handleClickNumber = () => {
    setGoToQId(String(curIndex + 1))
    setShowNav(true)
  }

  return (
    <Container>
      {!cur ? (
        <LinearProgress />
      ) : (
        <>
          <div className={'body'}>
            <Paper className="question">
              <Box className="question-info">
                <div className="question-info-left">
                  {showNav ? (
                    <Paper component="form" className="jump-to">
                      <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        value={goToQId}
                        type="number"
                        onChange={e => {
                          const max = currentData.length
                          const min = 1
                          let value = parseInt(e.target.value, 10)
                          if (value > max) value = max
                          if (value < min) value = min
                          setGoToQId(String(value))
                        }}
                      />
                      <IconButton
                        sx={{ p: '10px' }}
                        onClick={() => {
                          setCurIndex(parseInt(goToQId) - 1)
                          setShowNav(false)
                        }}
                      >
                        <ArrowForwardIcon />
                      </IconButton>
                    </Paper>
                  ) : (
                    <>
                      <IconButton onClick={() => shuffle()}>
                        <ShuffleRoundedIcon />
                      </IconButton>
                      <Typography variant="h5" component="span" className="question-type">
                        {QUESTION_TYPE_STRING[cur.t]}
                      </Typography>
                      <Typography
                        variant="body2"
                        component="span"
                        className="question-type"
                        onClick={handleClickNumber}
                      >
                        {`[${curIndex + 1} / ${currentData.length}]`}
                      </Typography>
                    </>
                  )}
                  {/*<Typography*/}
                  {/*  variant="body2"*/}
                  {/*  component="span"*/}
                  {/*  className="question-type"*/}
                  {/*>*/}
                  {/*  {`${question?.wrong || 0} / ${(question?.correct || 0) + (question?.wrong || 0)}`}*/}
                  {/*</Typography>*/}
                </div>
                <IconButton disabled={putImportantLoading} onClick={handleImportant}>
                  {question?.important ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
              </Box>
              <div className="question-title">{cur.q.replace(/^\d+./, '')}</div>
            </Paper>
            <div>
              {[QuestionType.SingleSelect, QuestionType.MultiSelect].includes(cur.t) && (
                <Selections
                  t={cur.t}
                  s={cur.s}
                  a={cur.a}
                  showAnswer={showAnswer}
                  selection={selection}
                  onClick={handleAnswerClick}
                />
              )}
              {[QuestionType.TrueFalse].includes(cur.t) && (
                <Selections
                  t={cur.t}
                  s={'正确|错误'}
                  a={cur.a === 't' ? '正' : '错'}
                  showAnswer={showAnswer}
                  selection={selection}
                  onClick={handleAnswerClick}
                />
              )}

              {showAnswer && cur.t === QuestionType.Fill && (
                <>
                  <div className="fill-answer">
                    {cur.a}
                    {answerStatus.status === QueryStatus.uninitialized && (
                      <LoadingButton
                        disabled={answerStatus.status !== QueryStatus.uninitialized}
                        loading={answerStatus.isLoading}
                        onClick={handleFillWrong}
                      >
                        😭 mark wrong
                      </LoadingButton>
                    )}
                  </div>
                </>
              )}
              {showAnswer && cur.t !== QuestionType.Fill && (
                <div className="fill-answer">正确答案：{cur.a.replace('t', '正确').replace('f', '错误')}</div>
              )}
              <Box height={60} />
              <div ref={answerRef} />
            </div>
            <div className="footer">
              <Box sx={{ textAlign: 'center' }}>响儿加油</Box>
              <div className="button-group">
                <Button
                  size="large"
                  startIcon={<AutoAwesomeSharpIcon />}
                  onClick={handleShowAnswer}
                  disabled={showAnswer}
                >
                  查看答案
                </Button>
                <Button size="large" endIcon={<ChevronRightSharpIcon />} onClick={handleNextQuestion}>
                  下一题
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </Container>
  )
}

const Container = styled(Box)(() => ({
  '.body': {
    height: 'calc(100vh - 80px)',
    overflowY: 'auto',
  },
  '.question': {
    padding: '24px 16px 36px',
    backgroundColor: '#ffd9de',
    backgroundImage: 'linear-gradient(315deg, #ffd9de 0%, #e99ba6 74%)',
    boxShadow: 'rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    '.question-info': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 32,
      '.question-info-left': {
        display: 'flex',
        alignItems: 'center',
        '> *': {
          marginRight: 8,
        },
        '.jump-to': {
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: '70vw',
        },
      },
    },
    '.question-type': {},
    '.question-title': {
      fontSize: 18,
    },
  },
  '.selections': {
    display: 'flex',
    flexDirection: 'column',
    margin: 16,
    '.selection-active': {
      backgroundColor: '#feebf1',
    },
    '.selection-correct': {
      backgroundColor: '#c8fcac !important',
      border: '2px solid #62c92a !important',
    },
    '.selection-wrong': {
      backgroundColor: '#fa9b9b !important',
      border: '2px solid #ff0000 !important',
    },
    '.selection-warn': {
      backgroundColor: '#fff7a1 !important',
      border: '2px solid #ffe900 !important',
    },
    '> *': {
      margin: '8px 0',
    },
    '.MuiButtonBase-root': {
      display: 'block',
      padding: '0 8px',
      textAlign: 'left',
      minHeight: 72,
      verticalAlign: 'center',
      border: '2px solid #f28f9a',
      borderRadius: 12,
      boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
      fontSize: 16,
    },
  },
  '.footer': {
    position: 'fixed',
    bottom: 0,
    '.button-group': {
      display: 'flex',
      justifyContent: 'space-around',
      '.MuiButton-root': {
        width: '50vw',
        height: 72,
        background: '#ffd9de',
        color: 'black',
        borderRadius: 0,
      },
    },
  },
  '.fill-answer': {
    padding: 16,
    '.MuiButton-root': {
      color: 'coral',
    },
  },
}))

export default Questions
