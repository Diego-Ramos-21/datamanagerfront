import logo from './assets/logo.png'
import './App.css'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers'
import { Dayjs } from 'dayjs';
import 'dayjs/locale/en-gb'
import React, { ChangeEvent } from 'react';
import api from './Api'
import { MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { TailSpin } from 'react-loading-icons'
import axios, { AxiosError } from 'axios';

function App() {
  const [date, setDate] = React.useState<Dayjs | null>(null);
  const [time, setTime] = React.useState<string | null>(null);
  const [op, setOp] = React.useState<string>('0');
  const [newDate, setNewDate] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const [loading, setLoading] = React.useState<boolean>(false);
  const controller = new AbortController();

  const handlerSend = async () => {
    setLoading(true)
    try {
      // Validation
      if (!date){
        setErrorMsg("O Campo 'Data inicial' é obrigatório!")
        setLoading(false)
        return
      }
      if (op === '0'){
        setErrorMsg("O Campo 'operador' não foi selecionado!")
        setLoading(false)
        return
      }
      if (!time){
        setErrorMsg("O Campo 'Minutos' é obrigatório!")
        setLoading(false)
        return
      }
      setNewDate(null)
      setErrorMsg(null)
      let operator;
      if (op === '1')
        operator = '+'
      else if (op === '2')
        operator = '-'
      const dateToSend = date?.format('DD/MM/YYYY HH:mm');
      const response = await api.post('date-manager', { 'dateValue': dateToSend, 'op': operator, 'time': parseInt(time ?? '0')}, { headers: { 'Content-Type': 'application/json'}, signal: controller.signal })
      setNewDate(response.data.dateValue)
    } catch (error) {
      const errors = error as Error | AxiosError
      if (axios.isAxiosError(errors))
          setErrorMsg(errors.response?.data.message)
      setErrorMsg(errors.message)
    }
    setLoading(false)
  }
  
  return (
    <>
      <div>
        <img src={logo} className="logo" alt="Trickster logo" />
      </div>
      <h1>DMT</h1>
      <div className="card">
        <div className="informations flex flex-row space-x-8">
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
            <DateTimePicker 
              label="Data inicial"
              value={date}
              onChange={(newValue) => setDate(newValue)}
              sx={{
                marginRight: '4px',
                '& .MuiFormLabel-root, .MuiSvgIcon-root, .MuiInputBase-input': {
                  color: 'white'
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white'
                }
              }
              }
            />
          </LocalizationProvider>
          <Select
            id='operator-select'
            value={op}
            onChange={(event: SelectChangeEvent) => {setOp(event.target.value)}}
            sx={{
              margin: '0 4px',
              '& .MuiFormLabel-root, .MuiSvgIcon-root, .MuiInputBase-input': {
                color: 'white'
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white'
              }
            }}
          >
            <MenuItem value='0'>Nenhum</MenuItem>
            <MenuItem value='1'>Adicionar</MenuItem>
            <MenuItem value='2'>Subtrair</MenuItem>
          </Select>
          <TextField
            type='number'
            label='Minutos'
            value={time}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setTime(event.target.value)
            }}
            sx={{
              marginLeft: '4px',
              '& .MuiFormLabel-root, .MuiInputBase-input': {
                color: 'white'
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white'
              }
            }}
          />
        </div>
        <div className='send'>
          <button 
            disabled={loading}
            onClick={handlerSend}
          >
            Enviar {loading && <TailSpin width={15} height={15} style={{margin: '0 4px'}} />}
          </button>
          <div id='infoLabel'>{newDate ? (<p>{`Data calculada: ${newDate}`}</p>) : (errorMsg ? <p className='error'>{errorMsg}</p> : null)}</div>
        </div>
      </div>
      <p className="foo">
        &copy;Diego Ramos
      </p>
    </>
  )
}

export default App
