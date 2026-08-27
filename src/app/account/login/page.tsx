"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const [error, setError] = useState("");
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-24 min-h-[70vh] flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-4xl md:text-5xl font-serif mb-8 text-center uppercase tracking-tighter">Login</h1>
        
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setError("");
            try {
              const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
              });

              if (res.ok) {
                const data = await res.json();
                dispatch(setUser(data.user));
                router.push("/");
              } else {
                const data = await res.json();
                setError(data.error || "Invalid credentials");
              }
            } catch (err) {
              setError("Something went wrong. Please try again.");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              {error && <p className="text-red-500 text-xs text-center font-bold uppercase">{error}</p>}
              <div className="space-y-4">
                <div className="space-y-1">
                  <Field 
                    name="email"
                    type="email" 
                    placeholder="Email" 
                    className="w-full p-4 text-sm border border-gray-200 focus:outline-none focus:border-black bg-white rounded-lg"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-[10px] uppercase font-bold" />
                </div>
                <div className="space-y-1">
                  <Field 
                    name="password"
                    type="password" 
                    placeholder="Password" 
                    className="w-full p-4 text-sm border border-gray-200 focus:outline-none focus:border-black bg-white rounded-lg"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-[10px] uppercase font-bold" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link href="/account/forgot" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black">
                  Forgot your password?
                </Link>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white text-xs font-bold uppercase tracking-widest py-5 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-12 pt-8 border-t border-gray-100 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">New to Elegance?</p>
          <Link 
            href="/account/register"
            className="inline-block text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
