"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Icons } from "./icons";
import Link from "next/link";
import { cn } from "@/lib/utils/utils";

const TELEGRAM_LINK = "https://t.me/elvida_kulbako";
const INSTAGRAM_LINK = "https://instagram.com/psy.elvida_kulbako";
const FACEBOOK_LINK = "https://facebook.com/elvida.tretyak";
const VIBER_LINK = "viber://chat?number=%2B380673530775";

type ContactModalProps = {
  children: React.ReactNode;
};

const contactLinks = [
  { name: "Facebook", icon: "facebook" as const, href: FACEBOOK_LINK },
  { name: "Telegram", icon: "telegram" as const, href: TELEGRAM_LINK },
  { name: "Instagram", icon: "instagram" as const, href: INSTAGRAM_LINK },
  { name: "Viber", icon: "viber" as const, href: VIBER_LINK },
];

const ContactModal = ({ children }: ContactModalProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {children}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[420px] p-6 bg-[#F5F5F0]">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-display">
              Оберіть спосіб зв&apos;язку зі мною
            </DialogTitle>
          </DialogHeader>

          {/* Icons grid */}
          <div className="grid grid-cols-2 gap-4 py-4 sm:grid-cols-4">
            {contactLinks.map((contact) => {
              const IconComponent = Icons[contact.icon];
              return (
                <Link
                  key={contact.name}
                  href={contact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white/50 transition-colors"
                >
                  <IconComponent className="w-14 h-14" color="#42412D" />
                  <span className="text-sm font-medium text-gray-700">
                    {contact.name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Response time text */}
          <p className="text-center text-sm text-gray-600">
            Відповідаю на повідомлення протягом 1 год
          </p>

          {/* Contact button */}
          <div
            className={cn(
              "w-full max-w-[264px] mx-auto p-[6px] border-[0.5px] border-[#42412d] rounded-[100px]",
            )}
          >
            <Link
              href={TELEGRAM_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gradient w-full h-[50px] text-[18px] font-semibold flex items-center justify-center"
            >
              Зв&apos;язатися
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContactModal;
