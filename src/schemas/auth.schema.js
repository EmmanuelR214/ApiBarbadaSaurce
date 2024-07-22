import { z } from "zod";

const phoneRegExp = /^[0-9 ()+-]{10,15}$/;

export const registerSchema = z.object({
  nombre: z.string()
    .refine(data => data.trim() !== '', {
      message: 'Username is required',
    })
    .refine(data => data.length >= 3 && data.length <= 50, {
      message: 'Username must be between 3 and 50 characters',
    }),
  telefono: z.string()
    .refine(data => data.trim() !== '', {
      message: 'Phone number cannot be empty',
    })
    .refine(data => phoneRegExp.test(data), {
      message: 'Formato de numero invalido',
    }),
  password: z.string()
    .refine(data => data.trim() !== '', {
      message: 'Password cannot be empty',
    })
    .refine(data => data.length >= 8, {
      message: 'Password must be at least 8 characters long',
    }),
});



/*

export const registerSchema = z.object({
  nombre: z.string({
    required_error: 'Username is required',
    min: 3,
    max: 50,
    nonempty: true,
  }),
  telefono: z.string({
    required_error: 'Phone number is required',
    min: 10,
    max: 15,
    nonempty: true,
  }),
  contraseña: z.string({
    required_error: 'Password is required',
    min: 8,
    max: 20,
    nonempty: true,
  }),
});

*/