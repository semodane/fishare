import type { Prisma } from "@prisma/client";
import type { Boat } from "@/types/boat";
import type { Harbor } from "@/types/harbor";
import type { Place, PlaceCategory } from "@/types/place";
import type { Review, ReviewTagKey, ReviewTargetType } from "@/types/review";
import type { TideInfo } from "@/types/tide";

function iso(d: Date): string {
  return d.toISOString();
}

function ymd(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function mapHarbor(row: {
  id: string;
  name: string;
  region: string;
  areaLabel: string;
  description: string;
  address: string;
  lat: number | null;
  lng: number | null;
  tags: string[];
  updatedAt: Date;
}): Harbor {
  return {
    id: row.id,
    name: row.name,
    region: row.region,
    areaLabel: row.areaLabel,
    description: row.description,
    address: row.address,
    lat: row.lat ?? undefined,
    lng: row.lng ?? undefined,
    tags: row.tags,
    updatedAt: iso(row.updatedAt)
  };
}

export function mapBoat(row: {
  id: string;
  harborId: string;
  name: string;
  operatorName: string;
  capacity: number;
  priceLabel: string;
  departureHarborName: string;
  contact?: string | null;
  bookingUrl?: string | null;
  tags: string[];
  imageUrl: string | null;
  updatedAt: Date;
}): Boat {
  return {
    id: row.id,
    harborId: row.harborId,
    name: row.name,
    operatorName: row.operatorName,
    capacity: row.capacity,
    priceLabel: row.priceLabel,
    departureHarborName: row.departureHarborName,
    contact: row.contact ?? undefined,
    bookingUrl: row.bookingUrl ?? undefined,
    tags: row.tags,
    imageUrl: row.imageUrl ?? undefined,
    updatedAt: iso(row.updatedAt)
  };
}

export function mapPlace(row: {
  id: string;
  harborId: string;
  name: string;
  category: string;
  address: string;
  note: string | null;
  phone: string | null;
  openHours: string | null;
  lat: number | null;
  lng: number | null;
  updatedAt: Date;
}): Place {
  return {
    id: row.id,
    harborId: row.harborId,
    name: row.name,
    category: row.category as PlaceCategory,
    address: row.address,
    note: row.note ?? undefined,
    phone: row.phone ?? undefined,
    openHours: row.openHours ?? undefined,
    lat: row.lat ?? undefined,
    lng: row.lng ?? undefined
  };
}

export function mapTideInfo(row: {
  id: string;
  harborId: string;
  date: Date;
  timezone: string;
  sourceLabel: string;
  summary: string;
  tides: Prisma.JsonValue;
}): TideInfo {
  return {
    id: row.id,
    harborId: row.harborId,
    date: ymd(row.date),
    timezone: "Asia/Seoul",
    sourceLabel: row.sourceLabel,
    summary: row.summary,
    tides: (row.tides as TideInfo["tides"]) ?? []
  };
}

export function mapReview(row: {
  id: string;
  authorId: string;
  authorNickname?: string | null;
  targetType: string;
  targetId: string;
  harborId: string;
  rating: number;
  title: string;
  content: string;
  visitedAt: Date;
  createdAt: Date;
  images: string[];
  tags: Prisma.JsonValue | null;
  wouldRevisit: boolean | null;
  detailScores: Prisma.JsonValue | null;
}): Review {
  return {
    id: row.id,
    authorId: row.authorId,
    authorNickname: row.authorNickname ?? undefined,
    targetType: row.targetType as ReviewTargetType,
    targetId: row.targetId,
    harborId: row.harborId,
    rating: row.rating as Review["rating"],
    title: row.title,
    content: row.content,
    visitedAt: ymd(row.visitedAt),
    createdAt: iso(row.createdAt),
    images: row.images?.length ? row.images : undefined,
    tags: (row.tags as ReviewTagKey[] | null) ?? undefined,
    wouldRevisit: row.wouldRevisit ?? undefined,
    detailScores: (row.detailScores as Review["detailScores"] | null) ?? undefined
  };
}


