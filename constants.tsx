
import { ContentPillar, Post, CommunityRoom } from './types';

const generateMBBSContent = (): Post[] => {
  const posts: Post[] = [];

  // --- LEARN: 100 HIGH-YIELD PEARLS ---
  const learnTopics = [
    { sub: 'Anatomy', p: 'The axillary nerve (C5, C6) winds around the surgical neck of the humerus. Injury leads to loss of shoulder abduction (Deltoid) and sensation over the "regimental badge" area.' },
    { sub: 'Anatomy', p: 'The median nerve passes between the two heads of the pronator teres muscle. Entrapment here is known as Pronator Syndrome.' },
    { sub: 'Anatomy', p: 'The thoracic duct begins as the cisterna chyli at T12 and enters the thorax through the aortic opening of the diaphragm.' },
    { sub: 'Physiology', p: 'Frank-Starling Law: The force of heart contraction is proportional to the initial length of the muscle fiber (end-diastolic volume).' },
    { sub: 'Biochemistry', p: 'PFK-1 (Phosphofructokinase-1) is the rate-limiting enzyme of glycolysis. It is inhibited by high ATP and Citrate.' },
    { sub: 'Anatomy', p: 'Erb’s point is the junction of C5 and C6 nerve roots. Injury leads to Erb’s Palsy (Waiter’s tip deformity).' },
    { sub: 'Physiology', p: 'Surfactant, produced by Type II pneumocytes, reduces surface tension in alveoli and prevents collapse at end-expiration.' },
    { sub: 'Biochemistry', p: 'Vitamin B12 (Cobalamin) deficiency leads to Megaloblastic Anemia and Subacute Combined Degeneration of the Spinal Cord.' },
    { sub: 'Anatomy', p: 'The appendix is most commonly located in the retrocecal position (65%). McBurney’s point is 1/3 from the ASIS to the umbilicus.' },
    { sub: 'Physiology', p: 'The primary drive for respiration in a healthy individual is the arterial PCO2 acting on central chemoreceptors.' },
    { sub: 'Biochemistry', p: 'HMG-CoA Reductase is the rate-limiting enzyme for cholesterol synthesis and the target of Statin drugs.' },
    { sub: 'Anatomy', p: 'The cavernous sinus contains CN III, IV, VI, V1, V2, and the Internal Carotid Artery. CN VI is most medially placed.' },
    { sub: 'Physiology', p: 'The SA node is the primary pacemaker because it has the highest rate of spontaneous depolarization.' },
    { sub: 'Biochemistry', p: 'Glucose-6-Phosphate Dehydrogenase (G6PD) deficiency leads to hemolysis under oxidative stress (Bite cells and Heinz bodies).' },
    { sub: 'Anatomy', p: 'The inguinal canal contains the spermatic cord in males and the round ligament in females. Indirect hernias occur lateral to the inferior epigastric artery.' },
    { sub: 'Physiology', p: 'ADH (Vasopressin) acts on the V2 receptors of the collecting ducts to insert Aquaporin-2 channels, increasing water reabsorption.' },
    { sub: 'Biochemistry', p: 'Scurvy is caused by Vitamin C deficiency, which is essential for the hydroxylation of proline and lysine residues in collagen.' },
    { sub: 'Anatomy', p: 'The neural crest gives rise to melanocytes, Schwann cells, adrenal medulla, and autonomic ganglia.' },
    { sub: 'Physiology', p: 'The partial pressure of oxygen in alveolar air (PAO2) is approximately 104 mmHg.' },
    { sub: 'Biochemistry', p: 'The Urea Cycle occurs primarily in the liver. Carbamoyl Phosphate Synthetase I is the rate-limiting enzyme.' },
  ];

  // Populate 100 Learn Posts (Cycling through topics with variation)
  for (let i = 0; i < 100; i++) {
    const topic = learnTopics[i % learnTopics.length];
    posts.push({
      id: `learn-${i}`,
      pillar: ContentPillar.LEARN,
      title: `${topic.sub} Pearl #${i + 1}`,
      author: i % 2 === 0 ? 'Dr. Sarah J.' : 'Academic Archives',
      authorYear: i % 2 === 0 ? 'Resident' : 'Faculty',
      content: topic.p,
      timestamp: `${Math.floor(i / 5) + 1}h ago`,
      savedCount: 100 + i
    });
  }

  // --- THINK: 50 CLINICAL MCQS ---
  const mcqPool = [
    {
      q: 'A 24-year-old medical student falls on an outstretched hand. X-ray shows a fracture of the scaphoid bone. Which artery supplies the proximal pole of this bone?',
      o: ['Radial Artery', 'Ulnar Artery', 'Median Artery', 'Deep Palmar Arch'],
      c: 0,
      e: 'The radial artery supplies the scaphoid. Blood flow is retrograde, which is why fractures can lead to avascular necrosis of the proximal pole.'
    },
    {
      q: 'Which of the following enzymes is responsible for "trapping" glucose inside the cell during glycolysis?',
      o: ['Hexokinase', 'PFK-1', 'Aldolase', 'Pyruvate Kinase'],
      c: 0,
      e: 'Hexokinase (and Glucokinase) phosphorylates glucose to Glucose-6-Phosphate, which cannot cross the cell membrane.'
    },
    {
      q: 'During a cardiac cycle, when is the volume of blood in the ventricle at its maximum?',
      o: ['End of Isovolumetric Contraction', 'End of Atrial Systole', 'End of Ventricular Ejection', 'End of Isovolumetric Relaxation'],
      c: 1,
      e: 'Atrial systole completes ventricular filling; thus, the volume is maximal (End Diastolic Volume) at the end of this phase.'
    },
    {
      q: 'A patient presents with "winging of the scapula". Which nerve is likely damaged?',
      o: ['Long Thoracic Nerve', 'Axillary Nerve', 'Thoracodorsal Nerve', 'Spinal Accessory Nerve'],
      c: 0,
      e: 'The long thoracic nerve supplies the Serratus Anterior. Damage causes the medial border of the scapula to protrude.'
    },
    {
      q: 'A patient with chronic alcoholism presents with confusion, ataxia, and ophthalmoplegia (Wernicke Encephalopathy). Which cofactor is deficient?',
      o: ['Thiamine (B1)', 'Riboflavin (B2)', 'Niacin (B3)', 'Pyridoxine (B6)'],
      c: 0,
      e: 'Thiamine is a cofactor for pyruvate dehydrogenase and alpha-ketoglutarate dehydrogenase.'
    }
  ];

  for (let i = 0; i < 50; i++) {
    const mcq = mcqPool[i % mcqPool.length];
    posts.push({
      id: `think-${i}`,
      pillar: ContentPillar.THINK,
      title: `MBBS 1st Year Quiz - Challenge ${i + 1}`,
      author: 'Clinical Case Hub',
      authorYear: 'Verified Educator',
      content: mcq.q,
      isMCQ: true,
      options: mcq.o,
      correctOption: mcq.c,
      explanation: mcq.e,
      timestamp: `${i % 24}h ago`,
      savedCount: 50 + i
    });
  }

  // --- SMILE: 50 MEDICAL MEMES ---
  const memeTexts = [
    "Me: *Reads Anatomy for 5 minutes*\nBrain: 'Okay, we are definitely ready to be a neurosurgeon now.'",
    "Professor: 'Is this concept clear?'\nMe: *Knowing very well I haven't understood a word since the intro slide*",
    "Trying to find the Median Nerve in the cadaver like it's a hidden treasure in an RPG.",
    "Guyton and Hall: 1000+ pages.\nMe: 'Is there a 5-minute YouTube summary?'",
    "My social life vs. My relationship with the Histology microscope.",
    "First day of dissection: 🧤🔬\nAfter 1 month of dissection: 🍕💀 (Eating lunch without washing hands properly)",
    "When you finally memorize the Krebs Cycle and then find out there are 10 more cycles in the next chapter.",
    "The sheer panic when the Attending asks a question and looks directly at you.",
    "Identifying 'Pink' vs 'Darker Pink' on a Histology slide.",
    "Exam tomorrow. Me today: *Learning how to bake bread from scratch to avoid studying.*"
  ];

  for (let i = 0; i < 50; i++) {
    posts.push({
      id: `smile-${i}`,
      pillar: ContentPillar.SMILE,
      title: 'Med School Reality Check',
      author: 'MedMeme Collective',
      authorYear: 'Humor Resident',
      content: memeTexts[i % memeTexts.length],
      imageUrl: `https://picsum.photos/seed/medjoke${i}/600/400`,
      timestamp: 'Today',
      savedCount: 200 + i
    });
  }

  return posts;
};

export const MOCK_POSTS: Post[] = generateMBBSContent();

export const COMMUNITY_ROOMS: CommunityRoom[] = [
  { id: '1', name: 'USMLE Step 1 Prep', description: 'High-yield discussions and strategy.', activeUsers: 45, icon: 'fa-book-medical' },
  { id: '2', name: 'Internship Survival', description: 'Tips for the busiest year of your life.', activeUsers: 120, icon: 'fa-hospital' },
  { id: '3', name: 'Clinical Case Solvers', description: 'Daily diagnostic challenges.', activeUsers: 89, icon: 'fa-stethoscope' },
  { id: '4', name: 'Mental Health Lounge', description: 'Support and peer reflection.', activeUsers: 34, icon: 'fa-heart' }
];

export const PILLAR_COLORS = {
  [ContentPillar.LEARN]: 'bg-blue-100 text-blue-700 border-blue-200',
  [ContentPillar.THINK]: 'bg-purple-100 text-purple-700 border-purple-200',
  [ContentPillar.FEEL]: 'bg-rose-100 text-rose-700 border-rose-200',
  [ContentPillar.SMILE]: 'bg-amber-100 text-amber-700 border-amber-200',
};
