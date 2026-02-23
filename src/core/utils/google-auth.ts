import { jwtDecode } from 'jwt-decode'

export function decodeLoginJWTResponse(token: string): GoogleAuthCredential {
  return jwtDecode(token)
}

export type GoogleAuthCredential = {
  aud: string
  azp: string
  email: string
  email_verified: boolean
  exp: number
  family_name: string
  given_name: string
  iss: string
  jti: string
  name: string
  nbf: number
  picture: string
  sub: string
}
