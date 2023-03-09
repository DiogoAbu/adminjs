import { PhoneNumberUtil } from 'google-libphonenumber'

const phoneUtil = PhoneNumberUtil.getInstance()

export const isPhoneValid = (value: string): boolean => {
  try {
    const phone = `${!value.startsWith('+') ? '+' : ''}${value}`
    const phoneNumber = phoneUtil.parse(phone)
    return phoneUtil.isValidNumber(phoneNumber)
  } catch {
    return false
  }
}
