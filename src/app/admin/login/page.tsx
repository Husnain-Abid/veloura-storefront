"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/authSlice";
import { ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const AdminLoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

export default function AdminLoginPage() {
  const dispatch = useAppDispatch();
  const [error, setError] = useState("");
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-serif uppercase tracking-tighter">Admin Portal</h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">Secure Management Access</p>
        </div>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={AdminLoginSchema}
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
                if (data.user.role !== "admin") {
                  setError("Unauthorized. Admin access only.");
                  return;
                }
                dispatch(setUser(data.user));
                router.push("/admin");
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
                    placeholder="Admin Email" 
                    className="w-full p-4 text-sm border border-gray-100 focus:outline-none focus:border-black bg-gray-50 rounded-xl transition-all"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-[10px] uppercase font-bold" />
                </div>
                <div className="space-y-1">
                  <Field 
                    name="password"
                    type="password" 
                    placeholder="Password" 
                    className="w-full p-4 text-sm border border-gray-100 focus:outline-none focus:border-black bg-gray-50 rounded-xl transition-all"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-[10px] uppercase font-bold" />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white text-xs font-bold uppercase tracking-widest py-5 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Authenticate <ArrowRight className="w-4 h-4" /></>}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
