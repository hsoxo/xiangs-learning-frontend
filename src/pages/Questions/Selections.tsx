import { QuestionType } from '../../types'
import { ButtonBase } from '@mui/material'
import React from 'react'

interface ISelectionsProps {
  t: QuestionType
  s: string
  a: string
  selection: string[]
  showAnswer: boolean
  onClick: (a: string) => void
}
const Selections = ({ s, ...props }: ISelectionsProps) => {
  return (
    <div className="selections">
      {s.split('|').map(text => (
        <SelectionButton key={text} text={text} {...props} />
      ))}
    </div>
  )
}
interface ISelectionButtonProps {
  t: QuestionType
  a: string
  selection: string[]
  showAnswer: boolean
  text: string
  onClick: (s: string) => void
}
const SelectionButton = ({ t, a, showAnswer, selection, text, onClick }: ISelectionButtonProps) => {
  const id = text.charAt(0)
  const showCheck = showAnswer && a.includes(id) && selection.includes(id)
  const showWarn = showAnswer && a.includes(id) && !selection.includes(id)
  const showCross = showAnswer && !a.includes(id) && selection.includes(id)

  const className = () => {
    let result = ''
    if (t === QuestionType.SingleSelect || t === QuestionType.TrueFalse) {
      if (showCheck) result += 'selection-correct '
      if (showCross) result += 'selection-wrong '
      if (showWarn) result += 'selection-correct '
    } else {
      if (showCheck) result += 'selection-correct '
      if (showCross) result += 'selection-wrong '
      if (showWarn) result += 'selection-warn '
    }
    return result
  }

  return (
    <ButtonBase
      className={`${selection.includes(id) ? 'selection-active' : ''} ${className()}`}
      onClick={() => onClick(id)}
      disabled={showAnswer}
    >
      <div>{text}</div>
    </ButtonBase>
  )
}

export default Selections
