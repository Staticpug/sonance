'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Soundscape } from '@/lib/soundscapes'

type Voice = { osc: OscillatorNode; gain: GainNode }

const FADE = 1.6

// Major-pentatonic offsets (in semitones) used for the sparkly twinkles so
// every random bell note lands consonant against the pad — soda-pop galaxy.
const PENTATONIC = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24]

/**
 * Generates a fizzy, sparkly "soda pop galaxy" soundscape with the Web Audio
 * API — no audio files. Each mood layers three things:
 *   1. a soft consonant pad (slowly breathing chord),
 *   2. twinkling bell arpeggios that shimmer through a dreamy feedback delay,
 *   3. a gentle carbonation "fizz" of filtered noise.
 * The result stays calming for anxiety/depression while sounding bright,
 * bubbly, and cosmic.
 */
export function useAmbientPlayer() {
  const ctxRef = useRef<AudioContext | null>(null)
  const masterRef = useRef<GainNode | null>(null)
  const swellRef = useRef<GainNode | null>(null)
  const filterRef = useRef<BiquadFilterNode | null>(null)
  const lfoRef = useRef<OscillatorNode | null>(null)
  const voicesRef = useRef<Voice[]>([])

  // sparkle / fizz layers
  const sparkleBusRef = useRef<GainNode | null>(null)
  const fizzGainRef = useRef<GainNode | null>(null)
  const fizzGateRef = useRef<GainNode | null>(null)
  const fizzSrcRef = useRef<AudioBufferSourceNode | null>(null)
  const sparkleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const activeRef = useRef<Soundscape | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.55)
  const [current, setCurrent] = useState<Soundscape | null>(null)

  const ensureContext = useCallback(() => {
    if (ctxRef.current) return ctxRef.current
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    const ctx = new Ctx()

    const master = ctx.createGain()
    master.gain.value = volume
    master.connect(ctx.destination)

    // Dreamy feedback delay gives the twinkles a spacey, galactic trail.
    const delay = ctx.createDelay(1.0)
    delay.delayTime.value = 0.33
    const feedback = ctx.createGain()
    feedback.gain.value = 0.38
    const delayTone = ctx.createBiquadFilter()
    delayTone.type = 'lowpass'
    delayTone.frequency.value = 3200
    delay.connect(delayTone)
    delayTone.connect(feedback)
    feedback.connect(delay)
    delay.connect(master)

    const swell = ctx.createGain()
    swell.gain.value = 0.85
    swell.connect(master)

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 1400
    filter.Q.value = 0.6
    filter.connect(swell)

    // slow LFO breathing on the swell gain
    const lfo = ctx.createOscillator()
    lfo.type = 'sine'
    lfo.frequency.value = 0.1
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 0.12
    lfo.connect(lfoGain)
    lfoGain.connect(swell.gain)
    lfo.start()

    // Sparkle bus feeds both the dry master and the delay for shimmer.
    const sparkleBus = ctx.createGain()
    sparkleBus.gain.value = 0.9
    sparkleBus.connect(master)
    sparkleBus.connect(delay)

    // Carbonation fizz: looping filtered noise, kept very soft.
    const noiseLen = 2 * ctx.sampleRate
    const noiseBuf = ctx.createBuffer(1, noiseLen, ctx.sampleRate)
    const data = noiseBuf.getChannelData(0)
    for (let i = 0; i < noiseLen; i++) data[i] = Math.random() * 2 - 1
    const fizzSrc = ctx.createBufferSource()
    fizzSrc.buffer = noiseBuf
    fizzSrc.loop = true
    const fizzBand = ctx.createBiquadFilter()
    fizzBand.type = 'bandpass'
    fizzBand.frequency.value = 5200
    fizzBand.Q.value = 0.8
    const fizzGain = ctx.createGain()
    fizzGain.gain.value = 0.006
    // Dedicated on/off gate the LFO never touches, so pause fully mutes the
    // fizz regardless of where the shimmer LFO happens to be in its cycle.
    const fizzGate = ctx.createGain()
    fizzGate.gain.value = 0.0001
    fizzSrc.connect(fizzBand)
    fizzBand.connect(fizzGain)
    fizzGain.connect(fizzGate)
    fizzGate.connect(master)
    // shimmer the fizz so carbonation feels alive — subtle, so it never
    // overpowers the tiny base level and become audible white noise.
    const fizzLfo = ctx.createOscillator()
    fizzLfo.type = 'sine'
    fizzLfo.frequency.value = 0.7
    const fizzLfoGain = ctx.createGain()
    fizzLfoGain.gain.value = 0.003
    fizzLfo.connect(fizzLfoGain)
    fizzLfoGain.connect(fizzGain.gain)
    fizzSrc.start()
    fizzLfo.start()

    ctxRef.current = ctx
    masterRef.current = master
    swellRef.current = swell
    filterRef.current = filter
    lfoRef.current = lfo
    sparkleBusRef.current = sparkleBus
    fizzGainRef.current = fizzGain
    fizzSrcRef.current = fizzSrc
    return ctx
  }, [volume])

  const stopVoices = useCallback((fade = FADE) => {
    const ctx = ctxRef.current
    if (!ctx) return
    const now = ctx.currentTime
    for (const v of voicesRef.current) {
      v.gain.gain.cancelScheduledValues(now)
      v.gain.gain.setValueAtTime(v.gain.gain.value, now)
      v.gain.gain.linearRampToValueAtTime(0.0001, now + fade)
      v.osc.stop(now + fade + 0.1)
    }
    voicesRef.current = []
  }, [])

  // Plays a single twinkling bell note through the sparkle bus.
  const twinkle = useCallback((scape: Soundscape) => {
    const ctx = ctxRef.current
    const bus = sparkleBusRef.current
    if (!ctx || !bus) return
    const now = ctx.currentTime
    const root = scape.notes[0] * 4 // a couple octaves up = bright + glassy
    const semi = PENTATONIC[Math.floor(Math.random() * PENTATONIC.length)]
    const freq = root * Math.pow(2, semi / 12)

    const gain = ctx.createGain()
    const peak = 0.16 * (0.5 + scape.sparkle * 0.6)
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(peak, now + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4)
    gain.connect(bus)

    // fundamental + shimmering octave partial for a bell-like ring
    const o1 = ctx.createOscillator()
    o1.type = 'sine'
    o1.frequency.value = freq
    const o2 = ctx.createOscillator()
    o2.type = 'sine'
    o2.frequency.value = freq * 2.01
    const o2g = ctx.createGain()
    o2g.gain.value = 0.35
    o1.connect(gain)
    o2.connect(o2g)
    o2g.connect(gain)
    o1.start(now)
    o2.start(now)
    o1.stop(now + 1.5)
    o2.stop(now + 1.5)
  }, [])

  const scheduleSparkle = useCallback(() => {
    const scape = activeRef.current
    if (!scape) return
    twinkle(scape)
    // denser sparkle = shorter gaps between twinkles
    const base = 900 - scape.sparkle * 620
    const next = base + Math.random() * 320
    sparkleTimerRef.current = setTimeout(scheduleSparkle, next)
  }, [twinkle])

  const stopSparkle = useCallback(() => {
    if (sparkleTimerRef.current) {
      clearTimeout(sparkleTimerRef.current)
      sparkleTimerRef.current = null
    }
  }, [])

  const play = useCallback(
    (scape: Soundscape) => {
      const ctx = ensureContext()
      if (ctx.state === 'suspended') void ctx.resume()

      stopVoices()
      stopSparkle()

      const filter = filterRef.current!
      const now = ctx.currentTime
      filter.frequency.cancelScheduledValues(now)
      filter.frequency.setValueAtTime(filter.frequency.value, now)
      filter.frequency.linearRampToValueAtTime(scape.cutoff, now + FADE)

      if (lfoRef.current) {
        lfoRef.current.frequency.setValueAtTime(scape.swell, now)
      }

      // ramp the carbonation fizz to this mood's level
      const fizzGain = fizzGainRef.current
      const fizzGate = fizzGateRef.current
      if (fizzGain) {
        const target = 0.006 + scape.fizz * 0.05
        fizzGain.gain.cancelScheduledValues(now)
        fizzGain.gain.setValueAtTime(Math.max(0.0001, fizzGain.gain.value), now)
        fizzGain.gain.linearRampToValueAtTime(target, now + FADE)
      }
      if (fizzGate) {
        fizzGate.gain.cancelScheduledValues(now)
        fizzGate.gain.setValueAtTime(Math.max(0.0001, fizzGate.gain.value), now)
        fizzGate.gain.linearRampToValueAtTime(1, now + FADE)
      }

      const peak = 0.9 / Math.max(3, scape.notes.length)
      scape.notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        osc.type = scape.waveform
        osc.frequency.value = freq
        // subtle detune per voice keeps the pad from sounding sterile
        osc.detune.value = (i - scape.notes.length / 2) * 4

        const gain = ctx.createGain()
        gain.gain.value = 0.0001
        gain.gain.setValueAtTime(0.0001, now)
        gain.gain.linearRampToValueAtTime(peak, now + FADE + i * 0.25)

        osc.connect(gain)
        gain.connect(filter)
        osc.start(now)
        voicesRef.current.push({ osc, gain })
      })

      activeRef.current = scape
      scheduleSparkle()

      setCurrent(scape)
      setIsPlaying(true)
    },
    [ensureContext, stopVoices, stopSparkle, scheduleSparkle],
  )

  const pause = useCallback(() => {
    stopVoices()
    stopSparkle()
    activeRef.current = null
    const ctx = ctxRef.current
    const fizzGate = fizzGateRef.current
    if (ctx && fizzGate) {
      const now = ctx.currentTime
      fizzGate.gain.cancelScheduledValues(now)
      fizzGate.gain.setValueAtTime(Math.max(0.0001, fizzGate.gain.value), now)
      fizzGate.gain.linearRampToValueAtTime(0.0001, now + FADE)
    }
    setIsPlaying(false)
  }, [stopVoices, stopSparkle])

  const toggle = useCallback(
    (scape: Soundscape) => {
      if (isPlaying && current?.id === scape.id) {
        pause()
      } else {
        play(scape)
      }
    },
    [isPlaying, current, play, pause],
  )

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause()
    } else if (current) {
      play(current)
    }
  }, [isPlaying, current, play, pause])

  useEffect(() => {
    const ctx = ctxRef.current
    const master = masterRef.current
    if (!ctx || !master) return
    const now = ctx.currentTime
    master.gain.cancelScheduledValues(now)
    master.gain.setValueAtTime(master.gain.value, now)
    master.gain.linearRampToValueAtTime(Math.max(0.0001, volume), now + 0.2)
  }, [volume])

  useEffect(() => {
    return () => {
      stopVoices(0.05)
      stopSparkle()
      lfoRef.current?.stop()
      fizzSrcRef.current?.stop()
      void ctxRef.current?.close()
    }
  }, [stopVoices, stopSparkle])

  return {
    isPlaying,
    volume,
    setVolume,
    current,
    toggle,
    togglePlay,
    pause,
  }
}
