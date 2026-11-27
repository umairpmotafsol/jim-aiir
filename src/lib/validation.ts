import { z } from "zod";

export const email = z.string().trim().min(1, "Email is required.").email("Please enter a valid email address.");

export const password = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .regex(/[A-Za-z]/, "Password must include a letter.")
  .regex(/[0-9]/, "Password must include a number.");

export const phone = z
  .string()
  .trim()
  .min(1, "Phone is required.")
  .regex(/^\+?[0-9 ()-]{7,20}$/, "Please enter a valid phone number.");

export const addressSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required."),
  lastName: z.string().trim().min(1, "Last name is required."),
  company: z.string().trim().optional(),
  country: z.string().min(2, "Country is required."),
  address1: z.string().trim().min(1, "Street address is required."),
  address2: z.string().trim().optional(),
  city: z.string().trim().min(1, "Town / city is required."),
  county: z.string().trim().optional(),
  postcode: z.string().trim().min(1, "Postcode is required."),
});

export const checkoutSchema = z
  .object({
    email,
    phone,
    billing: addressSchema,
    shipToDifferent: z.boolean(),
    shipping: z.record(z.string(), z.string().optional()),
    notes: z.string().max(1000).optional(),
    createAccount: z.boolean(),
    accountPassword: z.string().optional(),
    paymentMethod: z.string().min(1, "Please choose a payment method."),
    terms: z.literal(true, { message: "Please accept the terms and conditions to continue." }),
  })
  .superRefine((v, ctx) => {
    if (v.shipToDifferent) {
      const r = addressSchema.safeParse(v.shipping);
      if (!r.success) {
        for (const issue of r.error.issues) {
          ctx.addIssue({ code: "custom", path: ["shipping", ...issue.path], message: issue.message });
        }
      }
    }
    if (v.createAccount) {
      const r = password.safeParse(v.accountPassword ?? "");
      if (!r.success) ctx.addIssue({ code: "custom", path: ["accountPassword"], message: r.error.issues[0].message });
    }
  });

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, "Email or username is required."),
  password: z.string().min(1, "Password is required."),
});

export const registerSchema = z.object({ email, password });

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(100),
  email,
  subject: z.string().trim().min(1, "Subject is required.").max(150),
  message: z.string().trim().min(10, "Please write at least 10 characters.").max(5000),
});

export const newsletterSchema = z.object({ email });

export const reviewSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  email,
  rating: z.coerce.number().int().min(1, "Please select a rating.").max(5, "Please select a rating."),
  review: z.string().trim().min(5, "Please write a short review."),
});

export const commentSchema = z.object({
  comment: z.string().trim().min(2, "Please type your comment.").max(5000),
  name: z.string().trim().min(1, "Name is required.").max(100),
  email,
  website: z.union([z.literal(""), z.string().trim().url("Please enter a valid URL.")]),
});

export const inquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  email,
  message: z.string().trim().min(5, "Please write your question before sending."),
});

export const vendorRegisterSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters.")
      .regex(/^[a-z0-9_.-]+$/i, "Use letters, numbers, dots, dashes or underscores."),
    email,
    firstName: z.string().trim().optional(),
    lastName: z.string().trim().optional(),
    storeName: z.string().trim().min(2, "Store name is required."),
    address1: z.string().trim().min(1, "Address is required."),
    address2: z.string().trim().optional(),
    country: z.string().min(2, "Country is required."),
    city: z.string().trim().optional(),
    county: z.string().trim().optional(),
    postcode: z.string().trim().min(1, "Postcode is required."),
    phone,
    aiir: z.string().trim().min(1, "AIIR is required."),
    password,
    confirmPassword: z.string(),
    terms: z.literal(true, { message: "Please agree to the Terms & Conditions." }),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export const vendorProductSchema = z
  .object({
    name: z.string().trim().min(2, "Product name is required."),
    regularPrice: z.coerce.number().positive("Price must be greater than 0."),
    salePrice: z.union([z.literal(""), z.coerce.number().positive("Sale price must be greater than 0.")]).optional(),
    stock: z.union([z.literal(""), z.coerce.number().int().min(0, "Stock cannot be negative.")]).optional(),
    categories: z.array(z.string()).min(1, "Pick at least one category."),
    description: z.string().trim().min(10, "Add a description of at least 10 characters."),
    // Library paths (/images/...) until the backend supports uploads.
    image: z
      .union([z.literal(""), z.string().regex(/^\/images\//, "Pick an image from the library."), z.string().url("Image must be a valid URL.")])
      .optional(),
    status: z.enum(["published", "draft"]),
  })
  .refine((v) => v.salePrice === "" || v.salePrice === undefined || v.salePrice < v.regularPrice, {
    path: ["salePrice"],
    message: "Sale price must be lower than the regular price.",
  });

export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
