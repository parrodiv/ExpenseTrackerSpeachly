import React from 'react'
import {
  Grid,
  TextField,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core'
import { ExpenseTrackerContext } from '../../../context/context'
import {
  incomeCategories,
  expenseCategories,
} from '../../../constants/categories'
import { useSpeechContext } from '@speechly/react-client'

import formatDate from '../../../utils/formatDate'
import useStyles from './styles'
import { useState, useContext, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import CustomizedSnackbar from '../../Snackbar/Snackbar'

const initialState = {
  amount: '',
  category: '',
  type: 'Income',
  date: formatDate(new Date()),
}

const Form = () => {
  const classes = useStyles()
  const [formData, setFormData] = useState(initialState)
  const { addTransaction } = useContext(ExpenseTrackerContext)
  const { segment } = useSpeechContext()
  const [open, setOpen] = useState(false)

  const createTransaction = () => {
    if (Number.isNaN(Number(formData.amount)) || !formData.date.includes('-'))
      return
    if (formData.amount === '' || formData.category === '') return

    const transaction = {
      ...formData,
      amount: Number(formData.amount),
      id: uuidv4(),
    }

    setOpen(true)

    addTransaction(transaction)
    // reset state
    setFormData(initialState)
  }

  useEffect(() => {
    if (segment) {
      if (segment.intent.intent === 'add_expense') {
        setFormData({ ...formData, type: 'Expense' })
      } else if (segment.intent.intent === 'add_income') {
        setFormData({ ...formData, type: 'Income' })
      } else if (
        segment.isFinal &&
        segment.intent.intent === 'create_transaction'
      ) {
        return createTransaction()
      } else if (
        segment.isFinal &&
        segment.intent.intent === 'cancel_transaction'
      ) {
        setFormData(initialState)
      }

      segment.entities.forEach((entity) => {
        // console.log(entity.value)

        //solo lettera iniziale maiuscola ed il resto minuscolo
        const category = `${entity.value.charAt(0)}${entity.value
          .slice(1)
          .toLowerCase()}`
        console.log(category)

        switch (entity.type) {
          case 'amount':
            setFormData({ ...formData, amount: entity.value })
            break
          case 'category':
            if (incomeCategories.map((iC) => iC.type).includes(category)) {
              setFormData({ ...formData, type: 'Income', category: category })
              // entity.value viene estratto tutto in maiuscolo, mentre i valori sono salvati con solo prima lettera maiuscola (Business, Salary ecc)
            } else if (
              expenseCategories.map((iC) => iC.type).includes(category)
            ) {
              setFormData({ ...formData, type: 'Expense', category: category })
            }
            break
          case 'date':
            setFormData({ ...formData, date: entity.value })
            break
          default:
            break
        }
      })

      if (
        segment.isFinal &&
        formData.type &&
        formData.category !== '' &&
        formData.amount !== '' &&
        formData.date
      ) {
        createTransaction()
      }
    }
  }, [segment])

  const selectedCategories =
    formData.type === 'Income' ? incomeCategories : expenseCategories

  return (
    <Grid container spacing={2}>
      <CustomizedSnackbar open={open} setOpen={setOpen} />
      <Grid item xs={12}>
        <Typography align='center' variant='subtitle2' gutterBottom>
          {segment && <>{segment.words.map((w) => w.value).join(' ')}</>}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Type</InputLabel>
          <Select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <MenuItem value='Income'>Income</MenuItem>
            <MenuItem value='Expense'>Expense</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            {selectedCategories.map((category) => (
              <MenuItem key={category.type} value={category.type}>
                {category.type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <TextField
          type='number'
          label='Amount'
          fullWidth
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          type='date'
          label='Date'
          fullWidth
          value={formData.date}
          onChange={(e) =>
            setFormData({ ...formData, date: formatDate(e.target.value) })
          }
        />
      </Grid>
      <Button
        className={classes.button}
        variant='outlined'
        color='primary'
        fullWidth
        onClick={createTransaction}
      >
        Create
      </Button>
    </Grid>
  )
}

export default Form
