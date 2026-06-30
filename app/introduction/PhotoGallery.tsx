import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import {
  getPhotoAlt,
  getPhotoCaption,
  introPhotos,
} from "@/lib/intro-photos";

export function PhotoGallery({ locale }: { locale: Locale }) {
  const [featured, ...rest] = introPhotos;

  return (
    <div className="p-6 space-y-6">
      <figure className="overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
        <div className="relative aspect-[16/10] w-full">
          <Image
            src={featured.src}
            alt={getPhotoAlt(featured, locale)}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 720px"
            priority
          />
        </div>
        <figcaption className="px-4 py-3 text-center text-sm text-gray-500">
          {getPhotoCaption(featured, locale)}
        </figcaption>
      </figure>

      <div className="grid gap-6 sm:grid-cols-2">
        {rest.map((photo) => (
          <figure
            key={photo.src}
            className="overflow-hidden rounded-xl border border-gray-100 bg-gray-50"
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={photo.src}
                alt={getPhotoAlt(photo, locale)}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 340px"
              />
            </div>
            <figcaption className="px-4 py-3 text-center text-sm text-gray-500">
              {getPhotoCaption(photo, locale)}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
