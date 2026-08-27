"use client";

import { useEffect, useState } from "react";
import { Save, Info, Truck, Loader2 } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const SettingsSchema = Yup.object().shape({
  storeName: Yup.string().required("Required"),
  contactEmail: Yup.string().email("Invalid email").required("Required"),
  contactPhone: Yup.string().required("Required"),
  shippingLahore: Yup.number().min(0).required("Required"),
  shippingOther: Yup.number().min(0).required("Required"),
  freeShippingThreshold: Yup.number().min(0).required("Required"),
  whatsapp: Yup.string().required("Required"),
});

export default function AdminSettings() {
  const [initialValues, setInitialValues] = useState({
    storeName: "Elegance Fashion",
    contactEmail: "hello@elegance.pk",
    contactPhone: "+92 300 1234567",
    shippingLahore: 200,
    shippingOther: 300,
    freeShippingThreshold: 5000,
    whatsapp: "+92 300 1234567",
  });

  useEffect(() => {
    // Fetch real settings if they exist
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24">
      <div>
        <h1 className="text-3xl font-serif">Store Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Configure your store details and business rules.</p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={SettingsSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            // Simulating API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert("Settings saved successfully!");
          } catch (err) {
            alert("Failed to save settings");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-8">
            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                <Info className="w-5 h-5 text-gray-400" />
                <h3 className="text-sm font-bold uppercase tracking-widest">General Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest">Store Name</label>
                    <Field 
                      name="storeName"
                      className="w-full p-4 text-sm border border-gray-100 bg-gray-50 rounded-lg focus:bg-white focus:outline-none focus:border-black transition-all"
                    />
                    <ErrorMessage name="storeName" component="div" className="text-red-500 text-[10px] uppercase font-bold" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest">Support Email</label>
                    <Field 
                      name="contactEmail"
                      type="email"
                      className="w-full p-4 text-sm border border-gray-100 bg-gray-50 rounded-lg focus:bg-white focus:outline-none focus:border-black transition-all"
                    />
                    <ErrorMessage name="contactEmail" component="div" className="text-red-500 text-[10px] uppercase font-bold" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest">Support Phone</label>
                    <Field 
                      name="contactPhone"
                      className="w-full p-4 text-sm border border-gray-100 bg-gray-50 rounded-lg focus:bg-white focus:outline-none focus:border-black transition-all"
                    />
                    <ErrorMessage name="contactPhone" component="div" className="text-red-500 text-[10px] uppercase font-bold" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest">WhatsApp Business</label>
                    <Field 
                      name="whatsapp"
                      className="w-full p-4 text-sm border border-gray-100 bg-gray-50 rounded-lg focus:bg-white focus:outline-none focus:border-black transition-all"
                    />
                    <ErrorMessage name="whatsapp" component="div" className="text-red-500 text-[10px] uppercase font-bold" />
                 </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                <Truck className="w-5 h-5 text-gray-400" />
                <h3 className="text-sm font-bold uppercase tracking-widest">Shipping & Delivery</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest">Shipping - Lahore</label>
                    <Field 
                      name="shippingLahore"
                      type="number"
                      className="w-full p-4 text-sm border border-gray-100 bg-gray-50 rounded-lg focus:bg-white focus:outline-none focus:border-black transition-all"
                    />
                    <ErrorMessage name="shippingLahore" component="div" className="text-red-500 text-[10px] uppercase font-bold" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest">Shipping - Others</label>
                    <Field 
                      name="shippingOther"
                      type="number"
                      className="w-full p-4 text-sm border border-gray-100 bg-gray-50 rounded-lg focus:bg-white focus:outline-none focus:border-black transition-all"
                    />
                    <ErrorMessage name="shippingOther" component="div" className="text-red-500 text-[10px] uppercase font-bold" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest">Free Shipping (Above)</label>
                    <Field 
                      name="freeShippingThreshold"
                      type="number"
                      className="w-full p-4 text-sm border border-gray-100 bg-gray-50 rounded-lg focus:bg-white focus:outline-none focus:border-black transition-all"
                    />
                    <ErrorMessage name="freeShippingThreshold" component="div" className="text-red-500 text-[10px] uppercase font-bold" />
                 </div>
              </div>
            </div>

            <div className="flex justify-end">
               <button 
                type="submit"
                disabled={isSubmitting}
                className="bg-black text-white px-10 py-5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gray-800 transition-all shadow-xl disabled:opacity-50"
               >
                 {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                 {isSubmitting ? "Saving..." : "Save Settings"}
               </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
