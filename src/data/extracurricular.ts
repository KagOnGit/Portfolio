export type ExtraCert = {
  id: string;
  title: string;
  dateISO: string;         // YYYY-MM-DD
  caption: string;
  src: string;             // /achievements/*.jpg
};

export const extracurricular: ExtraCert[] = [
  {
    id: 'pkk-2015-part2',
    title: 'Sangeet Bhushan Part 2 (2nd Year)',
    dateISO: '2015-04-30',
    caption: 'Certificate of Sangeet Bhushan Part 2 – Flute (Indian Classical). First Division with Distinction.',
    src: '/achievements/pkk-bhushan-part2-2015.jpg'
  },
  {
    id: 'pkk-2016-final',
    title: 'Sangeet Bhushan Final (3rd Year)',
    dateISO: '2016-04-03',
    caption: 'Certificate of Sangeet Bhushan Final – Flute (Indian Classical). First Division with Distinction.',
    src: '/achievements/pkk-bhushan-final-2016.jpg'
  },
  {
    id: 'pkk-2017-visharad',
    title: 'Sangeet Visharad Part 1 (4th Year)',
    dateISO: '2017-05-31',
    caption: 'Diploma of Sangeet Visharad Part 1 – Flute (Indian Classical). First Division with Distinction.',
    src: '/achievements/pkk-visharad-2017.jpg'
  },
  {
    id: 'apn-2017-student',
    title: 'APN Student of the Year – Budding Talent Award',
    dateISO: '2017-12-16',
    caption: 'Recognized as Student of the Year 2017 – Modern School, Barakhamba Road, New Delhi.',
    src: '/achievements/apn-2017.jpg'
  }
].sort((a,b)=>a.dateISO.localeCompare(b.dateISO));
