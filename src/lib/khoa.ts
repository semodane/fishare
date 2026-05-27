/**
 * KHOA (국립해양조사원) 조석예보(고, 저조) API 연동
 * Endpoint: https://apis.data.go.kr/1192136/tideFcstHghLw/GetTideFcstHghLwApiService
 * extrSe: 1=오전고조, 2=오전저조, 3=오후고조, 4=오후저조
 */

const BASE_URL =
  "https://apis.data.go.kr/1192136/tideFcstHghLw/GetTideFcstHghLwApiService";

type KhoaItem = {
  obsvtrNm: string;
  lot: number;
  lat: number;
  predcDt: string; // "YYYY-MM-DD HH:mm"
  predcTdlvVl: number; // 예측조위값(cm)
  extrSe: string; // "1"=오전고조 "2"=오전저조 "3"=오후고조 "4"=오후저조
};

export type TidePrediction = {
  time: string; // "HH:mm"
  type: "high" | "low";
  heightCm: number;
  label: string; // "오전 고조" 등
};

export type KhoaTideResult = {
  stationName: string;
  date: string; // "YYYY-MM-DD"
  tides: TidePrediction[];
  summary: string;
};

const EXTR_SE_MAP: Record<string, { type: "high" | "low"; label: string }> = {
  "1": { type: "high", label: "오전 고조" },
  "2": { type: "low",  label: "오전 저조" },
  "3": { type: "high", label: "오후 고조" },
  "4": { type: "low",  label: "오후 저조" },
};

function toDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

export async function fetchTidePredictions(
  obsCode: string,
  date?: Date
): Promise<KhoaTideResult | null> {
  const apiKey = process.env.KHOA_API_KEY;
  if (!apiKey) return null;

  const reqDate = toDateStr(date ?? new Date());
  const url = `${BASE_URL}?serviceKey=${encodeURIComponent(apiKey)}&obsCode=${obsCode}&reqDate=${reqDate}&numOfRows=10&type=json`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } }); // 1시간 캐시
    if (!res.ok) return null;

    const json = (await res.json()) as {
      header?: { resultCode: string };
      body?: { items?: { item?: KhoaItem[] } };
    };

    if (json.header?.resultCode !== "00") return null;

    const items = json.body?.items?.item ?? [];
    if (!items.length) return null;

    const stationName = items[0].obsvtrNm;
    const dateLabel = reqDate.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");

    const tides: TidePrediction[] = items.map((item) => {
      const meta = EXTR_SE_MAP[item.extrSe] ?? { type: "high" as const, label: "고조" };
      const time = item.predcDt.split(" ")[1] ?? "00:00";
      return {
        time,
        type: meta.type,
        heightCm: item.predcTdlvVl,
        label: meta.label,
      };
    });

    // 요약 문장 생성
    const highTides = tides.filter((t) => t.type === "high");
    const lowTides  = tides.filter((t) => t.type === "low");
    const summaryParts: string[] = [];
    if (highTides.length) summaryParts.push(`고조 ${highTides.map((t) => `${t.time}(${t.heightCm}cm)`).join(", ")}`);
    if (lowTides.length)  summaryParts.push(`저조 ${lowTides.map((t) => `${t.time}(${t.heightCm}cm)`).join(", ")}`);
    const summary = summaryParts.join(" / ");

    return { stationName, date: dateLabel, tides, summary };
  } catch {
    return null;
  }
}

