"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PhoneField from "./PhoneField";

function ErrorTooltip({ message }: { message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="absolute left-1/2 -translate-x-1/2 -bottom-7 z-20"
        >
          <div className="bg-[#0A0A0A] text-white text-xs font-body px-4 py-1.5 whitespace-nowrap">
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const contactSchema = z.object({
  name: z
    .string()
    .min(1, "What's your name?")
    .max(80, "Name is too long"),
  phone: z.string().optional(),
  email: z
    .string()
    .min(1, "We need your e-mail")
    .max(120, "E-mail is too long")
    .email("This doesn't look like a valid e-mail"),
  message: z.string().min(1, "Tell us about your project").max(2000),
});

type ContactData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
  });

  const [messageFocused, setMessageFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const messageValue = watch("message");

  const onSubmit = async (data: ContactData) => {
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  const inputClasses =
    "w-full h-24 bg-[#FCFCFC] border-2 border-transparent outline-none font-body text-sm text-black placeholder:text-text-muted placeholder:text-center text-center transition-all overflow-hidden px-6 focus:border-black focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";

  const inputErrorClasses = "ring-1 ring-red-400/60";

  return (
    <section id="contact" className="py-24">
      <h2 className="font-body font-medium text-[clamp(1.5rem,3vw,2rem)] text-center mb-10 text-black">
        talk to me
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="w-[80%] mx-auto flex flex-col gap-8"
      >
        {/* Name */}
        <div className="relative">
          <input
            {...register("name")}
            placeholder="Name"
            maxLength={80}
            className={`${inputClasses} ${errors.name ? inputErrorClasses : ""}`}
          />
          <ErrorTooltip message={errors.name?.message} />
        </div>

        {/* Phone */}
        <div className="relative">
          <Controller
            name="phone"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <div
                className={`h-24 bg-[#FCFCFC] border-2 transition-all ${phoneFocused ? "border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "border-transparent"}`}
              >
                <PhoneField
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder="Phone"
                  focused={phoneFocused}
                  onFocus={() => setPhoneFocused(true)}
                  onBlur={() => setPhoneFocused(false)}
                />
              </div>
            )}
          />
        </div>

        {/* Email */}
        <div className="relative">
          <input
            {...register("email")}
            type="text"
            placeholder="E-mail"
            maxLength={120}
            className={`${inputClasses} ${errors.email ? inputErrorClasses : ""}`}
          />
          <ErrorTooltip message={errors.email?.message} />
        </div>

        {/* Message */}
        <div className="relative min-h-[256px]">
          <textarea
            {...register("message", {
              onChange: (e) => {
                const el = e.target;
                el.style.height = "auto";
                el.style.height = Math.max(256, el.scrollHeight) + "px";
              },
            })}
            onFocus={() => setMessageFocused(true)}
            onBlur={() => setMessageFocused(false)}
            maxLength={2000}
            className={`${inputClasses} min-h-[256px] resize-none py-4 overflow-hidden placeholder:text-transparent ${errors.message ? inputErrorClasses : ""}`}
          />
          {!messageValue && !messageFocused && (
            <span className="absolute inset-0 flex items-center justify-center text-sm text-text-muted pointer-events-none">
              Short or long message, I&apos;m here to understand your project.
            </span>
          )}
          <ErrorTooltip message={errors.message?.message} />
        </div>

        <button
          type="submit"
          disabled={status === "sending"}
          className="self-center mt-4 bg-white text-black font-semibold px-14 py-3 border-2 border-transparent transition-all duration-200 hover:bg-[#FACC15] hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 active:translate-y-0 active:translate-x-0 active:shadow-none disabled:opacity-60"
        >
          {status === "sending" ? "sending..." : "send"}
        </button>

        {status === "success" && (
          <p className="text-center text-sm text-green-600 mt-2">
            Message sent! I&apos;ll get back to you soon.
          </p>
        )}
        {status === "error" && (
          <p className="text-center text-sm text-red-500 mt-2">
            Something went wrong. Please try again.
          </p>
        )}
      </form>
    </section>
  );
}
