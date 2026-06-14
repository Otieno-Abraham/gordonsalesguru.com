/**
 * data.ts — hand-authored static content used across pages.
 * Edit these arrays to update FAQs, the sales process, testimonials, etc.
 * (Testimonials are placeholders — swap in real client quotes as they come in.)
 */

export interface FAQ {
  question: string;
  answer: string;
}

export const homepageFaqs: FAQ[] = [
  {
    question: "What areas in East Africa do you serve?",
    answer:
      "I'm based in Nairobi and serve clients right across Kenya — Nairobi, Mombasa, Nakuru, Kisumu and beyond. I also deliver and install premium kitchens, wardrobes, bathrooms and full interior fitouts for clients in Uganda, Tanzania and Rwanda. Wherever you are in East Africa, we can make it work.",
  },
  {
    question: "How long does production and delivery take?",
    answer:
      "Most custom projects move from approved design to installation in around 4 to 8 weeks, depending on the size and finish you choose. I give you a clear timeline up front during your consultation, keep you updated at every stage, and coordinate shipping and installation so there are no surprises.",
  },
  {
    question: "Can I see the products before ordering?",
    answer:
      "Absolutely. Visit my showroom at Aryan Centre, Block 14, behind Subaru Kenya on Mombasa Road, Nairobi, to see and feel the materials, finishes and hardware in person. If you can't make it in, I'm happy to walk you through everything over WhatsApp with photos and videos.",
  },
  {
    question: "How does the custom design process work?",
    answer:
      "It's simple. We start with a conversation about your space and how you live in it. I take measurements, propose a tailored design, and refine it with you until it's exactly right. Once you approve the design and quote, your units go into production, then I handle delivery and a clean, professional installation.",
  },
  {
    question: "How do I get started?",
    answer:
      "The easiest way is to message me directly on WhatsApp or fill in the consultation form on this site. Tell me a little about your project and I'll get back to you within two hours during business hours to arrange your free consultation.",
  },
];

export interface ProcessStep {
  number: number;
  title: string;
  description: string;
}

export const processSteps: ProcessStep[] = [
  {
    number: 1,
    title: "Enquiry",
    description:
      "Reach out on WhatsApp or through the form. Tell me about your space, your style and what you want to achieve.",
  },
  {
    number: 2,
    title: "Design Consultation",
    description:
      "We meet — at your space or my showroom — to take measurements and shape a design tailored to how you live and work.",
  },
  {
    number: 3,
    title: "Custom Quote",
    description:
      "You receive a clear, detailed proposal with materials, finishes and a realistic timeline. No guesswork, no pressure.",
  },
  {
    number: 4,
    title: "Production & Shipping",
    description:
      "Once approved, your units are precision-built to spec and carefully shipped. I keep you updated at every milestone.",
  },
  {
    number: 5,
    title: "Installation & Handover",
    description:
      "My team installs everything to a flawless finish, walks you through the result and stands behind it with after-sales support.",
  },
];

export interface WhyChoose {
  title: string;
  description: string;
  icon: "handshake" | "clock" | "shield";
}

export const whyChoose: WhyChoose[] = [
  {
    title: "Personal Service",
    description:
      "You deal directly with me — Gordon — from first message to final handover. One point of contact who genuinely cares about getting your project right.",
    icon: "handshake",
  },
  {
    title: "On-Time Delivery",
    description:
      "Clear timelines and honest updates. I coordinate production, shipping and installation so your project lands when I say it will.",
    icon: "clock",
  },
  {
    title: "Quality Guaranteed",
    description:
      "Premium materials, precision craftsmanship and a finish built to last in East Africa's climate — backed by dependable after-sales support.",
    icon: "shield",
  },
];

export interface Testimonial {
  name: string;
  location: string;
  productType: string;
  quote: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "Achieng' O.",
    location: "Kilimani, Nairobi",
    productType: "Custom Kitchen Cabinets",
    quote:
      "Gordon understood exactly what I wanted for my kitchen and delivered beyond it. The finish is immaculate and the whole process was stress-free from start to finish.",
  },
  {
    name: "David M.",
    location: "Westlands, Nairobi",
    productType: "Fitted Wardrobes",
    quote:
      "The fitted wardrobes transformed our bedroom. Gordon kept us informed at every stage and the installation team was professional and tidy. Highly recommend.",
  },
  {
    name: "Sarah K.",
    location: "Kampala, Uganda",
    productType: "Full Interior Fitout",
    quote:
      "Working with Gordon across borders was effortless. Great communication, on-time delivery and a beautiful result for our apartment. Worth every bit of the trust.",
  },
];

export const aboutBio = {
  intro:
    "I'm Gordon Odhiambo — a Sales Executive who has built a career around one simple promise: premium interiors, delivered personally.",
  paragraphs: [
    "For years I've helped homeowners, developers and businesses across East Africa turn ordinary spaces into beautifully functional ones. My focus is custom kitchen cabinets, fitted wardrobes, bathroom vanities and complete interior fitouts — the pieces of a home or office you live with every single day.",
    "What sets my service apart isn't just the quality of the products, although that matters enormously. It's that you deal with me directly, from your very first message to the day we hand over your finished space. No call centres, no being passed around — just one expert who takes the time to understand your space, your taste and your budget, and then makes it happen.",
    "I'm based in Nairobi, with a showroom on Mombasa Road where you can see and feel the materials for yourself. From there I serve clients throughout Kenya and across Uganda, Tanzania and Rwanda. Whether it's a single statement kitchen or a full multi-room fitout, I bring the same care, honesty and attention to detail to every project.",
    "If you're planning a project, I'd love to hear about it. Reach out on WhatsApp or book a showroom visit — and let's create something you'll be proud of for years to come.",
  ],
  skills: [
    "Lead generation",
    "Client management",
    "Deal negotiation",
    "Project coordination",
    "After-sales support",
  ],
};
