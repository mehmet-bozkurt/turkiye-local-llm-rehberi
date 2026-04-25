import { Layout } from "./components/Layout";
import type { NavItem } from "./components/SideNav";
import { Intro } from "./components/sections/Intro";
import { ProblemTanimi } from "./components/sections/ProblemTanimi";
import { Donanim } from "./components/sections/Donanim";
import { Modeller } from "./components/sections/Modeller";
import { Runtimes } from "./components/sections/Runtimes";
import { Senaryolar } from "./components/sections/Senaryolar";
import { Maliyet } from "./components/sections/Maliyet";
import { FizibiliteMatrisi } from "./components/sections/FizibiliteMatrisi";
import { Sonuc } from "./components/sections/Sonuc";
import { ButceOnerileri } from "./components/sections/ButceOnerileri";
import { ArastirmaNotlari } from "./components/sections/ArastirmaNotlari";
import { MacMini16 } from "./components/sections/MacMini16";
import { SenaryoKarsilastirma } from "./components/sections/SenaryoKarsilastirma";
import { ModelEvreni } from "./components/sections/ModelEvreni";
import { KodlamaGuvenlik } from "./components/sections/KodlamaGuvenlik";

const navItems: NavItem[] = [
  { id: "intro", number: "00", label: "Giriş & Özet" },
  { id: "problem", number: "01", label: "Problem Tanımı" },
  { id: "donanim", number: "02", label: "Donanım" },
  { id: "modeller", number: "03", label: "Modeller" },
  { id: "runtimes", number: "04", label: "Runtime Kıyası" },
  { id: "senaryolar", number: "05", label: "Kullanım Senaryoları" },
  { id: "maliyet", number: "06", label: "Maliyet & TCO" },
  { id: "fizibilite", number: "07", label: "Fizibilite Matrisi" },
  { id: "sonuc", number: "08", label: "Sonuç & Öneri" },
  { id: "butce", number: "09", label: "Bütçe Önerileri" },
  { id: "arastirma", number: "10", label: "Araştırma Notları" },
  { id: "mac-mini-16", number: "11", label: "4× Mac mini 16GB" },
  { id: "senaryo-karsilastirma", number: "12", label: "3-Yollu Senaryo Kıyası" },
  { id: "model-evreni", number: "13", label: "Model Evreni 2026-Q2" },
  { id: "kodlama-guvenlik", number: "14", label: "Kodlama + Güvenlik" },
];

export default function App() {
  return (
    <Layout navItems={navItems}>
      <Intro />
      <ProblemTanimi />
      <Donanim />
      <Modeller />
      <Runtimes />
      <Senaryolar />
      <Maliyet />
      <FizibiliteMatrisi />
      <Sonuc />
      <ButceOnerileri />
      <ArastirmaNotlari />
      <MacMini16 />
      <SenaryoKarsilastirma />
      <ModelEvreni />
      <KodlamaGuvenlik />
    </Layout>
  );
}
