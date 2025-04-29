"use client"

import type { ReactNode } from "react"
import Image from "next/image"

interface HeroProps {
  title: string
  subtitle: string
  image?: string
  children?: ReactNode
}

export function Hero({ title, subtitle, image, children }: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-background">
      <div className="container px-4 md:px-6 flex flex-col lg:flex-row items-center gap-6 py-12 md:py-16 lg:py-24">
        <div className="flex flex-col gap-4 lg:w-1/2 text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-[600px] mx-auto lg:mx-0">{subtitle}</p>
          {children}
        </div>
        {image && (
          <div className="lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[500px] aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
              <Image
                src={image || "/images/trip.jpg"}
                alt="Hero image"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 500px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        )}
      </div>
      <div className="absolute inset-0 -z-10 h-full w-full bg-background">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>
    </div>
  )
}
