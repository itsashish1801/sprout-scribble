"use client";

import Link from "next/link";

type BackButtonProps = {
  href: string;
  label: string;
  text: string;
};

export default function BackButton({ href, label, text }: BackButtonProps) {
  return (
    <>
      {text}{" "}
      <Link href={href} className="underline">
        {label}
      </Link>
    </>
  );
}
