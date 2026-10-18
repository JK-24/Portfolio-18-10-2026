// EDIT THIS FILE for all portfolio text, links, projects and drawings.
// Image/PDF paths are relative to index.html, not this JS file.
export const profile = {
  name: 'Jaikrishna Sekaran',
  pageTitle: 'Jaikrishna Sekaran — AI, Code & Creative Thinking',
  headline: ['LEARN.', 'BUILD.', 'IMAGINE.'],
  introduction: 'Computer Science student at Amrita, exploring machine learning, computer vision and scientific computing through hands-on projects.',
  role: 'AI / ML · Computer Vision · Scientific Computing',
  availability: 'Open to AI/ML opportunities',
  location: 'Salem, Tamil Nadu',
  email: 'jaikrishnasekaran@gmail.com',
  phone: '+919489663387',
  linkedin: 'https://www.linkedin.com/in/jaikrishna-sekaran/',
  resume: 'attachments/Jaikrishna_Sekaran_Resume.pdf',
  portraitLabel: 'A polygon study in curiosity'
};

export const ui = {
  brand: 'JS / PORTFOLIO',
  navigation: { projects: 'Projects', contact: 'Contact ↗' },
  motion: { pause: 'Pause motion', resume: 'Resume motion' },
  introEyebrow: 'CODE, CURIOSITY & CREATIVE THINKING',
  scrollPrompt: 'Scroll to connect ↓',
  contactEyebrow: 'THE PERSON BEHIND THE CONNECTIONS',
  contactHeading: 'Let’s build\nsomething meaningful.',
  contactLabels: { email: 'Get in touch', resume: 'Download résumé', linkedin: 'LinkedIn', phone: 'Call' },
  close: 'Close ×',
  closeAriaLabel: 'Close details',
  itemLink: 'View work ↗',
  imageUnavailable: 'Image unavailable.',
  viewAll: 'View all',
  emptyMessage: 'More to come.',
  // Number of item buttons shown beside the graph, before the View all button.
  visibleItems: 3
};

