export type Category = 
  | 'All'
  | 'High Heels & Arches'
  | 'Silk & Boudoir'
  | 'Beach & Water Droplets'
  | 'Streetwear & Sneakers'
  | 'Sculptural Monochrome'
  | 'Tattooed & Golden Gems';

export type LicenseTier = 'personal' | 'commercial' | 'exclusive';

export interface ExifData {
  camera: string;
  lens: string;
  aperture: string;
  shutter: string;
  iso: string;
  lighting: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface PhotoSet {
  id: string;
  title: string;
  subtitle: string;
  studioId: string;
  studioName: string;
  creatorName: string;
  isStudio: boolean; // true = Studio, false = Independent Seller
  category: Category;
  coverImage: string;
  galleryImages: string[];
  price: number;
  photoCount: number;
  resolution: string; // e.g. '4K UHD', '8K RAW', '6K DCI'
  rating: number;
  reviewCount: number;
  badge?: string;
  description: string;
  exif: ExifData;
  reviews: Review[];
  accentColor: 'cyan' | 'magenta' | 'amber' | 'indigo';
  featured?: boolean;
}

export interface Studio {
  id: string;
  name: string;
  founder: string;
  location: string;
  bio: string;
  avatarUrl: string;
  bannerUrl: string;
  isStudio: boolean;
  totalSets: number;
  followers: number;
  rating: number;
  aesthetic: string;
}

export interface CartItem {
  set: PhotoSet;
  license: LicenseTier;
  licenseMultiplier: number;
  price: number;
}
