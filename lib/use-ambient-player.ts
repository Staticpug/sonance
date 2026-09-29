'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Soundscape } from '@/lib/soundscapes'

type Voice = { osc: OscillatorNode; gain: GainNode }

const FADE = 1.6

/**
 * Generates gentle, evolving ambient pads with the Web Audio API so the
 * soundscapes actually play — no audio files required. Each mood is a soft
 * consonant chord run through a warm low-pass filter with a slow amplitude
 * swell (an LFO) so the sound breathes rather than sitting flat.
 */
export function useAmbientPlayer() {
  const ctxRef = useRef<AudioContext | null>(null)
  const masterRef = useRef<GainNode | null>(null)
  const swellRef = useRef<GainNode | null>(null)
  const filterRef = useRef<BiquadFilterNode | null>(null)
  const lfoRef = useRef<OscillatorNode | null>(null)
  const voicesRef = useRef<Voice[]>([])

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

    const swell = ctx.createGain()
    swell.gain.value = 0.85
    swell.connect(master)

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 900
    filter.Q.value = 0.6
    filter.connect(swell)

    // slow LFO breathing on the swell gain
    const lfo = ctx.createOscillator()
    lfo.type = 'sine'
    lfo.frequency.value = 0.06
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 0.12
    lfo.connect(lfoGain)
    lfoGain.connect(swell.gain)
    lfo.start()

    ctxRef.current = ctx
    masterRef.current = master
    swellRef.current = swell
    filterRef.current = filter
    lfoRef.current = lfo
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

  const play = useCallback(
    (scape: Soundscape) => {
      const ctx = ensureContext()
      if (ctx.state === 'suspended') void ctx.resume()

      stopVoices()

      const filter = filterRef.current!
      const now = ctx.currentTime
      filter.frequency.cancelScheduledValues(now)
      filter.frequency.setValueAtTime(filter.frequency.value, now)
      filter.frequency.linearRampToValueAtTime(scape.cutoff, now + FADE)

      if (lfoRef.current) {
        lfoRef.current.frequency.setValueAtTime(scape.swell, now)
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

      setCurrent(scape)
      setIsPlaying(true)
    },
    [ensureContext, stopVoices],
  )

  const pause = useCallback(() => {
    stopVoices()
    setIsPlaying(false)
  }, [stopVoices])

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
      lfoRef.current?.stop()
      void ctxRef.current?.close()
    }
  }, [stopVoices])

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
