"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import PhoneField from "./PhoneField";

function ErrorTooltip({
  message,
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className={`absolute left-2 lg:left-1/2 lg:-translate-x-1/2 -bottom-7 z-20 ${className ?? ""}`}
        >
          <div className="bg-black text-white text-[10px] lg:text-xs font-body px-2 py-0.5 lg:px-4 lg:py-1.5 lg:whitespace-nowrap max-w-[220px] lg:max-w-none">
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const contactSchema = z.object({
  name: z.string().min(1, "what's your name?").max(80, "name is too long"),
  phone: z.string().min(1, "what's your phone?").max(30, "phone is too long"),
  email: z
    .string()
    .min(1, "your e-mail plz")
    .max(120, "e-mail is too long")
    .email("this doesn't look like a valid e-mail"),
  message: z.string().min(1, "tell us about your project").max(2000),
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
    "w-full h-14 lg:h-24 bg-white-soft border-2 border-transparent outline-none font-body text-sm text-black placeholder:text-text-muted placeholder:text-center text-center transition-all overflow-hidden px-6 focus:border-black focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";

  const inputErrorClasses = "ring-1 ring-red-400/60";

  return (
    <section id="contact" className="py-24 mx-4 lg:mx-12">
      <h2 className="font-body font-medium text-[clamp(1.5rem,3vw,2rem)] text-center mb-10 text-black">
        talk to me
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="w-[95%] lg:w-[80%] mx-auto flex flex-col gap-8"
      >
        {/* Name */}
        <div className="relative">
          <input
            {...register("name")}
            placeholder="name"
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
                className={`h-14 lg:h-24 bg-white-soft border-2 transition-all ${phoneFocused ? "border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "border-transparent"} ${errors.phone ? inputErrorClasses : ""}`}
              >
                <PhoneField
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder="phone"
                  focused={phoneFocused}
                  onFocus={() => setPhoneFocused(true)}
                  onBlur={() => setPhoneFocused(false)}
                />
              </div>
            )}
          />
          <ErrorTooltip message={errors.phone?.message} />
        </div>

        {/* Email */}
        <div className="relative">
          <input
            {...register("email")}
            type="text"
            placeholder="e-mail"
            maxLength={120}
            className={`${inputClasses} ${errors.email ? inputErrorClasses : ""}`}
          />
          <ErrorTooltip message={errors.email?.message} />
        </div>

        {/* Message */}
        <div className="relative">
          <div className="relative min-h-[256px]">
            <textarea
              {...register("message", {
                onChange: (e) => {
                  const el = e.target;
                  el.style.height = "auto";
                  el.style.height = Math.max(220, el.scrollHeight) + "px";
                },
              })}
              onFocus={() => setMessageFocused(true)}
              onBlur={() => setMessageFocused(false)}
              maxLength={2000}
              style={{ textAlign: "center" }}
              className={`${inputClasses} min-h-[256px] resize-none placeholder:text-transparent pt-[96px] lg:pt-[88px] ${errors.message ? inputErrorClasses : ""}`}
            />
            {!messageValue && !messageFocused && (
              <span className="absolute inset-0 flex items-center justify-center text-center text-sm text-text-muted pointer-events-none px-6">
                Short or long message, I&apos;m here to understand your project.
              </span>
            )}
            <ErrorTooltip
              message={errors.message?.message}
              className="!-bottom-[22px]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={status === "sending"}
          className="relative overflow-hidden group self-center mt-4 bg-white text-black font-semibold
            text-sm px-12 py-2.5 lg:text-base lg:px-20 lg:py-3
            border-2 border-transparent transition-all duration-200
            hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
            hover:-translate-y-1 hover:-translate-x-1
            active:translate-y-0 active:translate-x-0 active:shadow-none
            whitespace-nowrap disabled:opacity-60"
        >
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-200 pointer-events-none">
            <Image src="/FundoAmarelo.png" alt="" fill className="object-cover" />
          </span>
          <span className="relative z-10">{status === "sending" ? "sending..." : "send"}</span>
        </button>

        <p className="text-center text-xs font-body text-black/40 -mt-4">
          by sending, you authorize the use of your contact data
        </p>

        {status === "success" && (
          <div className="self-center bg-black text-white text-xs font-body px-6 py-2">
            thanks — i&apos;ll be in touch ASAP
          </div>
        )}
        {status === "error" && (
          <div className="self-center bg-black text-white text-xs font-body px-6 py-2">
            something went wrong — please try again
          </div>
        )}
      </form>
    </section>
  );
}
