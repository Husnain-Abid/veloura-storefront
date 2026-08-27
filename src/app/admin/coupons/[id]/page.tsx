"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Save,
  Loader2,
  Tag
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const CouponSchema = Yup.object().shape({
  code: Yup.string().required("Required"),
  discountType: Yup.string().required("Required"),
  discountValue: Yup.number().positive("Must be positive").required("Required"),
  minOrderAmount: Yup.number().min(0, "Cannot be negative"),
  usageLimit: Yup.number().positive("Must be positive"),
});

export default function CouponEditor() {
  const router = useRouter();
  const { id } = useParams();
  const isEdit = id && id !== "new";
  
  const [loading, setLoading] = useState(isEdit ? true : false);
  const [initialValues, setInitialValues] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "0",
    usageLimit: "",
    isActive: true,
  });

  useEffect(() => {
    if (isEdit) {
      const fetchCoupon = async () => {
        // Need detail API or fetch all and find
        const res = await fetch(`/api/admin/coupons`);
        const data = await res.json();
        const coupon = data.find((c: any) => c.id === id);
        if (coupon) {
          setInitialValues({
            ...coupon,
            discountValue: coupon.discountValue.toString(),
            minOrderAmount: coupon.minOrderAmount?.toString() || "0",
            usageLimit: coupon.usageLimit?.toString() || "",
          });
        }
        setLoading(false);
      };
      fetchCoupon();
    }
  }, [id, isEdit]);

  if (loading) return <div className="p-24 text-center">Loading coupon...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <Link 
          href="/admin/coupons"
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Coupons
        </Link>
        <h1 className="text-2xl font-serif">{isEdit ? "Edit Coupon" : "Create Coupon"}</h1>
      </div>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={CouponSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            // Simplified: Use a single admin coupon API for create/update if needed
            // For now, let's assume we implement /api/admin/coupons POST/PUT
            alert("Coupon saved (Mock)");
            router.push("/admin/coupons");
          } catch (err) {
            alert("Error saving coupon");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6">
            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest">Coupon Code</label>
                <Field name="code" className="w-full p-4 text-sm border border-gray-100 bg-gray-50 rounded-lg focus:outline-none focus:border-black" placeholder="SUMMER50" />
                <ErrorMessage name="code" component="div" className="text-red-500 text-[10px] uppercase font-bold" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest">Discount Type</label>
                  <Field name="discountType" as="select" className="w-full p-4 text-sm border border-gray-100 bg-gray-50 rounded-lg focus:outline-none focus:border-black appearance-none">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (PKR)</option>
                  </Field>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest">Discount Value</label>
                  <Field name="discountValue" type="number" className="w-full p-4 text-sm border border-gray-100 bg-gray-50 rounded-lg focus:outline-none focus:border-black" />
                  <ErrorMessage name="discountValue" component="div" className="text-red-500 text-[10px] uppercase font-bold" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest">Min. Order Amount</label>
                  <Field name="minOrderAmount" type="number" className="w-full p-4 text-sm border border-gray-100 bg-gray-50 rounded-lg focus:outline-none focus:border-black" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest">Usage Limit</label>
                  <Field name="usageLimit" type="number" className="w-full p-4 text-sm border border-gray-100 bg-gray-50 rounded-lg focus:outline-none focus:border-black" />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <Field type="checkbox" name="isActive" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Active</span>
              </label>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white px-10 py-5 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-xl disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSubmitting ? "Saving..." : "Save Coupon"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
