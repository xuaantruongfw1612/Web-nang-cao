export class RegisterDto {
  student_code: string;
  full_name: string;
  email: string;
  password: string;
  avatar_url?: string;
}

export class LoginDto {
  email: string;
  password: string;
}