"use client"

import { useEffect, useRef, useState, useCallback } from "react"

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

declare global {
  interface Window {
    google?: {
      maps?: {
        places?: {
          AutocompleteService: new () => {
            getPlacePredictions: (
              request: { input: string; componentRestrictions?: { country: string | string[] }; types?: string[] },
              callback: (predictions: Array<{ description: string; place_id: string; structured_formatting?: { main_text?: string; secondary_text?: string } }> | null) => void
            ) => void
          }
          PlacesService: new (attrContainer: HTMLElement) => {
            getDetails: (
              request: { placeId: string; fields: string[] },
              callback: (result: any, status: string) => void
            ) => void
          }
        }
      }
    }
  }
}

let scriptLoading = false
let scriptLoaded = false
let scriptFailed = false

function loadScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (scriptLoaded) return resolve()
    if (scriptFailed) return reject(new Error("Google Maps failed to load"))
    if (typeof window !== "undefined" && window.google?.maps?.places) {
      scriptLoaded = true
      return resolve()
    }
    if (scriptLoading) {
      const check = setInterval(() => {
        if (scriptLoaded) { clearInterval(check); resolve() }
        if (scriptFailed) { clearInterval(check); reject(new Error("Google Maps failed to load")) }
      }, 100)
      return
    }
    if (!API_KEY) {
      scriptFailed = true
      return reject(new Error("Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"))
    }
    scriptLoading = true
    const s = document.createElement("script")
    s.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&v=weekly`
    s.async = true
    s.defer = true
    s.onload = () => { scriptLoaded = true; scriptLoading = false; resolve() }
    s.onerror = () => { scriptFailed = true; scriptLoading = false; reject(new Error("Failed to load Google Maps")) }
    document.head.appendChild(s)
  })
}

export interface PlaceDetails {
  formattedAddress: string
  name: string
  placeId: string
  geometry?: { lat: number; lng: number }
  addressComponents?: Array<{
    longName: string
    shortName: string
    types: string[]
  }>
}

export interface Suggestion {
  description: string
  placeId: string
  mainText: string
  secondaryText: string
}

interface Options {
  onPlaceSelected?: (place: PlaceDetails) => void
  country?: string | string[]
}

export function useGooglePlacesAutocomplete(options: Options = {}) {
  const serviceRef = useRef<InstanceType<any> | null>(null)
  const placesRef = useRef<InstanceType<any> | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadScript()
      .then(() => {
        if (!window.google?.maps?.places) return
        serviceRef.current = new window.google.maps.places.AutocompleteService()
        if (!containerRef.current) {
          containerRef.current = document.createElement("div")
        }
        placesRef.current = new window.google.maps.places.PlacesService(containerRef.current)
      })
      .catch(() => {})
  }, [])

  const fetchSuggestions = useCallback((input: string) => {
    if (!serviceRef.current || !input || input.length < 2) {
      setSuggestions([])
      return
    }
    setIsLoading(true)
    serviceRef.current.getPlacePredictions(
      {
        input,
        componentRestrictions: { country: options.country ?? ["my"] },
        types: ["geocode", "establishment"],
      },
      (predictions: any[] | null) => {
        setIsLoading(false)
        if (!predictions) { setSuggestions([]); return }
        setSuggestions(
          predictions.map((p) => ({
            description: p.description,
            placeId: p.place_id,
            mainText: p.structured_formatting?.main_text ?? p.description,
            secondaryText: p.structured_formatting?.secondary_text ?? "",
          }))
        )
      }
    )
  }, [options.country])

  const selectSuggestion = useCallback(
    (suggestion: Suggestion) => {
      if (!placesRef.current) return
      setSuggestions([])
      placesRef.current.getDetails(
        { placeId: suggestion.placeId, fields: ["formatted_address", "name", "place_id", "geometry", "address_components"] },
        (result: any, status: string) => {
          if (status !== "OK" || !result) return
          options.onPlaceSelected?.({
            formattedAddress: result.formatted_address ?? "",
            name: result.name ?? "",
            placeId: result.place_id,
            geometry: result.geometry?.location
              ? { lat: result.geometry.location.lat(), lng: result.geometry.location.lng() }
              : undefined,
            addressComponents: result.address_components?.map((c: any) => ({
              longName: c.long_name,
              shortName: c.short_name,
              types: c.types,
            })),
          })
        }
      )
    },
    [options.onPlaceSelected]
  )

  const clearSuggestions = useCallback(() => setSuggestions([]), [])

  return { suggestions, isLoading, fetchSuggestions, selectSuggestion, clearSuggestions }
}
