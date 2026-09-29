export type Soundscape = {
  id: string
  name: string
  feeling: string
  description: string
  /** For whom / when this helps */
  helps: string
  /** Root chord frequencies in Hz — gentle, consonant voicings */
  notes: number[]
  waveform: OscillatorType
  /** filter cutoff in Hz — lower is warmer/darker */
  cutoff: number
  /** swell speed in Hz for the slow amplitude LFO */
  swell: number
  gradient: string
}

export const soundscapes: Soundscape[] = [
  {
    id: 'stillness',
    name: 'Stillness',
    feeling: 'for a racing mind',
    description:
      'A low, unhurried drone that gives anxious thoughts somewhere soft to land.',
    helps: 'Anxiety · panic · overwhelm',
    notes: [130.81, 196.0, 261.63, 392.0],
    waveform: 'sine',
    cutoff: 900,
    swell: 0.06,
    gradient:
      'radial-gradient(120% 120% at 20% 20%, oklch(0.7 0.12 292) 0%, oklch(0.6 0.09 250) 55%, oklch(0.4 0.06 288) 100%)',
  },
  {
    id: 'lift',
    name: 'Lift',
    feeling: 'for heavy days',
    description:
      'A warm major chord that opens up slowly — a small window of light when everything feels flat.',
    helps: 'Depression · low mood · numbness',
    notes: [146.83, 220.0, 293.66, 440.0, 587.33],
    waveform: 'triangle',
    cutoff: 1400,
    swell: 0.09,
    gradient:
      'radial-gradient(120% 120% at 80% 20%, oklch(0.85 0.1 70) 0%, oklch(0.75 0.09 40) 55%, oklch(0.55 0.09 20) 100%)',
  },
  {
    id: 'rest',
    name: 'Rest',
    feeling: 'for sleepless nights',
    description:
      'Deep, dim tones that slow your breathing down and quiet the 3am spiral.',
    helps: 'Insomnia · restlessness · tension',
    notes: [98.0, 146.83, 196.0, 246.94],
    waveform: 'sine',
    cutoff: 620,
    swell: 0.04,
    gradient:
      'radial-gradient(120% 120% at 30% 80%, oklch(0.55 0.1 275) 0%, oklch(0.42 0.08 288) 55%, oklch(0.28 0.05 290) 100%)',
  },
  {
    id: 'grounding',
    name: 'Grounding',
    feeling: 'for coming back to yourself',
    description:
      'A steady, rooted hum to hold onto when you feel scattered or far away.',
    helps: 'Dissociation · panic · spiraling',
    notes: [110.0, 164.81, 220.0, 329.63],
    waveform: 'sine',
    cutoff: 780,
    swell: 0.05,
    gradient:
      'radial-gradient(120% 120% at 70% 70%, oklch(0.72 0.1 155) 0%, oklch(0.6 0.09 190) 55%, oklch(0.4 0.06 230) 100%)',
  },
  {
    id: 'release',
    name: 'Release',
    feeling: 'for when you need to let go',
    description:
      'A tender, aching progression that makes space for the feelings you have been holding in.',
    helps: 'Grief · sadness · emotional weight',
    notes: [123.47, 185.0, 246.94, 311.13, 369.99],
    waveform: 'triangle',
    cutoff: 1100,
    swell: 0.07,
    gradient:
      'radial-gradient(120% 120% at 25% 30%, oklch(0.78 0.09 350) 0%, oklch(0.62 0.1 340) 55%, oklch(0.42 0.08 320) 100%)',
  },
  {
    id: 'focus',
    name: 'Clarity',
    feeling: 'for a foggy head',
    description:
      'Bright but soft harmonics that gently clear the mental clutter without demanding anything.',
    helps: 'Brain fog · rumination · stress',
    notes: [174.61, 261.63, 349.23, 523.25],
    waveform: 'sine',
    cutoff: 1800,
    swell: 0.08,
    gradient:
      'radial-gradient(120% 120% at 75% 30%, oklch(0.8 0.09 210) 0%, oklch(0.68 0.1 250) 55%, oklch(0.5 0.09 280) 100%)',
  },
]