/** 주요 관측소 코드 목록 (가이드 기준) */
export const KHOA_STATIONS: { code: string; name: string; area: string }[] = [
  // ── 수도권 ─────────────────────────────────────────────
  { code: "DT_0001", name: "인천",       area: "수도권" },
  { code: "DT_0002", name: "평택",       area: "수도권" },
  { code: "DT_0043", name: "영흥도",     area: "수도권" },
  { code: "DT_0044", name: "영종대교",   area: "수도권" },
  { code: "DT_0052", name: "인천송도",   area: "수도권" },
  { code: "DT_0058", name: "경인항",     area: "수도권" },
  { code: "DT_0060", name: "연평도",     area: "수도권" },
  { code: "DT_0059", name: "백령도",     area: "수도권" },
  { code: "DT_0065", name: "덕적도",     area: "수도권" },
  { code: "DT_0032", name: "강화대교",   area: "수도권" },
  { code: "DT_0064", name: "교동대교",   area: "수도권" },
  { code: "SO_1257", name: "강화하리",   area: "수도권" },
  { code: "SO_1258", name: "잠진도",     area: "수도권" },
  { code: "SO_1259", name: "자월도",     area: "수도권" },
  { code: "SO_1268", name: "궁평항",     area: "수도권" },
  { code: "SO_1282", name: "선재도",     area: "수도권" },
  { code: "SO_0554", name: "영종왕산",   area: "수도권" },
  { code: "SO_0539", name: "강화외포",   area: "수도권" },
  // ── 서해 ───────────────────────────────────────────────
  { code: "DT_0008", name: "안산",       area: "서해" },
  { code: "DT_0017", name: "대산",       area: "서해" },
  { code: "DT_0050", name: "태안",       area: "서해" },
  { code: "DT_0067", name: "안흥",       area: "서해" },
  { code: "DT_0025", name: "보령",       area: "서해" },
  { code: "DT_0051", name: "서천마량",   area: "서해" },
  { code: "DT_0018", name: "군산",       area: "서해" },
  { code: "DT_0024", name: "장항",       area: "서해" },
  { code: "DT_0068", name: "위도",       area: "서해" },
  { code: "DT_0003", name: "영광",       area: "서해" },
  { code: "DT_0007", name: "목포",       area: "서해" },
  { code: "DT_0028", name: "진도",       area: "서해" },
  { code: "DT_0035", name: "흑산도",     area: "서해" },
  { code: "DT_0036", name: "대청도",     area: "서해" },
  { code: "DT_0037", name: "어청도",     area: "서해" },
  { code: "SO_1252", name: "외연도항",   area: "서해" },
  { code: "SO_1253", name: "상왕등도",   area: "서해" },
  { code: "SO_1260", name: "방포항",     area: "서해" },
  { code: "SO_1261", name: "무창포항",   area: "서해" },
  { code: "SO_1262", name: "격포항",     area: "서해" },
  { code: "SO_1263", name: "구시포항",   area: "서해" },
  { code: "SO_1264", name: "계마항",     area: "서해" },
  { code: "SO_1270", name: "삼길포항",   area: "서해" },
  { code: "SO_0699", name: "천리포항",   area: "서해" },
  { code: "SO_0537", name: "벽파진",     area: "서해" },
  { code: "SO_0703", name: "땅끝항",     area: "서해" },
  { code: "SO_0704", name: "소안항",     area: "서해" },
  { code: "SO_0706", name: "청산도",     area: "서해" },
  { code: "SO_1248", name: "신안옥도",   area: "서해" },
  { code: "SO_0578", name: "소매물도",   area: "서해" },
  // ── 남해 ───────────────────────────────────────────────
  { code: "DT_0049", name: "광양",       area: "남해" },
  { code: "DT_0016", name: "여수",       area: "남해" },
  { code: "DT_0026", name: "고흥발포",   area: "남해" },
  { code: "DT_0027", name: "완도",       area: "남해" },
  { code: "DT_0014", name: "통영",       area: "남해" },
  { code: "DT_0061", name: "삼천포",     area: "남해" },
  { code: "DT_0062", name: "마산",       area: "남해" },
  { code: "DT_0054", name: "진해",       area: "남해" },
  { code: "DT_0005", name: "부산",       area: "남해" },
  { code: "DT_0029", name: "거제도",     area: "남해" },
  { code: "DT_0056", name: "부산항신항", area: "남해" },
  { code: "DT_0063", name: "가덕도",     area: "남해" },
  { code: "SO_0549", name: "초도",       area: "남해" },
  { code: "SO_0550", name: "나로도",     area: "남해" },
  { code: "SO_0551", name: "여서도",     area: "남해" },
  { code: "SO_0552", name: "고현항",     area: "남해" },
  { code: "SO_0555", name: "서망항",     area: "남해" },
  { code: "SO_0566", name: "송궁항",     area: "남해" },
  { code: "SO_0567", name: "쉬미항",     area: "남해" },
  { code: "SO_0569", name: "남포항",     area: "남해" },
  { code: "SO_0571", name: "거제외포",   area: "남해" },
  { code: "SO_0573", name: "양포항",     area: "남해" },
  { code: "SO_1266", name: "남열항",     area: "남해" },
  { code: "SO_1267", name: "구룡포항",   area: "남해" },
  { code: "SO_1269", name: "연도항",     area: "남해" },
  { code: "SO_1271", name: "어은돌항",   area: "남해" },
  { code: "SO_1272", name: "다대포항",   area: "남해" },
  { code: "SO_1277", name: "화순항",     area: "남해" },
  { code: "SO_1279", name: "어란진항",   area: "남해" },
  { code: "SO_0707", name: "시산항",     area: "남해" },
  { code: "SO_0708", name: "안도항",     area: "남해" },
  { code: "SO_0710", name: "봉우항",     area: "남해" },
  { code: "SO_0711", name: "창선도",     area: "남해" },
  { code: "SO_0712", name: "능양항",     area: "남해" },
  { code: "SO_0760", name: "오산항",     area: "남해" },
  { code: "SO_0761", name: "녹동항",     area: "남해" },
  // ── 동해 ───────────────────────────────────────────────
  { code: "DT_0012", name: "속초",       area: "동해" },
  { code: "DT_0048", name: "속초등표",   area: "동해" },
  { code: "DT_0006", name: "묵호",       area: "동해" },
  { code: "DT_0057", name: "동해항",     area: "동해" },
  { code: "DT_0091", name: "포항",       area: "동해" },
  { code: "DT_0011", name: "후포",       area: "동해" },
  { code: "DT_0020", name: "울산",       area: "동해" },
  { code: "DT_0013", name: "울릉도",     area: "동해" },
  { code: "DT_0040", name: "독도",       area: "동해" },
  { code: "SO_0731", name: "대진항",     area: "동해" },
  { code: "SO_0732", name: "남애항",     area: "동해" },
  { code: "SO_0733", name: "강릉항",     area: "동해" },
  { code: "SO_0735", name: "죽변항",     area: "동해" },
  { code: "SO_0736", name: "축산항",     area: "동해" },
  { code: "SO_0737", name: "강구항",     area: "동해" },
  { code: "SO_1273", name: "장호항",     area: "동해" },
  { code: "SO_1274", name: "거진항",     area: "동해" },
  { code: "SO_1275", name: "공현진항",   area: "동해" },
  { code: "SO_1276", name: "아야진항",   area: "동해" },
  { code: "SO_1280", name: "덕산항",     area: "동해" },
  { code: "SO_1281", name: "임원항",     area: "동해" },
  { code: "SO_1283", name: "사천진항",   area: "동해" },
  { code: "SO_1284", name: "월포리",     area: "동해" },
  { code: "SO_1285", name: "구계항",     area: "동해" },
  { code: "SO_1286", name: "영덕대진항", area: "동해" },
  { code: "SO_1287", name: "구산항",     area: "동해" },
  { code: "SO_1288", name: "기사문항",   area: "동해" },
  { code: "SO_1289", name: "삼척항",     area: "동해" },
  // ── 제주 ───────────────────────────────────────────────
  { code: "DT_0004", name: "제주",       area: "제주" },
  { code: "DT_0010", name: "서귀포",     area: "제주" },
  { code: "DT_0022", name: "성산포",     area: "제주" },
  { code: "DT_0023", name: "모슬포",     area: "제주" },
  { code: "DT_0021", name: "추자도",     area: "제주" },
];
