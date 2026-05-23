/**
 * Grammar reference — English tenses + Units 1–11 (aligned with vocabulary themes)
 */
const GRAMMAR_TENSES = [
    {
        id: 'present-simple',
        group: 'Present',
        icon: '●',
        name: 'Present Simple',
        nameUz: 'Hozirgi oddiy zamon',
        timeline: 'now · habit · fact',
        form: {
            affirmative: 'I/You/We/They + V₁ &nbsp;|&nbsp; He/She/It + V₁<strong>s</strong>',
            negative: "don't / doesn't + V₁",
            question: 'Do/Does + subject + V₁?'
        },
        uses: [
            { en: 'Habits and routines', uz: 'Odatlar va kundalik ishlar' },
            { en: 'Permanent situations and facts', uz: 'Doimiy holatlar va haqiqatlar' },
            { en: 'Schedules and timetables', uz: 'Jadval va vaqt rejasi' },
            { en: 'States and feelings (know, believe, like)', uz: 'Holat va his-tuyg\'ular (know, like…)' }
        ],
        signals: ['always', 'usually', 'often', 'sometimes', 'never', 'every day', 'on Mondays'],
        examples: [
            { en: 'She <strong>studies</strong> psychology at university.', uz: 'U universitetda psixologiya o\'qiydi.' },
            { en: 'Water <strong>boils</strong> at 100°C.', uz: 'Suv 100°C da qaynaydi.' },
            { en: 'Do you <strong>get on with</strong> your colleagues?', uz: 'Hamkasblaringiz bilan yaxshimisiz?' }
        ],
        tip: 'He/She/It uchun fe\'lga -s qo\'shiladi. "Now" bilan odatda ishlatilmaydi — buning o\'rniga Present Continuous.'
    },
    {
        id: 'present-continuous',
        group: 'Present',
        icon: '◐',
        name: 'Present Continuous',
        nameUz: 'Hozirgi davomiy zamon',
        timeline: 'now · temporary · trend',
        form: {
            affirmative: 'am / is / are + V-ing',
            negative: "am not / isn't / aren't + V-ing",
            question: 'Am/Is/Are + subject + V-ing?'
        },
        uses: [
            { en: 'Action happening right now', uz: 'Hozir sodir bo\'layotgan harakat' },
            { en: 'Temporary situations', uz: 'Vaqtinchalik holatlar' },
            { en: 'Changing trends', uz: 'O\'zgarayotgan tendensiyalar' },
            { en: 'Fixed plans in the near future (with time word)', uz: 'Yaqin kelajakdagi rejalangan voqealar' }
        ],
        signals: ['now', 'at the moment', 'currently', 'today', 'this week', 'Look!'],
        examples: [
            { en: 'Technology is <strong>constantly evolving</strong>.', uz: 'Texnologiya doimiy ravishda rivojlanmoqda.' },
            { en: 'I\'m <strong>studying</strong> for the exam this week.', uz: 'Bu hafta imtihonga tayyorlanayapman.' },
            { en: 'They\'re <strong>meeting</strong> the professor tomorrow.', uz: 'Ertaga professor bilan uchrashishadi (reja).' }
        ],
        tip: 'Ba\'zi fe\'llar (know, believe, need, want) odatda Continuousda ishlatilmaydi.'
    },
    {
        id: 'present-perfect',
        group: 'Present',
        icon: '◑',
        name: 'Present Perfect',
        nameUz: 'Hozirgi tugallangan zamon',
        timeline: 'past → now · result · experience',
        form: {
            affirmative: 'have / has + V₃ (past participle)',
            negative: "haven't / hasn't + V₃",
            question: 'Have/Has + subject + V₃?'
        },
        uses: [
            { en: 'Past action with present result', uz: 'O\'tgan harakat — hozirgi natija' },
            { en: 'Life experience (ever / never)', uz: 'Hayotiy tajriba (ever / never)' },
            { en: 'Unfinished time (today, this year, so far)', uz: 'Tugallanmagan vaqt oralig\'i' },
            { en: 'Recent news (just, already, yet)', uz: 'Yaqinda bo\'lgan voqea' }
        ],
        signals: ['just', 'already', 'yet', 'ever', 'never', 'since', 'for', 'so far', 'recently'],
        examples: [
            { en: 'I <strong>haven\'t seen</strong> her <strong>for ages</strong>.', uz: 'U bilan uzoq vaqtdan beri ko\'rishmadim.' },
            { en: 'Archaeologists <strong>have uncovered</strong> ancient remains.', uz: 'Arxeologlar qadimiy qoldiqlarni topishdi.' },
            { en: 'Have you ever <strong>witnessed</strong> a solar eclipse?', uz: 'Quyosh tutilishini ko\'rganmisiz?' }
        ],
        tip: 'Aniq o\'tgan vaqt (yesterday, in 1990) bilan emas — buning uchun Past Simple.'
    },
    {
        id: 'present-perfect-continuous',
        group: 'Present',
        icon: '◒',
        name: 'Present Perfect Continuous',
        nameUz: 'Hozirgi tugallangan davomiy zamon',
        timeline: 'started past · still / just stopped',
        form: {
            affirmative: 'have/has been + V-ing',
            negative: "haven't/hasn't been + V-ing",
            question: 'Have/Has + subject + been + V-ing?'
        },
        uses: [
            { en: 'Action started in past, still continuing', uz: 'O\'tmishda boshlangan, hali davom etayotgan harakat' },
            { en: 'Emphasis on duration (for / since)', uz: 'Davomiylikka urg\'u (for / since)' },
            { en: 'Recently finished with visible effect', uz: 'Yaqinda tugagan, natijasi ko\'rinadigan harakat' }
        ],
        signals: ['for', 'since', 'all day', 'how long', 'lately', 'recently'],
        examples: [
            { en: 'She <strong>has been studying</strong> for <strong>hours and hours</strong>.', uz: 'U soatlab o\'qiyapti (va hali ham).' },
            { en: 'They <strong>have been excavating</strong> the site since March.', uz: 'Martdan beri joyni qazishmoqda.' },
            { en: 'It <strong>has been raining</strong> steadily all morning.', uz: 'Ertalabdan beri doimiy yomg\'ir yog\'moqda.' }
        ],
        tip: 'Natija muhim bo\'lsa — Perfect Simple; jarayon/davomiylik muhim bo\'lsa — Perfect Continuous.'
    },
    {
        id: 'past-simple',
        group: 'Past',
        icon: '◧',
        name: 'Past Simple',
        nameUz: 'O\'tgan oddiy zamon',
        timeline: 'finished past · definite time',
        form: {
            affirmative: 'V₂ (regular: -ed) / irregular past form',
            negative: "didn't + V₁",
            question: 'Did + subject + V₁?'
        },
        uses: [
            { en: 'Completed actions at a definite past time', uz: 'Aniq o\'tgan vaqtda tugagan harakat' },
            { en: 'Past habits (often with time adverbs)', uz: 'O\'tmishdagi odatlar' },
            { en: 'Sequence of past events (storytelling)', uz: 'Ketma-ket voqealar (hikoya)' }
        ],
        signals: ['yesterday', 'last week', 'in 2010', 'ago', 'then', 'when'],
        examples: [
            { en: 'Our ancestors <strong>dwelt</strong> near the lake.', uz: 'Ajdarlarimiz ko\'l bo\'yida yashagan.' },
            { en: 'The meeting <strong>came to an abrupt end</strong>.', uz: 'Yig\'ilish to\'satdan tugadi.' },
            { en: 'She <strong>felt anxious</strong> about the interview.', uz: 'Suhbatdan oldin xavotirlangan.' }
        ],
        tip: 'Muntazam fe\'llar: -ed; noto\'g\'ri fe\'llar ro\'yxatini yodlang (go→went, see→saw).'
    },
    {
        id: 'past-continuous',
        group: 'Past',
        icon: '◨',
        name: 'Past Continuous',
        nameUz: 'O\'tgan davomiy zamon',
        timeline: 'was doing when… · background',
        form: {
            affirmative: 'was / were + V-ing',
            negative: "wasn't / weren't + V-ing",
            question: 'Was/Were + subject + V-ing?'
        },
        uses: [
            { en: 'Action in progress at a specific past moment', uz: 'O\'tmishdagi ma\'lum paytda davom etgan harakat' },
            { en: 'Background action interrupted by Past Simple', uz: 'Boshqa harakat tomonidan uzilgan fon harakati' },
            { en: 'Two parallel past actions', uz: 'Parallel o\'tgan harakatlar' }
        ],
        signals: ['while', 'when', 'at 8 pm yesterday', 'all evening'],
        examples: [
            { en: 'I <strong>was looking back on</strong> my school days when she called.', uz: 'U qo\'ng\'iroq qilganda maktab kunlarimni eslayotgan edim.' },
            { en: 'They <strong>were chatting away</strong> for hours.', uz: 'Ular soatlab gaplashishardi.' },
            { en: 'While he <strong>was tripping over</strong> the cable, the door opened.', uz: 'Kabelga ilganda eshik ochildi.' }
        ],
        tip: 'When + Past Simple, While + Past Continuous — ko\'p hollarda shunday juftlanadi.'
    },
    {
        id: 'past-perfect',
        group: 'Past',
        icon: '◩',
        name: 'Past Perfect',
        nameUz: 'O\'tgan tugallangan zamon',
        timeline: 'earlier past · before another past',
        form: {
            affirmative: 'had + V₃',
            negative: "hadn't + V₃",
            question: 'Had + subject + V₃?'
        },
        uses: [
            { en: 'Action before another past action', uz: 'Boshqa o\'tgan harakatdan oldin bo\'lgan harakat' },
            { en: 'Cause of a past situation', uz: 'O\'tgan holatning sababi' },
            { en: 'With time clauses (before, after, by the time)', uz: 'Vaqt ergash gaplari bilan' }
        ],
        signals: ['before', 'after', 'by the time', 'already', 'never … before'],
        examples: [
            { en: 'By the time we arrived, the lecture <strong>had already started</strong>.', uz: 'Kelganimizda ma\'ruza allaqachon boshlangan edi.' },
            { en: 'She <strong>had never visited</strong> the site before 2020.', uz: '2020 yilgacha u bu joyga bormagan edi.' },
            { en: 'The ruins <strong>had been buried</strong> beneath the sand for centuries.', uz: 'Xarobalar asrlar davomida qum ostida yotgan edi.' }
        ],
        tip: 'Ikki o\'tgan voqea — qaysi biri avval? Avval bo\'lgani uchun Past Perfect.'
    },
    {
        id: 'past-perfect-continuous',
        group: 'Past',
        icon: '◪',
        name: 'Past Perfect Continuous',
        nameUz: 'O\'tgan tugallangan davomiy zamon',
        timeline: 'had been doing · until past point',
        form: {
            affirmative: 'had been + V-ing',
            negative: "hadn't been + V-ing",
            question: 'Had + subject + been + V-ing?'
        },
        uses: [
            { en: 'Duration up to a point in the past', uz: 'O\'tgan paytgacha davom etgan jarayon' },
            { en: 'Cause of a past situation (emphasis on activity)', uz: 'O\'tgan holat sababi (faollikka urg\'u)' }
        ],
        signals: ['for', 'since', 'how long', 'before', 'all day'],
        examples: [
            { en: 'He <strong>had been working</strong> on the thesis for two years before he submitted.', uz: 'Topshirishdan oldin ikki yil dissertatsiya ustida ishlagan.' },
            { en: 'They <strong>had been excavating</strong> for months when they found the tomb.', uz: 'Qabr topilganda oylar davomida qazish olib borishgan edi.' },
            { en: 'Her hands were sore because she <strong>had been typing</strong> all night.', uz: 'Qo\'llari og\'rigandi — tun bo\'yi yozgan edi.' }
        ],
        tip: 'Kundalik nutqda kamroq ishlatiladi; imtihon va yozma matnda muhim.'
    },
    {
        id: 'future-simple-will',
        group: 'Future',
        icon: '◇',
        name: 'Future Simple (will)',
        nameUz: 'Kelajak oddiy zamon (will)',
        timeline: 'prediction · instant decision · promise',
        form: {
            affirmative: 'will + V₁',
            negative: "won't + V₁",
            question: 'Will + subject + V₁?'
        },
        uses: [
            { en: 'Predictions without evidence', uz: 'Dalilsiz bashorat' },
            { en: 'Instant decisions', uz: 'Birdaniga qaror' },
            { en: 'Promises, offers, threats', uz: 'Va\'da, taklif, tahdid' },
            { en: 'Facts about the future', uz: 'Kelajakdagi faktlar' }
        ],
        signals: ['tomorrow', 'next year', 'soon', 'I think', 'probably', 'perhaps'],
        examples: [
            { en: 'Scientists <strong>will release</strong> the results tomorrow.', uz: 'Olimlar ertaga natijalarni e\'lon qiladi.' },
            { en: 'Don\'t worry — I <strong>will be there for</strong> you.', uz: 'Xavotir olma — yoningda bo\'laman.' },
            { en: 'I think society <strong>will become</strong> more tolerant.', uz: 'Jamiyat yanada tolerant bo\'ladi, deb o\'ylayman.' }
        ],
        tip: 'Rejalashtirilgan kelajak uchun ko\'pincha "going to" yoki Present Continuous afzal.'
    },
    {
        id: 'future-going-to',
        group: 'Future',
        icon: '◆',
        name: 'Be going to',
        nameUz: 'Rejalashtirilgan kelajak (going to)',
        timeline: 'plan · evidence now',
        form: {
            affirmative: 'am/is/are going to + V₁',
            negative: "isn't/aren't going to + V₁",
            question: 'Am/Is/Are + subject + going to + V₁?'
        },
        uses: [
            { en: 'Plans and intentions', uz: 'Reja va niyat' },
            { en: 'Predictions based on present evidence', uz: 'Hozirgi dalilga asoslangan bashorat' }
        ],
        signals: ['tomorrow', 'next week', 'Look out!', 'I\'m sure', 'plan to'],
        examples: [
            { en: 'We\'re <strong>going to conserve</strong> the wetland next year.', uz: 'Kelasi yil suvli maydonni muhofaza qilamiz (reja).' },
            { en: 'Watch out — you\'re <strong>going to trip over</strong> that cable!', uz: 'Ehtiyot — kabelga ilib qolasan!' },
            { en: 'She\'s <strong>going to study</strong> medicine at university.', uz: 'U universitetda tibbiyot o\'qiydi (reja).' }
        ],
        tip: 'Will = birdaniga; going to = oldindan o\'ylangan yoki hozir ko\'rinayotgan natija.'
    },
    {
        id: 'future-continuous',
        group: 'Future',
        icon: '◈',
        name: 'Future Continuous',
        nameUz: 'Kelajak davomiy zamon',
        timeline: 'will be doing at future time',
        form: {
            affirmative: 'will be + V-ing',
            negative: "won't be + V-ing",
            question: 'Will + subject + be + V-ing?'
        },
        uses: [
            { en: 'Action in progress at a future time', uz: 'Kelajakdagi paytda davom etadigan harakat' },
            { en: 'Polite questions about plans', uz: 'Reja haqida muloyim savol' }
        ],
        signals: ['this time tomorrow', 'at 9 pm', 'when', 'while'],
        examples: [
            { en: 'This time next year I <strong>will be studying</strong> abroad.', uz: 'Kelasi yil shu payt chet elda o\'qiyotgan bo\'laman.' },
            { en: 'They <strong>will be launching</strong> the rocket at dawn.', uz: 'Tongda raketani ishga tushirishmoqda (o\'sha paytda jarayon).' },
            { en: '<strong>Will you be using</strong> the lab this afternoon?', uz: 'Bugun tushdan keyin laboratoriyadan foydalanasizmi?' }
        ],
        tip: 'Kelajakdagi aniq vaqtda "o\'rtasida" bo\'layotgan ishni ifodalaydi.'
    },
    {
        id: 'future-perfect',
        group: 'Future',
        icon: '◉',
        name: 'Future Perfect',
        nameUz: 'Kelajak tugallangan zamon',
        timeline: 'will have done by future time',
        form: {
            affirmative: 'will have + V₃',
            negative: "won't have + V₃",
            question: 'Will + subject + have + V₃?'
        },
        uses: [
            { en: 'Action completed before a future point', uz: 'Kelajakdagi paytgacha tugaydigan harakat' }
        ],
        signals: ['by', 'by the time', 'before', 'by next Friday'],
        examples: [
            { en: 'By 2030, scientists <strong>will have discovered</strong> new exoplanets.', uz: '2030 yilgacha olimlar yangi ekzoplanetalar topgan bo\'ladi.' },
            { en: 'She <strong>will have finished</strong> the course by June.', uz: 'Iyunga qadar kursni tugatgan bo\'ladi.' },
            { en: 'By the time you arrive, we <strong>will have left</strong>.', uz: 'Siz kelganingizda biz ketgan bo\'lamiz.' }
        ],
        tip: 'Har doim kelajakdagi "by …" vaqti bilan birga keladi.'
    },
    {
        id: 'future-perfect-continuous',
        group: 'Future',
        icon: '◎',
        name: 'Future Perfect Continuous',
        nameUz: 'Kelajak tugallangan davomiy zamon',
        timeline: 'will have been doing · duration until future',
        form: {
            affirmative: 'will have been + V-ing',
            negative: "won't have been + V-ing",
            question: 'Will + subject + have been + V-ing?'
        },
        uses: [
            { en: 'Duration of an action up to a future point', uz: 'Kelajak paytgacha davom etgan jarayon uzunligi' }
        ],
        signals: ['for', 'by', 'by the time'],
        examples: [
            { en: 'By December, he <strong>will have been working</strong> here for ten years.', uz: 'Dekabrga qadar u bu yerda 10 yil ishlagan bo\'ladi.' },
            { en: 'They <strong>will have been researching</strong> the topic for five years by then.', uz: 'O\'sha paytda 5 yildan beri mavzuni o\'rganishadi.' }
        ],
        tip: 'Eng kam ishlatiladigan zamonlardan biri — lekin IELTS va akademik matnda uchraydi.'
    },
    {
        id: 'used-to',
        group: 'Past habits',
        icon: '↺',
        name: 'Used to',
        nameUz: 'O\'tmishdagi odat (used to)',
        timeline: 'past habit · not now',
        form: {
            affirmative: 'used to + V₁',
            negative: "didn't use to + V₁",
            question: 'Did + subject + use to + V₁?'
        },
        uses: [
            { en: 'Past habits or states that are no longer true', uz: 'Endi yo\'q bo\'lgan o\'tmishdagi odat yoki holat' }
        ],
        signals: ['when I was young', 'in the past', 'no longer'],
        examples: [
            { en: 'People <strong>used to believe</strong> the Earth was flat.', uz: 'Ilgari Yer tekis deb ishonishgan.' },
            { en: 'She <strong>used to be</strong> very talkative, but now she\'s quiet.', uz: 'U ilgari juda gaprashuvchi edi.' },
            { en: 'There <strong>used to be</strong> a lake here.', uz: 'Bu yerda ilgari ko\'l bo\'lgan.' }
        ],
        tip: 'Would ham odat uchun ishlatiladi, lekin holat fe\'llari (be, have, live) bilan used to kerak.'
    },
    {
        id: 'would-past-habit',
        group: 'Past habits',
        icon: '↻',
        name: 'Would (past habit)',
        nameUz: 'O\'tmishdagi takroriy harakat (would)',
        timeline: 'would often · past story',
        form: {
            affirmative: 'would + V₁',
            negative: "wouldn't + V₁",
            question: 'Would + subject + V₁? (rare)'
        },
        uses: [
            { en: 'Repeated past actions (nostalgic / storytelling)', uz: 'Takrorlangan o\'tmish harakatlari (hikoya uslubi)' }
        ],
        signals: ['often', 'sometimes', 'every summer', 'whenever'],
        examples: [
            { en: 'Every summer we <strong>would visit</strong> our grandparents.', uz: 'Har yozda buvimiznikiga borishardik.' },
            { en: 'He <strong>would always talk</strong> during films — it was annoying.', uz: 'U film vaqtida doim gapirardi.' },
            { en: 'Looking back, life <strong>would seem</strong> simpler.', uz: 'Orqaga qarasam, hayot sodda tuyulardi.' }
        ],
        tip: 'Faqat harakat fe\'llari; "would be tall" kabi holatlar noto\'g\'ri.'
    }
];

