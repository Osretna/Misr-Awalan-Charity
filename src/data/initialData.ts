import { Project, ImpactStats, NewsItem, SiteSettings } from '../types';

export const INITIAL_STATS: ImpactStats = {
  familiesHelped: 128450,
  mealsDistributed: 1250000,
  orphansSponsored: 4320,
  waterWellsBuilt: 385,
  medicalConvoys: 215,
  homesRestored: 760,
  lastUpdated: new Date().toISOString(),
};

export const INITIAL_SETTINGS: SiteSettings = {
  logoUrl: '/assets/aistudio/309211266_404166348563693_8027332630712114535_n__1__bf2c442e.png',
  orgNameAr: 'منظمة مصر أولاً',
  orgNameEn: 'Misr Awalan Organization',
  sloganAr: 'تنميه - رعاية - حقوق | من أجل مستقبل أفضل',
  sloganEn: 'Development - Care - Rights | For a Better Future',
  licenseNumber: 'رقم الترخيص: 417 لسنة 2026م',
  phone1: '01118150007',
  phone2: '01007267403',
  hotline: '01007267403',
  whatsappNumber: '01118150007',
  officialEmail: 'contact@misrawalan.org',
  address: '7 شارع المدينة المنورة - مدينة بن الحكم - شبرا الخيمة',
  taxNumber: 'البطاقة الضريبية: 492-381-901',
  
  // Specific official quick pay channels from organization card
  opPayCode: '230976',
  vodafoneCashCode: '*9*240#',
  smsNumber: '1319',
  instaPayAddress: 'misrawalan@instapay',

  // About Organization
  aboutBrief: 'منظمة مصر أولاً هي مؤسسة تنموية وإنسانية مصرية رائدة مشهرة برقم ترخيص 417 لسنة 2026م. تعمل المنظمة بلا كلل في كافة محافظات مصر تحت شعار "تنمية - رعاية - حقوق.. من أجل مستقبل أفضل"، مستهدفة كفالة الأيتام، مد خطوط مياه الشرب النقية، ترميم منازل الأسر المتعففة، وتوفير الرعاية الطبية والتمكين الاقتصادي.',
  aboutVision: 'أن نكون المنارة التنموية والإنسانية الأكثر موثوقية وأثراً في مصر، لنصل بأيادي الخير والكرامة إلى كل بيت في قرى ونجوع مصر.',
  aboutMission: 'تقديم حلول إغاثية وتنموية مستدامة قائمة على الشفافية المطلقة، والعمل الميداني المباشر لحفظ كرامة الإنسان وتأهيله للاستقلال والإنتاج.',
  aboutHistory: 'تأسست المنظمة بسواعد نخبة من القيادات المجتمعية وشباب مصر المخلصين للعمل الإنساني. واستطاعت بفضل الله ثم تبرعات أهل الفضل تنفيذ مئات مشاريع سقيا الماء، كفالة آلاف الأيتام، وتأمين الاحتياجات الأساسية لآلاف الأسر في شبرا الخيمة، الصعيد، والدلتا.',
  values: [
    {
      id: 'val-1',
      title: 'الكرامة الإنسانية أولاً',
      desc: 'نحفظ كرامة وستر كل مستفيد وأسرته أثناء تقديم المساعدات الميدانية بلا تجريح أو استعراض.'
    },
    {
      id: 'val-2',
      title: 'النزاهة والشفافية المطلقة',
      desc: 'تقارير مالية وتوثيق مرئي لكل جنيه يتم التبرع به، تحت إشراف مالي وقانوني صارم.'
    },
    {
      id: 'val-3',
      title: 'الاستدامة والتمكين',
      desc: 'لا نكتفي بتقديم الإغاثة العاجلة، بل نحول الأسر من الاحتياج إلى الإنتاج والاستقلال المالي.'
    },
    {
      id: 'val-4',
      title: 'سرعة الاستجابة الميدانية',
      desc: 'شبكة علاقات وفرق تطوع تغطي كافة ربوع مصر للتدخل الفوري في الأزمات وحالات الطوارئ.'
    }
  ],
  boardMembers: [
    {
      id: 'bm-1',
      name: 'مجلس إدارة منظمة مصر أولاً',
      role: 'الهيئة الإدارية والتنفيذية',
      bio: 'نخبة من القيادات المجتمعية والخبراء في العمل التنموي وإدارة الأزمات الخيرية.'
    }
  ],

  // SEO & Hero
  metaTitle: 'منظمة مصر أولاً | تنميه - رعاية - حقوق',
  metaDescription: 'المنصة الرسمية لمنظمة مصر أولاً - ترخيص رقم 417 لسنة 2026م - شبرا الخيمة - كفالة أيتام، حفر آبار، إطعام، وتنمية مستدامة.',
  keywords: 'منظمة مصر أولاً, مصر أولاً, ترخيص 417, شبرا الخيمة, تبرع, كفالة يتيم, حفر آبار, صدقة جارية',
  heroHeadline: 'معاً نصنع الأمل ونبني كرامة الإنسان في ربوع مصر',
  heroSubheadline: 'منظمة مصر أولاً، تنمية ورعاية وحقوق من أجل مستقبل أفضل. جسر ثقتكم المباشر لإيصال الصدقات والزكاة لأهالينا الأكثر احتياجاً.',
  bankAccounts: [
    {
      bankName: 'بنك مصر (Banque Misr)',
      accountNumber: '1400001000042729',
      currency: 'حساب التبرعات والصدقات الرسمي',
    },
    {
      bankName: 'البنك الأهلي المصري (National Bank of Egypt)',
      accountNumber: '0013171765522301017',
      currency: 'الحساب المعتمد للتنمية المجتمعية',
    },
    {
      bankName: 'بنك فيصل الإسلامي المصري (Faisal Islamic Bank)',
      accountNumber: '900890725',
      currency: 'حساب زكاة المال والصدقات الجارية',
    }
  ]
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'سقيا الماء وحفر آبار الشرب النظيفة في صعيد مصر',
    titleEn: 'Clean Drinking Water Wells in Upper Egypt',
    category: 'water',
    categoryEn: 'Clean Water',
    shortDescription: 'مد شبكات المياه وتوصيل خطوط الشرب العذبة وتطهير الآبار للقرى الأكثر احتياجاً بمحافظات قنا وسوهاج وأسوان.',
    shortDescriptionEn: 'Installing clean water networks, pipelines, and drilling safe wells for underprivileged villages.',
    fullDescription: 'مشروع سقيا الماء يهدف لتوفير مياه شرب نقية ومطابقة لأعلى المواصفات الصحية لآلاف الأسر في القرى والنجوع النائية. نقوم بمد خطوط مياه مباشرة إلى المنازل وتشييد محطات تنقية مركزية تخدم آلاف المواطنين وتنقذ الأطفال من الأمراض المنقولة عبر المياه غير الصالحة.',
    fullDescriptionEn: 'Our Clean Water initiative provides safe, potable water directly to households in remote Upper Egypt villages.',
    coverImage: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=kXYiU_JCYtU',
    location: 'محافظات سوهاج وقنا، صعيد مصر',
    targetAmount: 500000,
    raisedAmount: 385000,
    beneficiaries: 18500,
    isFeatured: true,
    status: 'ongoing',
    createdAt: '2026-01-15T10:00:00.000Z',
  },
  {
    id: 'proj-2',
    title: 'كفالة ورعاية الأيتام الشاملة والتعليم المتكامل',
    titleEn: 'Comprehensive Orphan Sponsorship & Education',
    category: 'orphans',
    categoryEn: 'Orphan Care',
    shortDescription: 'كفالة نقدية شهرية، رعاية صحية دورية، ومتابعة تعليمية وتنموية متكاملة لأبنائنا الأيتام وأسرهم.',
    shortDescriptionEn: 'Monthly stipend, comprehensive healthcare, and educational support for orphaned children and their families.',
    fullDescription: 'نؤمن في منظمة مصر أولاً بأن كفالة اليتيم ليست مجرد مساعدة مالية، بل هي صناعة مستقبل. نقدم برنامج رعاية شامل يغطي المصروفات المدرسية، الدروس المجانية، الملابس الموسمية، الرعاية النفسية، والأنشطة الترفيهية لبناء جيل نافع لمجتمعه ولوطنه.',
    fullDescriptionEn: 'A holistic orphan development program covering education, health checkups, psychological support, and life skills.',
    coverImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    location: 'القاهرة الكبرى، شبرا الخيمة، والجيزة',
    targetAmount: 750000,
    raisedAmount: 620000,
    beneficiaries: 4320,
    isFeatured: true,
    status: 'active',
    createdAt: '2026-02-01T10:00:00.000Z',
  },
  {
    id: 'proj-3',
    title: 'إطعام الطعام وتوزيع كراتين الخير للأسر المتعففة',
    titleEn: 'Food Security & Monthly Nutrition Boxes',
    category: 'food',
    categoryEn: 'Food Security',
    shortDescription: 'مطابخ الخير اليومية وكراتين المواد الغذائية الأساسية تسلم مباشرة لمنازل كبار السن والأرامل والأسر المستحقة.',
    shortDescriptionEn: 'Daily hot community meals and monthly dry food packages delivered directly to vulnerable households.',
    fullDescription: 'مشروع إطعام الطعام يعمل على مدار العام عبر مطابخ مصر أولاً المركزية وقوافل الإمداد الغذائي. كرتونة الخير تحتوي على المواد الغذائية الأساسية تكفي أسرة مكونة من 5 أفراد لمدة شهر كامل مع لحوم ودواجن طازجة.',
    fullDescriptionEn: 'Operating our community central kitchens delivering daily warm meals and monthly staple food packs.',
    coverImage: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    location: 'شبرا الخيمة وكافة محافظات الجمهورية',
    targetAmount: 1200000,
    raisedAmount: 940000,
    beneficiaries: 85000,
    isFeatured: true,
    status: 'active',
    createdAt: '2026-02-10T10:00:00.000Z',
  },
  {
    id: 'proj-4',
    title: 'القوافل الطبية المجانية وعمليات العيون وزراعة القوقعة',
    titleEn: 'Free Medical Convoys & Sight Restoration',
    category: 'health',
    categoryEn: 'Healthcare',
    shortDescription: 'عيادات متنقلة تضم كبار الاستشاريين، إجراء الفحوصات والعمليات الجراحية وصرف الأدوية بالمجان لأهالينا.',
    shortDescriptionEn: 'Mobile medical clinics with specialized surgeons providing free surgeries, screenings, and treatments.',
    fullDescription: 'تصل قوافلنا الطبية إلى أبعد النقاط الجغرافية في صحراء مصر وقرى الدلتا والصعيد. يتم فحص آلاف الحالات أسبوعياً، وإجراء عمليات إزالة المياه البيضاء وزراعة العدسات بالمجان، مع تقديم الأدوية والأجهزة التعويضية.',
    fullDescriptionEn: 'Equipped mobile health clinics serving remote desert outposts and rural communities.',
    coverImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=7wtfhZwyrcc',
    location: 'الفيوم، بني سويف، والوادي الجديد',
    targetAmount: 900000,
    raisedAmount: 710000,
    beneficiaries: 12400,
    isFeatured: true,
    status: 'ongoing',
    createdAt: '2026-02-18T10:00:00.000Z',
  },
  {
    id: 'proj-5',
    title: 'ستر ودفا: بناء وتسقيف منازل القرى وإعادة إعمارها',
    titleEn: 'Shelter & Home Restoration for Rural Families',
    category: 'housing',
    categoryEn: 'Shelter',
    shortDescription: 'بناء الأسقف الخرسانية، ترميم الجدران المتهالكة، تركيب الأبواب والشبابيك، وتوصيل الصرف الصحي والكهرباء.',
    shortDescriptionEn: 'Building safe concrete roofs, reinforcing walls, installing doors, windows, and sanitation.',
    fullDescription: 'نحمي مئات الأسر من أمطار الشتاء وقسوة حرارة الصيف من خلال تأهيل المنازل الطينية المهددة بالانهيار. يشمل المشروع إحلال الأسقف بالخشب المعالج أو الخرسانة وتركيب أرضيات سيراميك ومرافق صحية كريمة.',
    fullDescriptionEn: 'Transforming dilapidated mud houses into dignified, safe homes with concrete roofs and proper sanitation.',
    coverImage: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=2vjPBrBU-TM',
    location: 'المنيا وأسيوط والأقصر',
    targetAmount: 1500000,
    raisedAmount: 1120000,
    beneficiaries: 3800,
    isFeatured: true,
    status: 'active',
    createdAt: '2026-03-01T10:00:00.000Z',
  },
  {
    id: 'proj-6',
    title: 'التمكين الاقتصادي والمشروعات متناهية الصغر للمرأة المعيلة',
    titleEn: 'Economic Empowerment & Micro-Enterprises',
    category: 'education',
    categoryEn: 'Empowerment',
    shortDescription: 'تسليم ماكينات خياطة، رؤوس مواشي، وأكشاك تجارية وتدريب مهني للأمهات لتحويلهن من متلقيات للمساعدة إلى منتجات.',
    shortDescriptionEn: 'Supplying sewing machines, livestock, mini retail kiosks, and vocational training for breadwinner mothers.',
    fullDescription: 'هدفا الأسمى هو استدامة العيش الكريم. نساعد الأسر المعيلة على تأسيس مصدر دخل مستقل من خلال تمويل أدوات الإنتاج وتقديم دراسات الجدوى والتدريب على إدارة المشاريع والتسويق لمنتجاتهن المحلية.',
    fullDescriptionEn: 'Promoting long-term self-sufficiency by empowering female household heads through tools, microloans, and market training.',
    coverImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=OPf0YbXqDm0',
    location: 'كفر الشيخ، البحيرة، والشرقية',
    targetAmount: 600000,
    raisedAmount: 480000,
    beneficiaries: 2100,
    isFeatured: true,
    status: 'ongoing',
    createdAt: '2026-03-05T10:00:00.000Z',
  }
];

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'انطلاق أكبر قافلة مياه صالحة للشرب بقرى سوهاج لخدمة 20 ألف مواطن',
    titleEn: 'Launch of the Largest Clean Water Pipeline Drive in Sohag Villages',
    summary: 'دشنت منظمة مصر أولاً مرحلتها الرابعة لمد شبكات مياه الشرب النقية وتوزيع خزانات المياه المعقمة في 8 قرى بالصعيد.',
    summaryEn: 'Misr Awalan launched phase 4 of its clean potable water network connecting 8 rural Upper Egypt villages.',
    content: 'بحضور قيادات المجتمع المحلي وممثلي وزارة التضامن الاجتماعي، انطلقت أعمال المرحلة الرابعة لمشروع سقيا الماء بمحافظة سوهاج. تستهدف المبادرة توصيل المياه مباشرة إلى منازل 4,500 أسرة محرومة بعد سنوات من المعاناة في جلب المياه من مسافات بعيدة، وذلك بدعم كريم من متبرعينا وشركائنا في الخير.',
    imageUrl: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1000&q=80',
    date: '2026-03-28',
    category: 'مشاريع ميدانية',
    createdAt: '2026-03-28T12:00:00.000Z',
  },
  {
    id: 'news-2',
    title: 'تخريج الدفعة الخامسة من برنامج التمكين الحرفي لأمهات الأيتام',
    titleEn: 'Graduation of the 5th Cohort in Vocational Empowerment for Mothers',
    summary: 'تسليم 150 ماكينة خياطة حديثة وحقائب أدوات مهنية للمشاركات بعد إتمام دورة تدريبية مكثفة استمرت 3 أشهر.',
    summaryEn: 'Distributing 150 sewing machines and start-up kits following a 3-month intensive professional training program.',
    content: 'احتفلت منظمة مصر أولاً بتخريج 150 سيدة معيلة وأم يتيم ضمن مشروع "رزق كريم"، حيث تلقت المتدربات تدريباً عملياً على التصميم والخياطة والتسويق الإلكتروني، وتسلمت كل متدربة ماكينة خياطة مجانية ومواد خام للبدء الفوري في مشروعهن المنزلي.',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80',
    date: '2026-03-15',
    category: 'تمكين وتدريب',
    createdAt: '2026-03-15T12:00:00.000Z',
  }
];
