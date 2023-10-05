import './App.css';
import React from 'react';
import { NumericFormat } from 'react-number-format';
import { useFormik, FormikProvider, FieldArray } from 'formik';
import { Container, Box, TextField, Select, MenuItem, InputLabel, FormControl, Button, FormHelperText } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import * as Yup from 'yup';

const MAX_BILLS_AMOUNT = 5;
const CHARACTER_LIMIT = 31;
const DATA_STRUCTURE = {
  amount: '0.00',
  account: '',
  payee: '',
  repeat: '',
  note: '',
  date: null
};

const validationSchema = Yup.object().shape({
  bills: Yup.array()
    .of(Yup.object().shape({
      amount: Yup
        .number().typeError('Amount should be a number')
        .required('Amount is required'),
      account: Yup
        .number()
        .required('Account is required'),
      payee: Yup
        .number()
        .required('Payee is required'),
      repeat: Yup
        .number()
        .required('Repeat is required'),
      note: Yup
        .string()
        .required('Note is required'),
      date: Yup
        .date().typeError('Wrong date format')
        .required('Date is required')   
    }))
});

const NumericFormatCustom = React.forwardRef(function NumericFormatCustom(
  props,
  ref,
) {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      prefix="$"
    />
  );
});

const App = () => {
  const formik = useFormik({
    initialValues: {
      bills: [DATA_STRUCTURE]
    },
    validationSchema: validationSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    }
  });

  const { values, errors, touched, handleSubmit, handleChange, handleBlur, setFieldValue, setFieldError } = formik;

  const isFormEmpty = 
    Boolean(!values.bills[0].date ||
    Object.keys(errors).length ||
    values.bills.length >= MAX_BILLS_AMOUNT);

  const closeDatePickerHandler = (value, index) => {
    if (!value) {
      setFieldError(`bills[${index}].date`, 'Date is required!');
    }
  }

  return (
    <FormikProvider value={formik}>
        <form onSubmit={handleSubmit}>
          <FieldArray name='bills' render={({remove, push}) => (
            <Container className='container'>
              {values.bills.map((bill, index) => (
                <div className='bill' key={`bill-${index}`}>
                  {
                    !!index && <CancelIcon className='bill__remove' onClick={() => remove(index)}/>
                  }
                  <div className='bill__row bill__row--head'>
                    <TextField
                      className='bill__amount'
                      label='Amount'
                      variant='standard' 
                      name={`bills[${index}].amount`}
                      value={values.bills[index].amount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      InputProps={{ 
                        disableUnderline: true,
                        inputComponent: NumericFormatCustom
                      }}
                      error={touched.bills?.[index]?.amount && Boolean(errors.bills?.[index]?.amount)}
                      helperText={touched.bills?.[index]?.amount && errors.bills?.[index]?.amount}
                    />
                  </div>
                  <div className='bill__row'>
                    <FormControl error={touched?.bills?.[index]?.account && Boolean(errors?.bills?.[index]?.account)} fullWidth>
                      <InputLabel id='account-label'>From Account</InputLabel>
                      <Select
                        className='bill__account'
                        labelId='account-label'
                        label='From Account'
                        name={`bills[${index}].account`}
                        value={values.bills[index].account}
                        onChange={handleChange}
                        onBlur={handleBlur}
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
                      {
                        touched?.bills?.[index]?.account && Boolean(errors?.bills?.[index]?.account) && 
                        <FormHelperText>{errors?.bills?.[index]?.account}</FormHelperText>
                      }
                    </FormControl>
                    <FormControl error={touched.bills?.[index]?.payee && Boolean(errors.bills?.[index]?.payee)} fullWidth>
                      <InputLabel id='payee-label'>Payee</InputLabel>
                      <Select
                        labelId='payee-label'
                        label='Payee'
                        name={`bills[${index}].payee`}
                        value={values.bills[index].payee}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                      >
                        <MenuItem value={1}>London Hydro</MenuItem>
                        <MenuItem value={2}>Amsterdam High School</MenuItem>
                      </Select>
                      {
                        touched.bills?.[index]?.payee && Boolean(errors.bills?.[index]?.payee) && 
                        <FormHelperText>{errors.bills?.[index]?.payee}</FormHelperText>
                      }
                      <FormHelperText>Last payment of $271.00 was on Dec 17, 2022.</FormHelperText>
                    </FormControl>
                  </div>
                  <div className='bill__row'>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Box className='bill__date'>
                        <DatePicker 
                          label='Date' 
                          name={`bills[${index}].date`}
                          value={values.bills[index].date}
                          format='DD.MM.YYYY'
                          className={errors.bills?.[index]?.date? 'has-error' : null}
                          onChange={(value) => setFieldValue(`bills[${index}].date`, value, true)}
                          onClose={() => closeDatePickerHandler(values.bills[index].date, index)}
                          fullWidth
                        />
                        {
                          errors.bills?.[index]?.date && 
                          <FormHelperText error>{errors.bills?.[index]?.date}</FormHelperText>
                        }
                      </Box>
                    </LocalizationProvider>
                    <FormControl error={touched.bills?.[index]?.repeat && Boolean(errors.bills?.[index]?.repeat)} fullWidth>
                      <InputLabel id='repeat'>Repeat</InputLabel>
                      <Select
                        labelId='repeat'
                        label='Repeat'
                        name={`bills[${index}].repeat`}
                        value={values.bills[index].repeat}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                      >
                        <MenuItem value={2}>Every 2 Month, Untill Oct 12, 2023</MenuItem>
                        <MenuItem value={6}>Every 6 Month, Untill Dec 25, 2024</MenuItem>
                      </Select>
                      {
                        touched.bills?.[index]?.repeat && Boolean(errors.bills?.[index]?.repeat) && 
                        <FormHelperText>{errors.bills?.[index]?.repeat}</FormHelperText>
                      }
                    </FormControl>
                    <FormControl className='bill__note' fullWidth>
                      <TextField
                        label='Note'
                        inputProps={{
                          maxLength: CHARACTER_LIMIT
                        }}
                        name={`bills[${index}].note`}
                        value={values.bills[index].note}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        helperText={`${bill.note.length}/${CHARACTER_LIMIT}`}
                        error={touched.bills?.[index]?.note && Boolean(errors.bills?.[index]?.note)}
                      />
                      {
                        touched.bills?.[index]?.note && Boolean(errors.bills?.[index]?.note) && 
                        <FormHelperText error>{errors.bills?.[index]?.note}</FormHelperText>
                      }
                    </FormControl>
                  </div>
                </div>
              ))}
              <Button
                className='add-btn'
                color='primary'
                variant='outlined'
                startIcon={<AddIcon />}
                onClick={() => push(DATA_STRUCTURE)}
                disabled={isFormEmpty}
                fullWidth
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
