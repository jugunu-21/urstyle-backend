import { IUser } from './user'

export type SignInPayload = Pick<IUser, 'phone_number'>

export type SignUpPayload = Pick<IUser, 'email' | 'password' | 'phone_number'>;


export type ResetPasswordPayload = Pick<IUser, 'email'>

export type NewPasswordPayload = Pick<IUser, 'password'>
