import {
  Activity,
  Baby,
  Braces,
  Clock,
  Gem,
  HeartHandshake,
  Languages,
  MapPin,
  Microscope,
  ScanLine,
  ShieldCheck,
  Siren,
  Sparkles,
  Stethoscope,
  Syringe,
  Users,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS = {
  implant: Syringe,
  whitening: Sparkles,
  orthodontics: Braces,
  cosmetic: Gem,
  cleaning: ShieldCheck,
  pediatric: Baby,
  rootcanal: Activity,
  emergency: Siren,
  scan: ScanLine,
  heart: HeartHandshake,
  wallet: Wallet,
  users: Users,
  pin: MapPin,
  languages: Languages,
  clock: Clock,
  microscope: Microscope,
  tooth: Stethoscope,
} as const;

export type IconKey = keyof typeof ICONS;

/** Options offered in the admin treatment editor. */
export const ICON_KEYS = Object.keys(ICONS) as IconKey[];

interface IconProps {
  name: string;
  className?: string;
}

export function Icon({ name, className }: IconProps) {
  const Component = ICONS[name as IconKey] ?? ICONS.tooth;
  return <Component className={cn("h-5 w-5", className)} strokeWidth={1.6} aria-hidden />;
}
