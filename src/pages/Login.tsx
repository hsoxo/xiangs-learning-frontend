import React from 'react'
import { Button, Paper, styled, TextField } from '@mui/material'
import { useLoginMutation } from '../redux/api'
import { setReduxToken } from '../redux/app'
import { useDispatch } from 'react-redux'

const Login = () => {
  const dispatch = useDispatch()
  const [login, { isLoading }] = useLoginMutation()
  const [name, setName] = React.useState('')
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)

  const handleLogin = async () => {
    try {
      const result = await login({ username: name }).unwrap()
      dispatch(setReduxToken(result.access_token))
    } catch (e) {}
  }

  return (
    <Container elevation={5}>
      <TextField id="outlined-name" label="用户名" value={name} onChange={handleChange} disabled={isLoading} />
      <Button disabled={isLoading || !name} onClick={handleLogin}>
        登陆
      </Button>
    </Container>
  )
}
const Container = styled(Paper)(() => ({
  margin: '100px 16px',
  display: 'flex',
  flexDirection: 'column',
  padding: 16,
}))
export default Login
