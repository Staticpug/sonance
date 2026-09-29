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
  /** filter cutoff in Hz — higher is brighter/fizzier */
  cutoff: number
  /** swell speed in Hz for the slow amplitude LFO */
  swell: number
  /** twinkle density 0–1 — how often sparkly bell notes shimmer through */
  sparkle: number
  /** carbonation fizz level 0–1 — soft effervescent shimmer */
  fizz: number
  gradient: string
}

export const soundscapes: Soundscape[] = [
  {
    id: 'stillness',
    name: 'Stillness',
    feeling: 'for a racing mind',
    description:
      'A soft cosmic drone with slow twinkles that give anxious thoughts somewhere gentle to float.',
    helps: 'Anxiety · panic · overwhelm',
    notes: [130.81, 196.0, 261.63, 392.0],
    waveform: 'sine',
    cutoff: 1600,
    swell: 0.1,
    sparkle: 0.4,
    fizz: 0.3,
    gradient:
      'radial-gradient(120% 120% at 20% 20%, oklch(0.78 0.16 300) 0%, oklch(0.66 0.14 250) 55%, oklch(0.42 0.1 288) 100%)',
  },
  {
    id: 'lift',
    name: 'Lift',
    feeling: 'for heavy days',
    description:
      'A fizzy major chord that bubbles upward — a burst of light and sparkle when everything feels flat.',
    helps: 'Depression · low mood · numbness',
    notes: [146.83, 220.0, 293.66, 440.0, 587.33],
    waveform: 'triangle',
    cutoff: 2600,
    swell: 0.16,
    sparkle: 0.85,
    fizz: 0.7,
    gradient:
      'radial-gradient(120% 120% at 80% 20%, oklch(0.88 0.14 90) 0%, oklch(0.8 0.15 20) 55%, oklch(0.62 0.16 340) 100%)',
  },
  {
    id: 'rest',
    name: 'Rest',
    feeling: 'for sleepless nights',
    description:
      'Deep dreamy tones with faint, faraway twinkles to slow your breathing and quiet the 3am spiral.',
    helps: 'Insomnia · restlessness · tension',
    notes: [98.0, 146.83, 196.0, 246.94],
    waveform: 'sine',
    cutoff: 1100,
    swell: 0.07,
    sparkle: 0.25,
    fizz: 0.2,
    gradient:
      'radial-gradient(120% 120% at 30% 80%, oklch(0.62 0.14 285) 0%, oklch(0.46 0.11 300) 55%, oklch(0.3 0.07 295) 100%)',
  },
  {
    id: 'grounding',
    name: 'Grounding',
    feeling: 'for coming back to yourself',
    description:
      'A steady, rooted hum wrapped in soft fizz to hold onto when you feel scattered or far away.',
    helps: 'Dissociation · panic · spiraling',
    notes: [110.0, 164.81, 220.0, 329.63],
    waveform: 'sine',
    cutoff: 1500,
    swell: 0.09,
    sparkle: 0.5,
    fizz: 0.45,
    gradient:
      'radial-gradient(120% 120% at 70% 70%, oklch(0.78 0.15 165) 0%, oklch(0.68 0.14 200) 55%, oklch(0.46 0.11 250) 100%)',
  },
  {
    id: 'release',
    name: 'Release',
    feeling: 'for when you need to let go',
    description:
      'A tender progression laced with shimmering sparkle that makes space for feelings you have held in.',
    helps: 'Grief · sadness · emotional weight',
    notes: [123.47, 185.0, 246.94, 311.13, 369.99],
    waveform: 'triangle',
    cutoff: 2000,
    swell: 0.12,
    sparkle: 0.6,
    fizz: 0.5,
    gradient:
      'radial-gradient(120% 120% at 25% 30%, oklch(0.82 0.14 350) 0%, oklch(0.68 0.16 335) 55%, oklch(0.46 0.13 310) 100%)',
  },
  {
    id: 'focus',
    name: 'Clarity',
    feeling: 'for a foggy head',
    description:
      'Bright, effervescent harmonics that fizz through mental clutter without demanding anything.',
    helps: 'Brain fog · rumination · stress',
    notes: [174.61, 261.63, 349.23, 523.25],
    waveform: 'sine',
    cutoff: 3200,
    swell: 0.14,
    sparkle: 0.9,
    fizz: 0.75,
    gradient:
      'radial-gradient(120% 120% at 75% 30%, oklch(0.85 0.13 200) 0%, oklch(0.74 0.15 250) 55%, oklch(0.54 0.14 290) 100%)',
  },
]
