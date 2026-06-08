import React from "react";
import { Header } from "./components/landing/Header";
import { Hero } from "./components/landing/Hero";
import { Highlights } from "./components/landing/Highlights";
import { AboutSchool } from "./components/landing/AboutSchool";
import { WhyChooseUs } from "./components/landing/WhyChooseUs";
import { AcademicPrograms } from "./components/landing/AcademicPrograms";
import { Facilities } from "./components/landing/Facilities";
import { Achievements } from "./components/landing/Achievements";
import { Gallery } from "./components/landing/Gallery";
import { VirtualCampusTour } from "./components/landing/VirtualCampusTour";
import { Testimonials } from "./components/landing/Testimonials";
import { AdmissionProcess } from "./components/landing/AdmissionProcess";
import { LatestNews } from "./components/landing/LatestNews";
import { FAQ } from "./components/landing/FAQ";
import { Contact } from "./components/landing/Contact";
import { Footer } from "./components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Highlights />
      <AboutSchool />
      <WhyChooseUs />
      <AcademicPrograms />
      <Facilities />
      <Achievements />
      <Gallery />
      <VirtualCampusTour />
      <Testimonials />
      <AdmissionProcess />
      <LatestNews />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
}