const GRAMMAR_BY_UNIT = [
    {
        u: '1',
        theme: 'Personality',
        topics: [
            {
                title: 'Personality adjectives & word order',
                titleUz: 'Shaxsiyat sifatlari va so\'z tartibi',
                pattern: 'Subject + be + adjective &nbsp;|&nbsp; a(n) + adjective + noun',
                explain: 'Describe character with adjectives before nouns or after "be". Stack opinions: "a cheerful, talkative person".',
                explainUz: 'Xarakterni sifatlar bilan tasvirlang. "Be" dan keyin yoki ot oldidan: a confident student. Bir nechta sifat: a cheerful, talkative person.',
                examples: [
                    { en: 'She is <strong>assertive</strong> and <strong>self-assured</strong>.', uz: 'U ishonchli va o\'ziga ishongan.' },
                    { en: 'His <strong>egotistical</strong> behaviour alienated the team.', uz: 'Uning manman xatti-harakati jamoadan ajratdi.' },
                    { en: 'It is <strong>sensible</strong> to stay calm in interviews.', uz: 'Suhbatda xotirjam bo\'lish oqilona.' }
                ],
                vocab: ['assertive', 'tactful', 'well-rounded', 'inconsiderate']
            },
            {
                title: 'Reflexive pronouns (self-)',
                titleUz: 'O\'zlik olmoshlari (self-)',
                pattern: 'myself · yourself · himself/herself · ourselves · themselves',
                explain: 'Subject and object are the same person, or for emphasis: "I myself saw it."',
                explainUz: 'Ega va to\'ldiruvchi bir shaxs bo\'lganda: She taught herself. Kuchaytirish: I myself agree.',
                examples: [
                    { en: 'She is <strong>self-reliant</strong> and lives by <strong>herself</strong>.', uz: 'U mustaqil va yolg\'iz yashaydi.' },
                    { en: 'Don\'t be too <strong>self-conscious</strong> about small mistakes.', uz: 'Kichik xatolardan haddan tashqari xijolat bo\'lmang.' },
                    { en: 'He <strong>himself</strong> admitted the error.', uz: 'Xatoni o\'zi tan oldi.' }
                ],
                vocab: ['self-confident', 'self-deprecating', 'self-centred']
            },
            {
                title: 'Phrasal verbs: relationships',
                titleUz: 'Phrasal fe\'llar: munosabatlar',
                pattern: 'get on with · look down on · turn away · bump into',
                explain: 'Many personality unit phrases are phrasal verbs — learn them as whole chunks.',
                explainUz: 'Ko\'p iboralar phrasal verb — butunlay yodlang, bo\'laklab emas.',
                examples: [
                    { en: 'It\'s important to <strong>get on with</strong> colleagues.', uz: 'Hamkasblar bilan yara-shira ishlash muhim.' },
                    { en: 'Never <strong>look down on</strong> people with less experience.', uz: 'Tajribasi kamroq odamlarni kamsitmang.' },
                    { en: 'I <strong>bumped into</strong> my teacher at the mall.', uz: 'Savdo markazida o\'qituvchim bilan tasodifan uchrashdim.' }
                ],
                vocab: ['get on with', 'look down on', 'turn away', 'bump into']
            },
            {
                title: 'Perceive, confuse, contrast',
                titleUz: 'Perceive / confuse / contrast',
                pattern: 'perceive + object · confuse A with B · contrast A with B',
                explain: 'Academic verbs for how we see or compare traits and ideas.',
                explainUz: 'Qanday qabul qilish va solishtirish haqida akademik fe\'llar.',
                examples: [
                    { en: 'Children <strong>perceive</strong> changes quickly.', uz: 'Bolalar o\'zgarishlarni tez sezadi.' },
                    { en: 'Similar signs <strong>confuse</strong> new drivers.', uz: 'O\'xshash belgilar haydovchilarni chalg\'itadi.' },
                    { en: 'The film <strong>contrasts</strong> rich and poor lifestyles.', uz: 'Film boy va kambag\'al turmushni qarama-qarshi qo\'yadi.' }
                ],
                vocab: ['perceive', 'confuse', 'contrast', 'portrays']
            }
        ]
    },
    {
        u: '2',
        theme: 'Time & History',
        topics: [
            {
                title: 'Time expressions',
                titleUz: 'Vaqt iboralari',
                pattern: 'for ages · in no time · at a time · in the blink of an eye',
                explain: 'Fixed phrases show duration, speed, or frequency — often with perfect or simple past.',
                explainUz: 'Tayyor iboralar davomiylik yoki tezlikni bildiradi; ko\'pincha Perfect yoki Past Simple bilan.',
                examples: [
                    { en: 'I haven\'t seen her <strong>for ages</strong>.', uz: 'U bilan asrlab ko\'rishmadim.' },
                    { en: 'He fixed it <strong>in next to no time</strong>.', uz: 'Birdaniga tuzatib qo\'ydi.' },
                    { en: 'Life changed <strong>in the blink of an eye</strong>.', uz: 'Hayot bir zumda o\'zgardi.' }
                ],
                vocab: ['for ages', 'constantly', 'fleeting', 'retrospect']
            },
            {
                title: 'Past Simple vs Present Perfect',
                titleUz: 'Past Simple va Present Perfect farqi',
                pattern: 'Past Simple + finished time &nbsp;|&nbsp; Present Perfect + unfinished / no exact time',
                explain: 'Use Past Simple with "yesterday", "in 1990". Use Present Perfect with "so far", "already", or when time is unclear.',
                explainUz: 'Aniq o\'tgan vaqt → Past Simple. Vaqt noaniq yoki hozirgacha → Present Perfect.',
                examples: [
                    { en: 'They <strong>excavated</strong> the site in 2015. (finished)', uz: '2015 da qazish olib borildi.' },
                    { en: 'They <strong>have excavated</strong> three tombs. (result / experience)', uz: 'Uchta qabr qazib topishdi.' },
                    { en: '<strong>Looking back on</strong> the era, we see change.', uz: 'O\'sha davrni qayta ko\'rib, o\'zgarish ko\'ramiz.' }
                ],
                vocab: ['excavate', 'uncover', 'witnessing', 'prehistoric']
            },
            {
                title: 'It is time + to-infinitive',
                titleUz: 'It is time + to + fe\'l',
                pattern: 'It is time to V &nbsp;|&nbsp; It is time for sb to V &nbsp;|&nbsp; It\'s time we V₂ (subjunctive)',
                explain: 'Shows that the right moment has come. Formal variant: "It\'s time we left."',
                explainUz: 'To\'g\'ri vaqt kelganini bildiradi. Rasmiy: It\'s time we left.',
                examples: [
                    { en: '<strong>It\'s time to</strong> leave.', uz: 'Ketish vaqti keldi.' },
                    { en: '<strong>It is time for</strong> students <strong>to take</strong> responsibility.', uz: 'Talabalar mas\'uliyat olish vaqti.' },
                    { en: '<strong>It\'s time</strong> we <strong>addressed</strong> the crisis.', uz: 'Inqirozni hal qilish vaqti (rasmiy).' }
                ],
                vocab: ['time to', 'time for', 'it is time']
            },
            {
                title: 'Figurative vs literal language',
                titleUz: 'Majoziy va to\'g\'ridan-to\'g\'ri ma\'no',
                pattern: 'figurative (metaphor) · literal (exact meaning)',
                explain: 'Unit 2 contrasts how time and sayings work in speech.',
                explainUz: 'Vaqt iboralari ko\'pincha majoziy; literal — so\'zma-so\'z ma\'no.',
                examples: [
                    { en: 'Waiting felt like <strong>an eternity</strong> (figurative).', uz: 'Kutish abadiyatdek tuyuldi (ma\'novi).' },
                    { en: 'Take the instructions <strong>literally</strong>.', uz: 'Ko\'rsatmani so\'zma-so\'z bajaring.' },
                    { en: '<strong>As the saying goes</strong>, better late than never.', uz: 'Aytishlaricha, kech ham yaxshi.' }
                ],
                vocab: ['figurative', 'literal', 'as the saying goes']
            }
        ]
    },
    {
        u: '3',
        theme: 'Conformity & Society',
        topics: [
            {
                title: 'Phrasal verbs: fit in & stand out',
                titleUz: 'Moslashish va ajralib turish',
                pattern: 'fit in · blend in · stand out · break away from · opt out of',
                explain: 'Society unit core: conform or differ. Preposition matters: stand out <em>from</em> the crowd.',
                explainUz: 'Jamiyat mavzusi: moslashish yoki farq qilish. Predlog muhim: stand out from.',
                examples: [
                    { en: 'Teens want to <strong>fit in</strong> but also <strong>stand out</strong>.', uz: 'O\'smirlar moslashmoqchi, lekin ajralib ham turmoqchi.' },
                    { en: 'Some <strong>break away from</strong> traditional expectations.', uz: 'Ba\'zilari an\'anaviy kutishlardan uziladi.' },
                    { en: 'You can <strong>opt out of</strong> the survey.', uz: 'So\'rovnomadan voz kechishingiz mumkin.' }
                ],
                vocab: ['fit in', 'blend in', 'stand out', 'conform']
            },
            {
                title: 'Passive: judged to be, seen as',
                titleUz: 'Passiv: judged to be, seen as',
                pattern: 'be + past participle · be seen as · be judged to be',
                explain: 'Focus on social perception rather than who judges.',
                explainUz: 'Kim baholaganidan ko\'ra jamiyat qanday qabul qilishiga e\'tibor.',
                examples: [
                    { en: 'Tattoos <strong>are now seen as</strong> widely acceptable.', uz: 'Tatuirovkalar endi qabul qilinadi deb ko\'riladi.' },
                    { en: 'The plan <strong>was judged to be</strong> harmful to society.', uz: 'Reja jamiyatga zararli deb baholandi.' },
                    { en: 'Volunteering <strong>is approved of by</strong> society.', uz: 'Ko\'ngilli ish jamiyat tomonidan ma\'qullanadi.' }
                ],
                vocab: ['judged to be', 'acceptable', 'stereotypical']
            },
            {
                title: 'Fail to, refuse to, decline',
                titleUz: 'Fail to / refuse to / decline',
                pattern: 'fail to + V · refuse to + V · decline + noun/to V',
                explain: 'Negative behaviour patterns with infinitive after "to".',
                explainUz: '"To" dan keyin infinitiv — bajarilmagan yoki rad etilgan harakat.',
                examples: [
                    { en: 'He <strong>failed to submit</strong> the report.', uz: 'Hisobotni topshira olmadi.' },
                    { en: 'She <strong>refused to sign</strong> the contract.', uz: 'Shartnoma imzolashdan bosh tortdi.' },
                    { en: 'They <strong>declined</strong> the invitation.', uz: 'Taklifni rad etdish.' }
                ],
                vocab: ['fail to', 'refuse', 'decline', 'obligatory']
            },
            {
                title: 'According to, inevitably, ironically',
                titleUz: 'According to · inevitably · ironically',
                pattern: 'According to + source · Inevitably, … · Ironically, …',
                explain: 'Linking words for academic and social commentary.',
                explainUz: 'Akademik va ijtimoiy matn uchun bog\'lovchilar.',
                examples: [
                    { en: '<strong>According to</strong> reports, attitudes are changing.', uz: 'Xabarlarga ko\'ra, munosabatlar o\'zgaryapti.' },
                    { en: '<strong>Inevitably</strong>, traditions evolve.', uz: 'Muqarrar ravishda an\'analar o\'zgaradi.' },
                    { en: '<strong>Ironically</strong>, the rebel became a leader.', uz: 'Ajablanarli tarzda, isyonchi yetakchi bo\'ldi.' }
                ],
                vocab: ['according to', 'inevitably', 'ironically']
            }
        ]
    },
    {
        u: '4',
        theme: 'Science & Chemistry',
        topics: [
            {
                title: 'Present Simple for scientific facts',
                titleUz: 'Ilmiy faktlar uchun Present Simple',
                pattern: 'Subject + V(s) · Water boils at… · Chemicals contain…',
                explain: 'Universal truths and definitions use present simple, not continuous.',
                explainUz: 'Umumiy haqiqatlar va ta\'riflar uchun hozirgi oddiy zamon.',
                examples: [
                    { en: 'Water <strong>contains</strong> hydrogen and oxygen.', uz: 'Suv vodorod va kisloroddan iborat.' },
                    { en: 'H₂O <strong>stands for</strong> water.', uz: 'H₂O suvni anglatadi.' },
                    { en: 'Plants <strong>release</strong> oxygen during photosynthesis.', uz: 'O\'simliklar fotosintezda kislorod ajratadi.' }
                ],
                vocab: ['stand for', 'contain', 'chemicals', 'oxygen']
            },
            {
                title: 'Passive in science',
                titleUz: 'Ilmiy matnda passiv',
                pattern: 'be + past participle (is carried out, was discovered)',
                explain: 'Experiments and discoveries often hide the agent: "The sample was tested."',
                explainUz: 'Tajriba natijalarida bajaruvchi ko\'pincha aytilmaydi.',
                examples: [
                    { en: 'The experiment <strong>was carried out</strong> in a lab.', uz: 'Tajriba laboratoriyada o\'tkazildi.' },
                    { en: 'DNA <strong>was discovered</strong> in the 1950s.', uz: 'DNK 1950-yillarda kashf etildi.' },
                    { en: 'Results <strong>are validated</strong> by peer review.', uz: 'Natijalar tengdoshlar tekshiruvi bilan tasdiqlanadi.' }
                ],
                vocab: ['carried out', 'scientific discovery', 'validate']
            },
            {
                title: 'Quantifiers: at least, consist of',
                titleUz: 'Miqdor va tarkib',
                pattern: 'at least + number · consist of + noun',
                explain: 'Precise academic quantity and composition.',
                explainUz: 'Aniq miqdor va tarkib ifodalari.',
                examples: [
                    { en: 'The trial needs <strong>at least</strong> three repetitions.', uz: 'Tajriba kamida uch marta takrorlanishi kerak.' },
                    { en: 'Air <strong>consists of</strong> mainly nitrogen.', uz: 'Havo asosan azotdan iborat.' },
                    { en: '<strong>At least</strong> 78% is nitrogen.', uz: 'Kamida 78% azot.' }
                ],
                vocab: ['at least', 'consist of', 'contain']
            }
        ]
    },
    {
        u: '5',
        theme: 'Education & Careers',
        topics: [
            {
                title: 'Gerund vs infinitive',
                titleUz: 'Gerund va infinitiv',
                pattern: 'enjoy/finish/mind + V-ing · want/decide/aim + to V',
                explain: 'Education verbs often take -ing or to-infinitive — learn each verb\'s pattern.',
                explainUz: 'Ba\'zi fe\'llardan keyin -ing, ba\'zilaridan keyin to + fe\'l keladi.',
                examples: [
                    { en: 'She enjoys <strong>studying</strong> accounting.', uz: 'U buxgalteriya o\'qishni yoqtiradi.' },
                    { en: 'He decided <strong>to take</strong> a computer course.', uz: 'U kompyuter kursiga yozilishga qaror qildi.' },
                    { en: 'My aim is <strong>to further</strong> my career.', uz: 'Maqsadim — kasbimni rivojlantirish.' }
                ],
                vocab: ['taking a course', 'my aim is', 'striving to achieve']
            },
            {
                title: 'In order to / so as to',
                titleUz: 'Maqsad: in order to',
                pattern: 'in order to + V · so as to + V · so that + clause',
                explain: 'Purpose in formal academic writing.',
                explainUz: 'Rasmiy matnda maqsad bildirish.',
                examples: [
                    { en: 'She studied hard <strong>in order to</strong> pass.', uz: 'O\'tish uchun qattiq o\'qidi.' },
                    { en: 'We revise together <strong>so as to</strong> prepare for exams.', uz: 'Imtihonga tayyorlanish uchun birga takrorlaymiz.' },
                    { en: 'Set goals <strong>so that</strong> you stay motivated.', uz: 'Motivatsiya uchun maqsad qo\'ying.' }
                ],
                vocab: ['in order to', 'set a goal', 'keep motivated']
            },
            {
                title: 'Academic verb patterns',
                titleUz: 'Akademik fe\'l naqshlari',
                pattern: 'analyse · assess · establish · indicate · consist of',
                explain: 'Many unit 5 verbs describe research and learning processes.',
                explainUz: '5-unit fe\'llari tadqiqot va o\'rganish jarayonini tasvirlaydi.',
                examples: [
                    { en: 'Scientists <strong>analyse</strong> data carefully.', uz: 'Olimlar ma\'lumotni diqqat bilan tahlil qiladi.' },
                    { en: 'Teachers <strong>assess</strong> student progress.', uz: 'O\'qituvchilar progressni baholaydi.' },
                    { en: 'The data <strong>indicate</strong> a clear trend.', uz: 'Ma\'lumot aniq tendensiyani ko\'rsatadi.' }
                ],
                vocab: ['analyse', 'assess', 'establish', 'hypothesise']
            },
            {
                title: 'By the time + past perfect',
                titleUz: 'By the time + Past Perfect',
                pattern: 'By the time + Past Simple, Past Perfect',
                explain: 'One past event before another.',
                explainUz: 'Bitta o\'tgan voqea boshqasidan oldin.',
                examples: [
                    { en: '<strong>By the time</strong> the exam started, we had revised everything.', uz: 'Imtihon boshlanganda hammasini takrorlagan edik.' },
                    { en: '<strong>By the time</strong> I graduated, I had taken five courses.', uz: 'Bitirganimda beshta kurs o\'tgandim.' }
                ],
                vocab: ['by the time', 'successful in a test', 'reap the rewards']
            }
        ]
    },
    {
        u: '6',
        theme: 'Advertising & Persuasion',
        topics: [
            {
                title: 'Imperatives & persuasive language',
                titleUz: 'Buyruq va ishontirish uslubi',
                pattern: 'V₁ (base form) · Don\'t + V · You must / should',
                explain: 'Ads use commands and modals to persuade.',
                explainUz: 'Reklama buyruq va modal fe\'llar bilan ishontiradi.',
                examples: [
                    { en: '<strong>Buy</strong> now — limited offer!', uz: 'Hozir sotib oling — cheklangan taklif!' },
                    { en: '<strong>Don\'t miss</strong> this opportunity.', uz: 'Bu imkoniyatni qo\'ldan boy bermang.' },
                    { en: 'You <strong>deserve</strong> the best quality.', uz: 'Siz eng yaxshi sifatga loyiqsiz.' }
                ],
                vocab: ['persuade', 'appeal', 'target']
            },
            {
                title: 'Comparatives & superlatives',
                titleUz: 'Qiyosiy va eng yuqori daraja',
                pattern: 'more + adj · -er / -est · less + adj · the most',
                explain: 'Compare products: "better", "the most effective".',
                explainUz: 'Mahsulotlarni solishtirish: better, the most popular.',
                examples: [
                    { en: 'This brand is <strong>more reliable</strong> than others.', uz: 'Bu brend boshqalaridan ishonchliroq.' },
                    { en: 'It\'s <strong>the most popular</strong> choice this year.', uz: 'Bu yil eng mashhur tanlov.' },
                    { en: 'Nothing <strong>works better</strong> for dry skin.', uz: 'Quruq teri uchun bundan yaxshisi yo\'q.' }
                ],
                vocab: ['desirable', 'appealing', 'effective']
            },
            {
                title: 'Reported speech basics',
                titleUz: 'Ko\'chirma nutq asoslari',
                pattern: 'said (that) · told sb (that) · promised to V',
                explain: 'Shift tenses back when reporting what ads or people said.',
                explainUz: 'Boshqa odam so\'zini yetkazganda zamon orqaga siljiydi.',
                examples: [
                    { en: 'The ad <strong>claimed that</strong> the product was unique.', uz: 'Reklama mahsulot noyob ekanini da\'vo qildi.' },
                    { en: 'They <strong>promised to</strong> deliver within 24 hours.', uz: '24 soat ichida yetkazishga va\'da berishdi.' }
                ],
                vocab: ['claim', 'promise', 'convince']
            }
        ]
    },
    {
        u: '7',
        theme: 'Travel & Culture',
        topics: [
            {
                title: 'Prepositions of movement & place',
                titleUz: 'Harakat va joy predloglari',
                pattern: 'travel to · arrive in/at · go through · stay at',
                explain: 'Travel vocabulary needs correct prepositions.',
                explainUz: 'Sayohat so\'zlari aniq predlog talab qiladi.',
                examples: [
                    { en: 'We travelled <strong>to</strong> the Mediterranean.', uz: 'O\'rta yer dengiziga sayohat qildik.' },
                    { en: 'Sunlight streamed <strong>through</strong> the window.', uz: 'Quyosh nuri derazadan o\'tdi.' },
                    { en: 'They arrived <strong>at</strong> the airport early.', uz: 'Aeroportga erta yetishdilar.' }
                ],
                vocab: ['through', 'abroad', 'destination', 'itinerary']
            },
            {
                title: 'Have / get something done',
                titleUz: 'Have/get something done',
                pattern: 'have/get + object + past participle',
                explain: 'Someone else does the service for you.',
                explainUz: 'Ishni boshqa kishi bajaradi (xizmat).',
                examples: [
                    { en: 'I <strong>had my passport renewed</strong>.', uz: 'Pasportimni yangilatdim.' },
                    { en: 'We <strong>got the car repaired</strong> before the trip.', uz: 'Sayohatdan oldin mashinani tuzatdik.' }
                ],
                vocab: ['customs', 'visa', 'booking']
            },
            {
                title: 'Cultural collocations',
                titleUz: 'Madaniy birikmalar',
                pattern: 'experience culture · immerse yourself in · respect traditions',
                explain: 'Natural chunks for essays about travel.',
                explainUz: 'Sayohat va madaniyat insholari uchun tayyor birikmalar.',
                examples: [
                    { en: 'Tourists should <strong>respect local traditions</strong>.', uz: 'Sayyohlar mahalliy an\'analarni hurmat qilishi kerak.' },
                    { en: 'She <strong>immersed herself in</strong> the local language.', uz: 'U mahalliy tilga o\'zini berdi.' }
                ],
                vocab: ['traditions', 'heritage', 'customs']
            }
        ]
    },
    {
        u: '8',
        theme: 'Society & Government',
        topics: [
            {
                title: 'Modal verbs: obligation & permission',
                titleUz: 'Majburiyat va ruxsat (modallar)',
                pattern: 'must · have to · should · may · be allowed to',
                explain: 'Laws and society: what is required or permitted.',
                explainUz: 'Qonun va jamiyat: nima shart va nima mumkin.',
                examples: [
                    { en: 'Citizens <strong>must obey</strong> the law.', uz: 'Fuqarolar qonunga rioya qilishi shart.' },
                    { en: 'Helmets <strong>are obligatory</strong>.', uz: 'Shlem kiyish majburiy.' },
                    { en: 'You <strong>may</strong> appeal the decision.', uz: 'Qarorga shikoyat qilishingiz mumkin.' }
                ],
                vocab: ['obey', 'obligatory', 'legislation', 'regulate']
            },
            {
                title: 'Relative clauses (who, which, that)',
                titleUz: 'Ergash gaplar (who, which, that)',
                pattern: 'noun + who/which/that + clause',
                explain: 'Define policies, groups, and institutions precisely.',
                explainUz: 'Siyosat va muassasalarni aniqroq tasvirlash.',
                examples: [
                    { en: 'Politicians <strong>who ignore</strong> voters lose support.', uz: 'Saylovchilarni e\'tiborsiz qoldiruvchi siyosatchilar support yo\'qotadi.' },
                    { en: 'Laws <strong>that protect</strong> minorities are essential.', uz: 'Kamchiliklarni himoya qiluvchi qonunlar muhim.' }
                ],
                vocab: ['policy', 'minority', 'legislation']
            },
            {
                title: 'Cause & result: lead to, result in',
                titleUz: 'Sabab va natija',
                pattern: 'lead to · result in · bring about · due to',
                explain: 'Explain social and political consequences.',
                explainUz: 'Ijtimoiy-siyosiy oqibatlarni tushuntirish.',
                examples: [
                    { en: 'Poor communication <strong>led to</strong> failure.', uz: 'Yomon muloqot muvaffaqiyatsizlikka olib keldi.' },
                    { en: 'The reform <strong>resulted in</strong> greater equality.', uz: 'Islohot tenglikni oshirdi.' }
                ],
                vocab: ['led to', 'policy', 'reform']
            }
        ]
    },
    {
        u: '9',
        theme: 'Nature & Conservation',
        topics: [
            {
                title: 'Conditionals Type 0 & 1',
                titleUz: 'Shart ergash gaplar 0 va 1-turi',
                pattern: 'If + Present, Present (0) · If + Present, will (1)',
                explain: 'Facts and real future possibilities in environmental debate.',
                explainUz: 'Tabiat mavzusida haqiqiy shart va natija.',
                examples: [
                    { en: '<strong>If</strong> ice melts, sea levels rise. (0)', uz: 'Agar muz erisa, dengiz sathi ko\'tariladi.' },
                    { en: '<strong>If</strong> we conserve wetlands, we <strong>will protect</strong> wildlife. (1)', uz: 'Suvli maydonni saqlasak, yovvoyi tabiat himoyalanadi.' }
                ],
                vocab: ['conserve', 'on the verge of', 'extinction']
            },
            {
                title: 'Conditional Type 2 (hypothetical)',
                titleUz: '2-tur shart (faraziy)',
                pattern: 'If + Past Simple, would + V',
                explain: 'Unreal present situations: "If we acted now…"',
                explainUz: 'Hozirgi noreal holat: Agar hozir harakat qilsak…',
                examples: [
                    { en: '<strong>If</strong> the species <strong>disappeared</strong>, ecosystems <strong>would suffer</strong>.', uz: 'Agar tur yo\'qolsa, ekotizim zarar ko\'radi (faraz).' },
                    { en: '<strong>If</strong> we <strong>invested</strong> more, pollution <strong>would decrease</strong>.', uz: 'Ko\'proq investitsiya qilsak, ifloslanish kamayardi.' }
                ],
                vocab: ['destruction', 'erosion', 'conserve']
            },
            {
                title: 'Environmental passive & causatives',
                titleUz: 'Ekologik passiv',
                pattern: 'be threatened · be damaged · be caused by',
                explain: 'Focus on nature affected by human activity.',
                explainUz: 'Tabiatga ta\'sir — bajaruvchisiz passiv.',
                examples: [
                    { en: 'Habitats <strong>are being destroyed</strong> by logging.', uz: 'Yashash joylari kesilish bilan yo\'q qilinmoqda.' },
                    { en: 'The species <strong>is on the verge of</strong> extinction.', uz: 'Tur yo\'qolish arafasida.' }
                ],
                vocab: ['on the verge of', 'under attack', 'erosion']
            }
        ]
    },
    {
        u: '10',
        theme: 'Rocket Science & Space',
        topics: [
            {
                title: 'Scientific present & passive',
                titleUz: 'Kosmosda Present va Passiv',
                pattern: 'Rockets are launched · Data are transmitted',
                explain: 'Space reports use present for processes and passive for missions.',
                explainUz: 'Kosmos matnlari jarayon va missiya uchun passiv ishlatadi.',
                examples: [
                    { en: 'The rocket <strong>is launched</strong> at dawn.', uz: 'Raketa tongda uchiriladi.' },
                    { en: 'Satellites <strong>orbit</strong> the Earth every 90 minutes.', uz: 'Sun\'iy yo\'ldoshlar har 90 daqiqada aylanadi.' },
                    { en: 'Signals <strong>are transmitted</strong> to mission control.', uz: 'Signal missiya markaziga uzatiladi.' }
                ],
                vocab: ['launch', 'orbit', 'transmit', 'spacecraft']
            },
            {
                title: 'Future in space context',
                titleUz: 'Kosmosda kelajak zamonlari',
                pattern: 'will · going to · will have + V₃ by…',
                explain: 'Predictions and missions planned years ahead.',
                explainUz: 'Yillar oldindan rejalashtirilgan missiyalar.',
                examples: [
                    { en: 'Humans <strong>will land</strong> on Mars in the coming decades.', uz: 'Yaqin o\'n yilliklarda odamlar Marsga qo\'nadi.' },
                    { en: 'The agency <strong>is going to launch</strong> a new probe.', uz: 'Agentlik yangi zond uchirmoqchi.' },
                    { en: 'By 2040, we <strong>will have established</strong> a lunar base.', uz: '2040 yilgacha oy bazasi barpo etilgan bo\'ladi.' }
                ],
                vocab: ['mission', 'probe', 'establish']
            },
            {
                title: 'Relative clauses in technical writing',
                titleUz: 'Texnik matnda ergash gaplar',
                pattern: 'equipment that · scientists who · planet which',
                explain: 'Define technology and roles in space science.',
                explainUz: 'Texnika va rollarni aniqlashtirish.',
                examples: [
                    { en: 'Engineers <strong>who design</strong> heat shields save lives.', uz: 'Issiqlik qalqonini loyihalashtiruvchi muhandislar hayot saqlaydi.' },
                    { en: 'Fuel <strong>that powers</strong> the rocket must be stable.', uz: 'Raketani quvvatlaydigan yoqilg\'i barqaror bo\'lishi kerak.' }
                ],
                vocab: ['orbit', 'propulsion', 'trajectory']
            }
        ]
    },
    {
        u: '11',
        theme: 'Technology & Innovation',
        topics: [
            {
                title: 'Present Perfect for technological change',
                titleUz: 'Texnologik o\'zgarish: Present Perfect',
                pattern: 'have/has + V₃ · have/has been + V-ing',
                explain: 'Describe innovations that started in the past and still matter now: breakthroughs, adoption, growth.',
                explainUz: 'O\'tmishda boshlangan va hozir ham muhim bo\'lgan texnologik o\'zgarishlar: inqilob, qabul qilish, o\'sish.',
                examples: [
                    { en: 'Wireless technology <strong>has revolutionised</strong> communication.', uz: 'Simsiz texnologiya muloqotni inqilob qildi.' },
                    { en: 'Computer use worldwide <strong>has exploded</strong> since the 1990s.', uz: '1990-yillardan beri kompyuterdan foydalanish keskin oshdi.' },
                    { en: 'We <strong>have embraced</strong> digital tools <strong>to such an extent</strong> that life without them is hard to imagine.', uz: 'Raqamli vositalarni shunchalik qabul qildikki, ularsiz hayotni tasavvur qilish qiyin.' }
                ],
                vocab: ['revolutionise', 'breakthrough', 'embrace', 'explode', 'advances']
            },
            {
                title: 'Passive voice in technology',
                titleUz: 'Texnologiyada passiv',
                pattern: 'is/are + V₃ · was/were + V₃ · is being + V-ing',
                explain: 'Focus on processes, devices, and systems — who acts is often less important than what happens.',
                explainUz: 'Jarayon, qurilma va tizimga e\'tibor — kim bajargani kamroq muhim.',
                examples: [
                    { en: 'Satellite technology <strong>is harnessed</strong> by the entertainment industry.', uz: 'Sun\'iy yo\'ldosh texnologiyasi ko\'ngilochar sanoat tomonidan qo\'llaniladi.' },
                    { en: 'Massive amounts of data <strong>can be stored</strong> on a single chip.', uz: 'Bitta chipda ulkan hajmdagi ma\'lumot saqlanishi mumkin.' },
                    { en: 'Users <strong>are being targeted</strong> by online scams and fraud.', uz: 'Foydalanuvchilar onlayn firibgarlik va scam bilan nishonga olinmoqda.' }
                ],
                vocab: ['harness', 'satellite', 'processor', 'scam', 'fraud']
            },
            {
                title: 'Such … that / So … that (degree)',
                titleUz: 'Such / So … that (daraja)',
                pattern: 'such + (a/an) + adj + noun + that · so + adj/adv + that',
                explain: 'Show extreme degree or result — common when describing how much technology has changed life.',
                explainUz: 'Haddan tashqari daraja yoki natija — texnologiya qanchalik o\'zgartirganini aytishda tez-tez ishlatiladi.',
                examples: [
                    { en: 'It was <strong>such a sophisticated</strong> system <strong>that</strong> few people understood it at first.', uz: 'Bu shunchalik murakkab tizim ediki, dastlab kam odam tushundi.' },
                    { en: 'Technology advanced <strong>so quickly that</strong> industries changed at a lightning-fast pace.', uz: 'Texnologiya shunchalik tez rivojlandiki, sanoatlar chaqmoq tezligida o\'zgardi.' },
                    { en: 'Information overload became <strong>so serious that</strong> productivity fell.', uz: 'Ma\'lumot ortiqcha yuklanishi shunchalik jiddiy bo\'ldiki, samaradorlik tushdi.' }
                ],
                vocab: ['extent', 'sophisticated', 'lightning-fast', 'overload']
            },
            {
                title: 'Relative clauses (technology)',
                titleUz: 'Texnologiyada ergash gaplar',
                pattern: 'technology that · devices which · people who',
                explain: 'Define inventions, tools, and users precisely in academic writing.',
                explainUz: 'Ilmiy matnda ixtirolar, vositalar va foydalanuvchilarni aniq belgilash.',
                examples: [
                    { en: 'Processors <strong>that became</strong> smaller allowed portable computers.', uz: 'Kichiklashgan protsessorlar ko\'chma kompyuterni mumkin qildi.' },
                    { en: 'Cutting-edge tools <strong>which harness</strong> AI are transforming education.', uz: 'Sun\'iy intellektni qo\'llaydigan zamonaviy vositalar ta\'limni o\'zgartirmoqda.' },
                    { en: 'Tech-savvy users <strong>who embrace</strong> new apps drive market change.', uz: 'Yangi ilovalarni qabul qiladigan texnologiya bilimdonlari bozorni o\'zgartiradi.' }
                ],
                vocab: ['processor', 'portable', 'cutting-edge', 'tech-savvy', 'embrace']
            },
            {
                title: 'Purpose: in order to / so as to',
                titleUz: 'Maqsad: in order to / so as to',
                pattern: 'to + V · in order to + V · so as to + V · so that + clause',
                explain: 'Explain why technology is developed or used — formal purpose in essays and reports.',
                explainUz: 'Nima uchun texnologiya yaratilishi yoki ishlatilishini tushuntirish — rasmiy maqsad.',
                examples: [
                    { en: 'Engineers innovate <strong>in order to</strong> solve real-world problems.', uz: 'Muhandislar haqiqiy muammolarni hal qilish uchun innovatsiya qiladi.' },
                    { en: 'We use encryption <strong>so as to</strong> protect our identity online.', uz: 'Onlayn kimligimizni himoya qilish uchun shifrlashdan foydalanamiz.' },
                    { en: 'Systems are updated <strong>so that</strong> users can obtain immediate access to data.', uz: 'Tizimlar yangilanadi, shunda foydalanuvchilar ma\'lumotga darhol kirish oladi.' }
                ],
                vocab: ['innovate', 'obtain', 'immediate', 'identity', 'fundamental']
            },
            {
                title: 'Modals: can, could, would (ability & hypothesis)',
                titleUz: 'Modal: can, could, would',
                pattern: 'can/could + V · would + V · could have + V₃',
                explain: 'Ability (can hold), past possibility (could be built), and hypothetical past (would not have moved).',
                explainUz: 'Imkoniyat (saqlashi mumkin), o\'tmishdagi ehtimol va faraziy o\'tmish (harakat qilmas edi).',
                examples: [
                    { en: 'A single chip <strong>can hold</strong> massive amounts of data.', uz: 'Bitta chipda ulkan ma\'lumot saqlanishi mumkin.' },
                    { en: 'Leonardo\'s tank <strong>could have moved</strong> in a circle but <strong>would not have moved</strong> forward easily.', uz: 'Leonardo tanki aylana bo\'yicha harakatlanishi mumkin edi, lekin oldinga oson harakatlanmas edi.' },
                    { en: 'Without funding, the invention <strong>could not be built</strong> due to expense.', uz: 'Moliyalashtirish bo\'lmasa, ixtiro xarajat tufayli qurilmas edi.' }
                ],
                vocab: ['portable', 'tank', 'circle', 'forward', 'expense', 'legacy']
            },
            {
                title: 'Cause, result & downside',
                titleUz: 'Sabab, natija va kamchilik',
                pattern: 'lead to · result in · serve to · due to · owing to',
                explain: 'Link technological advances to effects — and disadvantages such as scams, addiction, and overload.',
                explainUz: 'Texnologik yutuqlarni oqibatlar bilan bog\'lash — scam, qaramlik, ortiqcha ma\'lumot kabi kamchiliklar.',
                examples: [
                    { en: 'Technological advances <strong>served to overhaul</strong> entire industries.', uz: 'Texnologik yutuqlar butun sohalarni qayta tashkil etishga xizmat qildi.' },
                    { en: 'Online scams <strong>lead to</strong> identity theft and financial <strong>fraud</strong>.', uz: 'Onlayn firibgarliklar o\'g\'irlik va moliyaviy firibgarlikka olib keladi.' },
                    { en: 'We were <strong>mired in</strong> problems <strong>due to</strong> cyberbullying and information overload.', uz: 'Kiberbezorilik va ma\'lumot ortiqcha yuklanishi tufayli muammolarda qoldik.' }
                ],
                vocab: ['overhaul', 'downside', 'scam', 'cyberbullying', 'overload', 'mire']
            },
            {
                title: 'Verb + object + to-infinitive / V-ing',
                titleUz: 'Fe\'l + to V / V-ing',
                pattern: 'enable sb to V · allow sb to V · avoid + V-ing · enjoy + V-ing',
                explain: 'Common patterns when describing what technology makes possible or what users should avoid.',
                explainUz: 'Texnologiya nimani mumkin qilishi yoki nimalardan qochish kerakligini aytishda tez-tez uchraydi.',
                examples: [
                    { en: 'Wireless connection <strong>enables users to</strong> work from anywhere.', uz: 'Simsiz ulanish foydalanuvchilarga istalgan joydan ishlash imkonini beradi.' },
                    { en: 'Portable devices <strong>allow us to keep</strong> technology with us at all times.', uz: 'Ko\'chma qurilmalar texnologiyani doim o\'zimiz bilan olib yurishga imkon beradi.' },
                    { en: 'People should <strong>avoid clicking</strong> on traps designed to steal passwords.', uz: 'Odamlar parol o\'g\'irlash uchun yaratilgan tuzoqlarni bosishdan qochishlari kerak.' }
                ],
                vocab: ['wireless', 'portable', 'connection', 'trap', 'enable']
            }
        ]
    }
];
