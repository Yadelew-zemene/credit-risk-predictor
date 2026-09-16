import { z } from "zod";

export const applicantSchema = z.object({
  contract_type: z.enum(["Cash loans", "Revolving loans"]),

  gender: z.enum(["M", "F"]),

  owns_car: z.enum(["Y", "N"]),

  owns_realty: z.enum(["Y", "N"]),

  children_count: z
    .number()
    .int("Children count must be a whole number.")
    .min(0, "Children count cannot be negative."),

  family_members: z
    .number()
    .positive("Family members must be greater than 0."),

  family_status: z
    .string()
    .min(1, "Please select a family status."),

  education_type: z
    .string()
    .min(1, "Please select an education level."),

  income_type: z
    .string()
    .min(1, "Please select an income type."),

  occupation_type: z
    .string()
    .nullable(),

  housing_type: z
    .string()
    .min(1, "Please select a housing type."),

  annual_income: z
    .number()
    .positive("Annual income must be greater than 0."),

  credit_amount: z
    .number()
    .positive("Credit amount must be greater than 0."),

  annuity_amount: z
    .number()
    .positive("Annuity amount must be greater than 0."),

  goods_price: z
    .number()
    .positive("Goods price must be greater than 0.")
    .nullable(),

  age_years: z
    .number()
    .gt(18, "Applicant must be older than 18.")
    .lt(100, "Please enter a valid age."),

  employment_years: z
    .number()
    .min(0, "Employment years cannot be negative."),

  registration_years: z
    .number()
    .min(0, "Registration years cannot be negative."),

  id_published_years: z
    .number()
    .min(0, "ID published years cannot be negative."),

  car_age: z
    .number()
    .min(0, "Car age cannot be negative.")
    .nullable(),

  region_population_relative: z
    .number()
    .min(0, "Value cannot be negative.")
    .nullable(),

  region_rating: z
    .number()
    .int()
    .min(1)
    .max(3)
    .nullable(),

  region_rating_city: z
    .number()
    .int()
    .min(1)
    .max(3)
    .nullable(),

  external_source_1: z
    .number()
    .min(0)
    .max(1)
    .nullable(),

  external_source_2: z
    .number()
    .min(0)
    .max(1)
    .nullable(),

  external_source_3: z
    .number()
    .min(0)
    .max(1)
    .nullable(),
});

export type ApplicantFormValues = z.infer<typeof applicantSchema>;