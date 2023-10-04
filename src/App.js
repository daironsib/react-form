import './App.css';
import React from 'react';
import { useFormik, FormikProvider, FieldArray  } from 'formik';
import { Container, TextField, Select, MenuItem, InputLabel, FormControl, Button, FormHelperText } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import * as Yup from 'yup';

const CHARACTER_LIMIT = 31;

const validationSchema = Yup.object().shape({
  bills: Yup.array()
    .of(Yup.object().shape({
      amount: Yup
        .number('Enter amount')
        .required('Amount is required'),
      account: Yup
        .string('Please select your account')
        .required('Account is required')
    }))
});

const App = () => {
  const formik = useFormik({
    initialValues: {
      bills: [{
        amount: '0.00',
        account: '',
        payee: '',
        repeat: '',
        note: '',
        date: null
      }]
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    }
  });

  const addHandler = (arrayHelpers) => {
    arrayHelpers.push({
      amount: '0.00',
      account: '',
      payee: '',
      repeat: '',
      note: '',
      date: null
    })
  }

  return (
    <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit}>
          <FieldArray name='bills' render={(arrayHelpers) => (
            <Container className='container'>
              {formik.values.bills.map((bill, index) => (
                <div className='bill' key={`bill-${index}`}>
                  {
                    index > 0 && 
                    <CancelIcon className='bill__remove' onClick={() => arrayHelpers.remove(index)}/>
                  }
                  <div className='bill__row bill__row--head'>
                    <TextField
                      className='bill__amount'
                      label='Amount'
                      variant='standard' 
                      name={`bills[${index}].amount`}
                      value={formik.values.bills[index].amount}
                      onChange={formik.handleChange}
                      InputProps={{ 
                        disableUnderline: true,
                        startAdornment: '$'
                      }}
                      // error={formik.touched.bills[index].amount && Boolean(formik.errors.bills[index].amount)}
                      // helperText={formik.touched.bills[index].amount && formik.errors.bills[index].amount}
                    />
                  </div>
                  <div className='bill__row'>
                    <FormControl fullWidth>
                      <InputLabel id='account-label'>From Account</InputLabel>
                      <Select
                        className='bill__account'
                        labelId='account-label'
                        label='From Account'
                        name={`bills[${index}].account`}
                        value={formik.values.bills[index].account}
                        onChange={formik.handleChange}
                        fullWidth
                      >
                        <MenuItem value={1}>
                          <span>My Checking Account</span>
                          <span>$12,000.00</span>
                        </MenuItem>
                        <MenuItem value={2}>
                          <span>My own Account</span>
                          <span>$28,300.00</span>
                        </MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel id='payee-label'>Payee</InputLabel>
                      <Select
                        labelId='payee-label'
                        label='Payee'
                        name={`bills[${index}].payee`}
                        value={formik.values.bills[index].payee}
                        onChange={formik.handleChange}
                        fullWidth
                      >
                        <MenuItem value={1}>London Hydro</MenuItem>
                        <MenuItem value={2}>Amsterdam High School</MenuItem>
                      </Select>
                      <FormHelperText>Last payment of $271.00 was on Dec 17, 2022.</FormHelperText>
                    </FormControl>
                  </div>
                  <div className='bill__row'>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker 
                      className='bill__date'
                      label='Date' 
                      name={`bills[${index}].date`}
                      value={formik.values.bills[index].date}
                      onChange={e => formik.handleChange(`bills[${index}].date`, e)}
                      fullWidth
                    />
                  </LocalizationProvider>
                    <FormControl fullWidth>
                      <InputLabel id='repeat'>Repeat</InputLabel>
                      <Select
                        labelId='repeat'
                        label='Repeat'
                        name={`bills[${index}].repeat`}
                        value={formik.values.bills[index].repeat}
                        onChange={formik.handleChange}
                        fullWidth
                      >
                        <MenuItem value={2}>Every 2 Month, Untill Oct 12, 2023</MenuItem>
                        <MenuItem value={6}>Every 6 Month, Untill Dec 25, 2024</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      className='bill__note'
                      label='Note'
                      inputProps={{
                        maxLength: CHARACTER_LIMIT
                      }}
                      helperText={`${bill.note.length}/${CHARACTER_LIMIT}`}
                      name={`bills[${index}].note`}
                      value={formik.values.bills[index].note}
                      onChange={formik.handleChange}
                      fullWidth
                    />
                  </div>
                </div>
              ))}
              <Button
                className='add-btn'
                color='primary'
                variant='outlined'
                startIcon={<AddIcon />}
                fullWidth
                onClick={() => addHandler(arrayHelpers)}
                disabled={formik.values.bills.length >= 5}
              >
                Add Another Bill
              </Button>
            </Container>
          )}/>
        </form>
    </FormikProvider>
  );
};

export default App;
