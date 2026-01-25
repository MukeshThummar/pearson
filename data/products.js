const products = [
  {
    id: "001",
    name: "Pearflam-SP",
    subtitle: "Aceclofenac, Serratiopeptidase & Paracetamol Tablets",
    composition: "Each tablet contains Aceclofenac (100mg), Serratiopeptidase (15mg), and Paracetamol (500mg)",
    indications: "For the treatment of pain and inflammation in conditions like rheumatoid arthritis, osteoarthritis, ankylosing spondylitis, dental pain, and post-operative inflammation",
    dosage: "Take this medicine in the dose and duration as advised by your doctor.",
    packaging: "10 strips of 10 tablets each box, Aluminium Foil",
    category: "Pain Relief",
    description: "Triple action formula for effective pain and inflammation management",
    image_folder: "pearflam",
    images: [
      "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d.jpg",
      "b1c2d3e4-f5a6-47b8-9c0d-1e2f3a4b5c6d.png",
      "c1d2e3f4-a5b6-47c8-9d0e-1f2a3b4c5d6e.png",
      // "d1e2f3a4-b5c6-47d8-9e0f-2a3b4c5d6e7f.png"
    ],
    mrp: 120
  },
  {
    id: "002",
    name: "Limson-LC",
    subtitle: "Levocetirizine & Montelukast Tablets",
    composition: "Levocetirizine (5mg) + Montelukast (10mg)",
    indications: "Allergic Rhinitis, Allergic rhinoconjunctivitis and Urticaria",
    dosage: "Take this medicine in the dose and duration as advised by your doctor.",
    packaging: "10 strips of 10 tablets each box",
    category: "Allergy Care",
    description: "Dual action allergy relief for Respiratory conditions",
    image_folder: "limson",
    images: [
      "e1f2a3b4-c5d6-47e8-9f0a-2b3c4d5e6f7a.jpg",
      "f1a2b3c4-d5e6-47f8-9a0b-3c4d5e6f7a8b.png",
      "a2b3c4d5-e6f7-47a9-9b0c-4d5e6f7a8b9c.png",
      "b2c3d4e5-f6a7-47b9-9c0d-5e6f7a8b9c0d.png",
      "c2d3e4f5-a6b7-47c9-9d0e-6f7a8b9c0d1e.png"
    ],
    mrp: 100
  },
  {
    id: "003",
    name: "Oflar-OZ",
    subtitle: "Ofloxacin & Ornidazole Tablets",
    composition: "Ofloxacin (200mg) + Ornidazole (500mg)",
    indications: "Acute diarrhea, dysentery, and other gastrointestinal infections",
    dosage: "Take this medicine in the dose and duration as advised by your doctor.",
    packaging: "10 strips of 10 tablets each box",
    category: "Antibiotic",
    description: "Broad spectrum antibiotic with anti-protozoal action",
    image_folder: "Oflar",
    images: [
      "d2e3f4a5-b6c7-47d9-9e0f-7a8b9c0d1e2f.jpg",
      "e2f3a4b5-c6d7-47e9-9f0a-8b9c0d1e2f3a.png",
      "f2a3b4c5-d6e7-47f9-9a0b-9c0d1e2f3a4b.png",
      "a3b4c5d6-e7f8-47a0-9b0c-0d1e2f3a4b5c.png",
      "b3c4d5e6-f8a9-47b0-9c0d-1e2f3a4b5c6d.png"
    ],
    mrp: 99
  },
  {
    id: "004",
    name: "Pearcef 200 DT",
    subtitle: "Cefixime Dispersible Tablets",
    composition: "Each dispersible tablet contains Cefixime (200mg)",
    indications: "This antibiotic used to treat various bacterial infections like respiratory tract infections (e.g., pneumonia), urinary tract infections, ear, nasal sinus, throat.",
    dosage: "Take this medicine in the dose and duration as advised by your doctor.",
    packaging: "10 strips of 10 dispersible tablets each box",
    category: "Antibiotic",
    description: "Third generation cephalosporin antibiotic in dispersible form",
    image_folder: "pearcef",
    images: [
      "c3d4e5f6-a7b8-47c0-9d0e-2f3a4b5c6d7e.jpg",
      "d3e4f5a6-b7c8-47d0-9e0f-3a4b5c6d7e8f.png",
      "e3f4a5b6-c7d8-47e0-9f0a-4b5c6d7e8f9a.png",
      "f3a4b5c6-d7e8-47f0-9a0b-5c6d7e8f9a0b.png",
      "a4b5c6d7-e8f9-47a1-9b0c-6d7e8f9a0b1c.png"
    ],
    mrp: 109
  },
  {
    id: "005",
    name: "Bitson-B12",
    subtitle: "Methylcobalamin (2500mcg) Injection",
    composition: "Each 1ml contains Methylcobalamin (2500mcg) with BD syringe (2ml),",
    indications: "Used in the treatment of peripheral neuropathy, vitamin B12 deficiency, and general weakness",
    dosage: "Take this medicine in the dose and duration as advised by your doctor. Administered IM/IV Only",
    packaging: "1X1ml Dispo Pack",
    category: "Injectable",
    description: "Advanced neurotropic supplement for nerve health",
    image_folder: "bitson",
    images: [
      "7a8b9c0d-e1f2-47a4-9b0c-3c4d5e6f7a8b.jpg",
      "8b9c0d1e-f2a3-47b4-9c0d-4d5e6f7a8b9c.png",
      "9c0d1e2f-a3b4-47c4-9d0e-5e6f7a8b9c0d.png"
    ],
    mrp: 99
  },
  {
    id: "006",
    name: "Clavson-CV 625",
    subtitle: "Amoxycillin & Potassium Clavulanate Tablets IP",
    composition: "Amoxycillin (500mg) + Clavulanic Acid (125mg)",
    indications: "Effective in respiratory tract infections, sinusitis, urinary tract infections, skin infections, and dental infections",
    dosage: "Take this medicine in the dose and duration as advised by your doctor.",
    packaging: "10 strips of 10 tablets each box",
    category: "Antibiotic",
    description: "Beta-lactam antibiotic with beta-lactamase inhibitor",
    image_folder: "clavson",
    images: [
      "b4c5d6e7-f8a9-47b1-9c0d-7e8f9a0b1c2d.jpg",
      "c4d5e6f7-a8b9-47c1-9d0e-8f9a0b1c2d3e.png",
      "d4e5f6a7-b8c9-47d1-9e0f-9a0b1c2d3e4f.png",
      "e4f5a6b7-c8d9-47e1-9f0a-0b1c2d3e4f5a.png"
    ],
    mrp: 195.5
  },
  {
    id: "007",
    name: "RSON-DSR",
    subtitle: "Rabeprazole Sodium (EC) & Domperidone (SR) Capsules",
    composition: "Rabeprazole Sodium (20mg) (enteric coated pellets) + Domperidone (30mg) (sustained release pellets)",
    indications: "GERD, acid reflux, and other gastric disorders",
    dosage: "Take this medicine in the dose and duration as advised by your doctor.",
    packaging: "10 strips of 10 capsules each box",
    category: "Gastro Care",
    description: "Proton pump inhibitor with prokinetic agent",
    image_folder: "rson",
    images: [
      "f4a5b6c7-d8e9-47f1-9a0b-1c2d3e4f5a6b.jpg",
      "a5b6c7d8-e9f0-47a2-9b0c-2d3e4f5a6b7c.jpg"
    ],
    mrp: 110
  },
  {
    id: "008",
    name: "Qcold-X",
    subtitle: "Terbutaline, Guaiphenesin, Ambroxol HCL & Menthol Syrup (Sugar free)",
    composition: "Each 5ml contains: Terbutaline (1.25mg), Guaiphenesin (50mg), Ambroxol HCL (15mg), Menthol (1mg) (Sugar free)",
    indications: "Relief from productive cough, congestion, and bronchospasm",
    dosage: "Take this medicine in the dose and duration as advised by your doctor.",
    packaging: "100ml bottle with measuring cap, Mix Fruit flavour",
    category: "Syrup",
    description: "Multi-action syrup for productive cough relief",
    image_folder: "qcoldx",
    images: [
      "b5c6d7e8-f9a0-47b2-9c0d-3e4f5a6b7c8d.jpg"
    ],
    mrp: 96
  },
  {
    id: "009",
    name: "Qcold-Dx",
    subtitle: "Dextromethorphan, Phenylephrine HCL & Chlorpheniramine Maleate Syrup (Sugar free)",
    composition: "Each 5ml contains: Dextromethorphan (15mg), Phenylephrine (5mg), Chlorpheniramine Maleate (2mg) (Sugar free)",
    indications: "Dry cough, cold, nasal congestion, and allergic symptoms",
    dosage: "Take this medicine in the dose and duration as advised by your doctor.",
    packaging: "100ml bottle with measuring cap, Strawberry flavour",
    category: "Syrup",
    description: "Effective dry cough suppressant with decongestant",
    image_folder: "qcolddx",
    images: [
      "c5d6e7f8-a9b0-47c2-9d0e-4f5a6b7c8d9e.jpg"
    ],
    mrp: 98
  },
  {
    id: "010",
    name: "Cefvit 1gm",
    subtitle: "Ceftriaxone Injection IP",
    composition: "Each vial contains Ceftriaxone Sodium equivalent to Ceftriaxone (1gm)",
    indications: "Bacterial infections including respiratory tract, urinary tract, skin, soft tissue, and gynecological infections",
    dosage: "Take this medicine in the dose and duration as advised by your doctor. Administered IM/IV Only",
    packaging: "Vial with sterile water for injection",
    category: "Injectable",
    description: "Third generation cephalosporin for severe infections",
    image_folder: "cefvit",
    images: [
      "d5e6f7a8-b9c0-47d2-9e0f-5a6b7c8d9e0f.jpg",
      "e5f6a7b8-c9d0-47e2-9f0a-6b7c8d9e0f1a.png",
      "f5a6b7c8-d9e0-47f2-9a0b-7c8d9e0f1a2b.png",
      "a6b7c8d9-e0f1-47a3-9b0c-8d9e0f1a2b3c.png"
    ],
    mrp: 66.64
  },
  {
    id: "011",
    name: "Cefpod-200",
    subtitle: "Cefpodoxime Proxetil Dispersible Tablets",
    composition: "Cefpodoxime Proxetil IP equivalent to Cefpodoxime (200mg), Excipients q.s., Colour: Sunset Yellow FCF",
    indications: "Used in the treatment of various bacterial infections, including respiratory tract infections, urinary tract infections, and skin infections",
    dosage: "As directed by the physician",
    packaging: "10 strips of 10 tablets each box",
    category: "Antibiotic",
    description: "Broad-spectrum cephalosporin antibiotic effective against a wide range of bacterial infections",
    image_folder: "cefpod",
    images: [
      "b6c7d8e9-f0a1-47b3-9c0d-9e0f1a2b3c4d.png",
      "c6d7e8f9-a0b1-47c3-9d0e-0f1a2b3c4d5e.png",
      "d6e7f8a9-b0c1-47d3-9e0f-1a2b3c4d5e6f.png",
      "e6f7a8b9-c0d1-47e3-9f0a-2b3c4d5e6f7a.png",
      // "f6a7b8c9-d0e1-47f3-9a0b-3c4d5e6f7a8b.jpg"
    ],
    mrp: 190
  }
];