export const sections = {
  education: {
    id: 'education', label: 'Education', kicker: '01 / FOUNDATIONS',
    title: 'Curiosity,\nwith foundations.',
    description: 'B.Tech in Computer Science Engineering at Amrita Vishwa Vidyapeetham, Coimbatore. Expected graduation: June 2027.',
    items: [
      {
        title: 'Amrita Vishwa Vidyapeetham',
        body: 'B.Tech in Computer Science Engineering\nCoimbatore · August 2023–June 2027 (expected)\nCGPA: 8.28/10\n\nMy interests span AI/ML, computer vision, algorithms and experimentation.'
      },
      {
        title: 'School education',
        body: 'GlazeBrooke Public School, Salem\n\nGrade 12 · June 2022–March 2023\n93.8%\n\nGrade 10 · Completed 2021\n95.8%\n\nJEE Mains: 91.7 percentile'
      },
      {
        title: 'Technical toolkit',
        body: 'LANGUAGES\nPython, C, C++\n\nFRAMEWORKS & LIBRARIES\nOpenCV, TensorFlow, PyTorch, FEniCSx, Pandas, NumPy, Scikit-Learn, Plotly, Dash, Streamlit, FAISS\n\nTOOLS & PLATFORMS\nVS Code, Git, GitHub, GCP, Webots, STM32, Gmsh, Blender\n\nCORE COMPETENCIES\nData structures and algorithms, machine learning, computer vision, signal processing, cryptography, FEM mesh generation and interval trees'
      },
      {
        title: 'Google IT Automation with Python',
        body: 'Professional certification: Google IT Automation with Python.',
        url: 'https://coursera.org/verify/professional-cert/BT044KVRAFZM'
      }
    ]
  },
  internships: {
    id: 'internships', label: 'Internships', kicker: '02 / EXPERIENCE',
    title: 'Learning through\nreal problems.',
    description: 'Research and development across embedded ML, scientific simulation and legal-document retrieval.',
    items: [
      {
        title: 'SONY SSUP · AgroESP',
        body: 'MODEL DEVELOPER · August 2024–August 2025\n\nDeveloped and integrated machine learning models to estimate food-drying processes in a polyhouse environment. Contributed to data analysis, image-based modelling and optimisation under embedded-system constraints using Sony Spresense.'
      },
      {
        title: 'SyberGate Technologies',
        body: 'SOFTWARE DEVELOPER · September 2025–February 2026\n\nWorked on Python simulation models for the chlor-alkali process using Gmsh and FEniCSx. Engineered non-uniform layered meshes for anode, membrane and cathode regions to simulate ion movement and address concentration-drop artefacts. Used multiprocessing and interactive Plotly, Dash and Streamlit dashboards to support computation and analysis.'
      },
      {
        title: 'Landcheck',
        body: 'AI ENGINEER · March–June 2026\n\nDeveloped a legal-document RAG system for TNRERA complaint records: web scraping, OCR extraction and cleaning, metadata-aware chunking, FAISS retrieval, Gemini-powered semantic search and Streamlit deployment. Processed over 1,300 lines of OCR-extracted legal data while preserving critical dates and names. Also worked on dynamic content generation, interval-tree scheduling and JSON-based content management with relative-path identifiers.'
      }
    ]
  },
  projects: {
    id: 'projects', label: 'Projects', kicker: '03 / EXPERIMENTS',
    title: 'From questions\nto working systems.',
    description: 'Selected work in computer vision, machine learning, knowledge retrieval, simulation and systems programming.',
    items: [
      {
        title: 'Human Fall Detection',
        body: 'Built a five-stage multimodal pipeline combining 3D-CNN spatio-temporal localisation, YOLOv8m-Pose, MiDaS depth estimation and BiLSTM-Attention temporal modelling. A physics-guided decision engine reduced false positives by 59%, with 84.3% accuracy in cross-dataset evaluation. Additional Random Forest, SVM and Voting Ensemble experiments on UP-Fall and CAUCAFall achieved stage-specific accuracies of 87–89%.',
        url: 'https://github.com/JK-24/FallDetection'
      },
      {
        title: 'Minimal Spectral Feature Discovery',
        body: 'Engineered a scalable framework for exhaustively evaluating Sentinel-2 spectral-band combinations for land-cover classification. Systematic experiments identified minimal and non-conventional feature sets, with automated pipelines supporting hundreds of reproducible training runs and efficient benchmarking.'
      },
      {
        title: 'BlueprintGPT',
        body: 'A hybrid floor-plan generator combining a transformer-based LayoutTransformer, deterministic planners and ontology-backed rules. Learned bounding-box priors guide polygon packing with Shapely, followed by deterministic repair, door and corridor placement, ranking and guarded LLM explanations.',
        url: 'https://github.com/JK-24/BlueprintGPT'
      },
      {
        title: 'Crop Disease Detection & Remedies',
        body: 'Team project developing a deep-learning pipeline for crop and crop-disease classification, with decision-support remedy recommendations. Contributions included data preprocessing, model training, evaluation and recommendation logic.',
        url: 'https://github.com/JK-24/AI-Crop-Disease-Diagnosis-System'
      },
      {
        title: 'KnowYourFunctions',
        body: 'Created a graph database grounded in the official NumPy manual to retrieve and display relevant functions for user queries. Designed to reduce unsupported AI responses and support connections across libraries and programming languages.'
      },
      {
        title: 'TrackLearn',
        body: 'Implemented a reinforcement-learning track-navigation agent with epsilon weight decay. Simulated the autonomous vehicle, physics and learning results in Webots.'
      },
      {
        title: 'SecureEdu Communication Platform',
        body: 'Built a teacher–student communication platform demonstrating RSA-based cryptography, salted hashing, encoding and decoding, and authentication and authorisation through digital signatures.'
      },
      {
        title: 'Signal Processing in C',
        body: 'Implemented fundamental signal-processing techniques from scratch in C, alongside visualisation methods to graph and analyse signal transformations.'
      },
      {
        title: 'Driver Fatigue Edge Detection',
        body: 'Developed a real-time computer-vision sleep-detection module and deployed it on an STM32 edge device to infer driver fatigue and trigger an alert.'
      },
      {
        title: 'Interval-Tree Event Manager',
        body: 'Built an event-management system using interval trees for efficient scheduling, overlapping-event detection and dynamic time-based queries.'
      }
    ]
  },
  achievements: {
    id: 'achievements', label: 'Achievements', kicker: '04 / MILESTONES',
    title: 'Different arenas.\nThe same drive.',
    description: 'Milestones in academics, sport and creative collaboration.',
    items: [
      { title: 'SOF Olympiad medals', body: 'Grade 6: Gold medals in English, Science and General Knowledge; Silver medal in Mathematics.' },
      { title: 'Sahodaya Handball champion', body: 'Winner of the Sahodaya Handball U-16 Men’s tournament, 2022.' },
      { title: 'District-level chess wins', body: 'Won Salem district-level chess tournaments during Grade 11.' },
      { title: 'Intracollege group dance', body: 'Third place in an intracollege group dance competition, 2024.' }
    ]
  },
  drawings: {
    id: 'drawings', label: 'Drawings', kicker: '05 / ANOTHER LANGUAGE',
    title: 'Thinking\nwithout words.',
    description: 'A space for sketches, colour and observation.',
    emptyMessage: 'Sketchbook coming soon.',
    items: [
      {
        title: 'Pencil portrait',
        body: 'Graphite on paper · 2026',
        image: 'attachments/drawings/1.webp'
      },
      {
        title: 'Pencil portrait',
        body: 'Graphite on paper · 2026',
        image: 'attachments/drawings/2.webp'
      },
      {
        title: 'Pencil portrait',
        body: 'Graphite on paper · 2026',
        image: 'attachments/drawings/3.webp'
      },
      {
        title: 'Pencil portrait',
        body: 'Graphite on paper · 2026',
        image: 'attachments/drawings/4.webp'
      },

    ]
  }
};
