import logo from './assets/logo.png'
import './App.css'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers'
import { Dayjs } from 'dayjs';
import 'dayjs/locale/en-gb'
import React, { ChangeEvent } from 'react';
import api from './Api'
import { MenuItem, Paper, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableRow, TextField } from '@mui/material';
import { TailSpin } from 'react-loading-icons'
import axios, { AxiosError } from 'axios';

interface RowData {
  text: string;
  type: string;
}

function App() {
  const [date, setDate] = React.useState<Dayjs | null>(null)
  const [time, setTime] = React.useState<string | null>(null)
  const [op, setOp] = React.useState<string>('0')

  const [loading, setLoading] = React.useState<boolean>(false)
  const controller = new AbortController()

  const [consoleRows, setConsoleRows] = React.useState<RowData[]>([])

  const handlerSend = async () => {
    setLoading(true)
    try {
      // Validation
      if (!date){
        setConsoleRows([{text: ">> O Campo 'Data inicial' é obrigatório!", type: 'e'}, ...consoleRows])
        setLoading(false)
        return
      }
      if (op === '0'){
        setConsoleRows([{text: ">> O Campo 'operador' não foi selecionado!", type: 'e'}, ...consoleRows])
        setLoading(false)
        return
      }
      if (!time){
        setConsoleRows([{text: ">> O Campo 'Minutos' é obrigatório!", type: 'e'}, ...consoleRows])
        setLoading(false)
        return
      }
      let operator;
      if (op === '1')
        operator = '+'
      else if (op === '2')
        operator = '-'
      const dateToSend = date?.format('DD/MM/YYYY HH:mm');
      const response = await api.post('date-manager', { 'dateValue': dateToSend, 'op': operator, 'time': parseInt(time ?? '0')}, { headers: { 'Content-Type': 'application/json'}, signal: controller.signal })
      setConsoleRows([{ text: `>> ${response.data.dateValue}`, type: 'i' }, ...consoleRows])
    } catch (error) {
      const errors = error as Error | AxiosError
      if (axios.isAxiosError(errors))
          setConsoleRows([{ text: `>> ${errors.response?.data.message}`, type: 'e' }, ...consoleRows])
      setConsoleRows([{ text: `>> ${errors.message}`, type: 'e' }, ...consoleRows])
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
        </div>
        <div className='history'>
          <h3 style={{textAlign: 'left'}}>Console</h3>
          <TableContainer sx={{height: '100%'}} component={Paper}>
            <Table sx={{backgroundColor: '#424242'}}>
              <TableBody>
                {consoleRows.map((row:RowData, index: number) => (
                  <TableRow
                    key={index}
                    sx={{ '& td, & th': { border: 0, padding: '6px' } }}
                  >
                    {row.type === 'e' ? 
                      <TableCell component="th" sx={{color: 'red'}}>{row.text}</TableCell> :
                      <TableCell component="th" sx={{color: 'white'}}>{row.text}</TableCell> 
                    }
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <p className="foo">
        &copy;Diego Ramos
      </p>
    </>
  )
}

export default App
