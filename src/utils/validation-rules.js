const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)?((localhost|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+)|(\d{1,3}\.){3}\d{1,3})(:\d+)?(\/[-a-zA-Z0-9@:%._+~#=]*)*(\?[;&a-zA-Z0-9%_.~+=-]*)?(#[a-zA-Z0-9-]*)?$/
const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const otpPattern = /^\d{4}$/
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[a-zA-Z\d!@#$%^&*()]+$/

export const rules = {

  fullname: [
    (val) => (val && val.length > 0) || 'Name is required!',
    (val) =>
      val.length <= 255 ||
      'Name should not be greater than 255 characters'
  ],
  adminName: [
    (val) => (val && val.length > 0) || 'Name is required!',
    (val) =>
      val.length <= 255 || 'Name should not be greater than 255 characters',
    (val) => /^[A-Za-z\s]+$/.test(val) || 'Name should contain only letters and spaces'
  ],
  email: [
    (val) => (val && val.length > 0) || 'Email is required!',
    (val) =>
      val.length <= 255 ||
      'Email should not be greater than 255 characters',
    (val) =>
      emailPattern.test(val.trim()) ||
      'Email is not valid!'
  ],
  emailNonRequired: [
    (val) =>
      val.length <= 255 ||
      'Email should not be greater than 255 characters',
    (val) => (!!val &&
      emailPattern.test(val.trim())) ||
      'Email is not valid!'
  ],
  otp: [
    (val) => (val && val.length > 0) || 'OTP is required!',
    (val) => otpPattern.test(val.trim()) || 'Invalid OTP',
    (val) =>
      val.length <= 20 || 'OTP should not be greater than 20 characters'
  ],
  passwordLogin: [
    (val) => (val && val.length > 0) || 'Password is required!',
    (val) =>
      val.length <= 255 ||
      'Password should not be greater than 255 characters'
  ],
  password: [
    (val) => (val && val.length > 0) || 'Password is required!',
    (val) => !/\s/.test(val) || 'Password should not contain empty spaces!',
    (val) => val.length >= 8 || 'Need atleast 8 characters!',
    (val) =>
      passwordPattern.test(
        val
      ) ||
      'Password should have letters (upper case, lower case), numbers, and characters!',
    (val) =>
      val.length <= 255 ||
      'Password should not be greater than 255 characters'
  ],

  gender: [
    (val) => (val && val.length > 0) || 'Gender is required!'
  ],
  birthday: [
    (val) => (val && val.length > 0) || 'Birthday is required!'
  ],

  contactWithoutRequired: [
    (val) => (val && val.length >= 9) || 'Invalid contact number!',
    (val) => /^\+?\d+$/.test(val.trim()) || 'Invalid contact number!',
    (val) =>
      val.length <= 20 ||
      'Contact should not be greater than 20 characters'
  ],
  urlRulesWithoutRequired: [
    val => urlPattern.test(val.trim()) || 'Please enter a valid URL'
  ],
  urlRulesWithRequired: [
    (val) => !!val || 'URL is required',
    val => urlPattern.test(val.trim()) || 'Please enter a valid URL'
  ],
  bibleVerseTitle: [
    (val) => (val && val.length > 0) || 'Title is required!',
    (val) =>
      val.length <= 255 ||
      'Title should not be greater than 255 characters'
  ],
  bibleVerseLang: [
    (val) => (val && val.length > 0) || 'Language is required!'
  ],
  bibleVerseDate: [
    (val) => (val && val.length > 0) || 'Date is required!'
  ],
  bibleVerse: [
    (val) => (val && val.length > 0) || 'Message is required!',
    (val) =>
      val.length <= 65535 ||
      'Message should not be greater than 65535 characters'
  ],
  newsTitle: [
    (val) => (val && val.length > 0) || 'Title is required!',
    (val) =>
      val.length <= 255 ||
      'Title should not be greater than 255 characters'
  ],
  newsDescription: [
    (val) => (val && val.length > 0) || 'Description is required!',
    (val) =>
      val.length <= 65535 ||
      'Description should not be greater than 65535 characters'
  ]
}
