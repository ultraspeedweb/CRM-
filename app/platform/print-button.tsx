"use client";

import { Printer } from "lucide-react";

export function PlatformPrintButton() {
  return <button className="secondary-button" type="button" onClick={() => window.print()}><Printer size={17}/> Print / PDF</button>;
}
