"use client";

import { PropertyMediaUpload } from "@/components/property-media-upload";
import { PropertyMedia } from "@/types/property";

interface MediaStepProps {
  media: PropertyMedia[];
  onMediaChange: (media: PropertyMedia[]) => void;
}

export function MediaStep({ media, onMediaChange }: MediaStepProps) {
  return (
    <PropertyMediaUpload
      media={media}
      onMediaChange={onMediaChange}
      maxFiles={10}
    />
  );
}
