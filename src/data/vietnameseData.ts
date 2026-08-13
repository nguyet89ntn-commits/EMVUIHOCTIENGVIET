export interface LetterItem {
  id: string;
  upper: string;
  lower: string;
  name: string;
  spelling: string; // e.g. "bờ - a - ba"
  exampleWord: string;
  meaning: string;
  imageUrl: string;
  color: string;
}

export interface CompoundLetter {
  id: string;
  code: string;
  name: string;
  spelling: string;
  exampleWord: string;
  meaning: string;
  imageUrl: string;
  color: string;
}

export interface RhymeItem {
  id: string;
  rhyme: string;
  type: string; // "Vần đơn" | "Vần đôi" | "Vần có âm cuối"
  spelling: string;
  exampleWord: string;
  meaning: string;
  imageUrl: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  audioPrompt?: string;
  imageUrl?: string;
}

export interface LessonUnit {
  id: string;
  unitNumber: number;
  title: string;
  subtitle: string;
  letters: string[];
  vocabulary: { word: string; spelling: string; image: string; meaning: string }[];
  readingPassage: string;
  practiceQuestions: QuizQuestion[];
}

export const SINGLE_LETTERS: LetterItem[] = [
  { id: "l-a", upper: "a", lower: "a", name: "Chữ a", spelling: "a", exampleWord: "Ca", meaning: "Cái ca uống nước", imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80", color: "bg-red-500" },
  { id: "l-a-breve", upper: "ă", lower: "ă", name: "Chữ ă", spelling: "á", exampleWord: "Măng", meaning: "Măng tre non", imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80", color: "bg-orange-500" },
  { id: "l-a-circumflex", upper: "â", lower: "â", name: "Chữ â", spelling: "ớ", exampleWord: "Ấm", meaning: "Ấm trà nhỏ", imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&q=80", color: "bg-amber-500" },
  { id: "l-b", upper: "b", lower: "b", name: "Chữ b", spelling: "bờ", exampleWord: "Bò", meaning: "Con bò vàng", imageUrl: "https://images.unsplash.com/photo-1546445317-29f4545f9d52?w=400&q=80", color: "bg-yellow-500" },
  { id: "l-c", upper: "c", lower: "c", name: "Chữ c", spelling: "cờ", exampleWord: "Cò", meaning: "Con cò trắng", imageUrl: "https://images.unsplash.com/photo-1555169062-013468b47731?w=400&q=80", color: "bg-lime-500" },
  { id: "l-d", upper: "d", lower: "d", name: "Chữ d", spelling: "dờ", exampleWord: "Dê", meaning: "Con dê núi", imageUrl: "https://images.unsplash.com/photo-1524024973431-2ad916746881?w=400&q=80", color: "bg-green-500" },
  { id: "l-d-stroke", upper: "đ", lower: "đ", name: "Chữ đ", spelling: "đờ", exampleWord: "Đu đủ", meaning: "Quả đu đủ chín", imageUrl: "https://images.unsplash.com/photo-1617112848923-cc2234396a8d?w=400&q=80", color: "bg-emerald-500" },
  { id: "l-e", upper: "e", lower: "e", name: "Chữ e", spelling: "e", exampleWord: "Em", meaning: "Em bé vui tươi", imageUrl: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=400&q=80", color: "bg-teal-500" },
  { id: "l-e-circumflex", upper: "ê", lower: "ê", name: "Chữ ê", spelling: "ê", exampleWord: "Ếch", meaning: "Con ếch xanh", imageUrl: "https://images.unsplash.com/photo-1533619043865-1c2e2f32ff2f?w=400&q=80", color: "bg-cyan-500" },
  { id: "l-g", upper: "g", lower: "g", name: "Chữ g", spelling: "gờ", exampleWord: "Gà", meaning: "Con gà trống", imageUrl: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&q=80", color: "bg-sky-500" },
  { id: "l-h", upper: "h", lower: "h", name: "Chữ h", spelling: "hờ", exampleWord: "Hổ", meaning: "Con hổ vằn", imageUrl: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=400&q=80", color: "bg-blue-500" },
  { id: "l-i", upper: "i", lower: "i", name: "Chữ i", spelling: "i", exampleWord: "Bi", meaning: "Viên bi tròn", imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80", color: "bg-indigo-500" },
  { id: "l-k", upper: "k", lower: "k", name: "Chữ k", spelling: "ca", exampleWord: "Kẹo", meaning: "Viên kẹo ngọt", imageUrl: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&q=80", color: "bg-violet-500" },
  { id: "l-l", upper: "l", lower: "l", name: "Chữ l", spelling: "lờ", exampleWord: "Lá", meaning: "Lá cây xanh", imageUrl: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&q=80", color: "bg-purple-500" },
  { id: "l-m", upper: "m", lower: "m", name: "Chữ m", spelling: "mờ", exampleWord: "Mèo", meaning: "Con mèo con", imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80", color: "bg-fuchsia-500" },
  { id: "l-n", upper: "n", lower: "n", name: "Chữ n", spelling: "nờ", exampleWord: "Nơ", meaning: "Cái nơ hồng", imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=80", color: "bg-pink-500" },
  { id: "l-o", upper: "o", lower: "o", name: "Chữ o", spelling: "o", exampleWord: "Ong", meaning: "Con ong chăm chỉ", imageUrl: "https://images.unsplash.com/photo-1587049352847-81a56d773cae?w=400&q=80", color: "bg-rose-500" },
  { id: "l-o-circumflex", upper: "ô", lower: "ô", name: "Chữ ô", spelling: "ô", exampleWord: "Ô", meaning: "Cái ô che mưa", imageUrl: "https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?w=400&q=80", color: "bg-red-600" },
  { id: "l-o-horn", upper: "ơ", lower: "ơ", name: "Chữ ơ", spelling: "ơ", exampleWord: "Cờ", meaning: "Lá cờ đỏ sao vàng", imageUrl: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=400&q=80", color: "bg-amber-600" },
  { id: "l-p", upper: "p", lower: "p", name: "Chữ p", spelling: "pờ", exampleWord: "Pin", meaning: "Cục pin nhỏ", imageUrl: "https://images.unsplash.com/photo-1619725002198-6a689b72f41d?w=400&q=80", color: "bg-yellow-600" },
  { id: "l-q", upper: "q", lower: "q", name: "Chữ q", spelling: "quy", exampleWord: "Quạ", meaning: "Con quạ đen", imageUrl: "https://images.unsplash.com/photo-1563281577-a7be47e20db9?w=400&q=80", color: "bg-green-600" },
  { id: "l-r", upper: "r", lower: "r", name: "Chữ r", spelling: "rờ", exampleWord: "Rùa", meaning: "Con rùa nhỏ", imageUrl: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=400&q=80", color: "bg-teal-600" },
  { id: "l-s", upper: "s", lower: "s", name: "Chữ s", spelling: "sờ", exampleWord: "Sóc", meaning: "Con sóc truyền cành", imageUrl: "https://images.unsplash.com/photo-1504006833117-8886a355efbf?w=400&q=80", color: "bg-blue-600" },
  { id: "l-t", upper: "t", lower: "t", name: "Chữ t", spelling: "tờ", exampleWord: "Thỏ", meaning: "Con thỏ trắng", imageUrl: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&q=80", color: "bg-indigo-600" },
  { id: "l-u", upper: "u", lower: "u", name: "Chữ u", spelling: "u", exampleWord: "Mũ", meaning: "Cái mũ đồi", imageUrl: "https://images.unsplash.com/photo-1521369984125-650286b89028?w=400&q=80", color: "bg-violet-600" },
  { id: "l-u-horn", upper: "ư", lower: "ư", name: "Chữ ư", spelling: "ư", exampleWord: "Sư tử", meaning: "Con sư tử dũng mãnh", imageUrl: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400&q=80", color: "bg-purple-600" },
  { id: "l-v", upper: "v", lower: "v", name: "Chữ v", spelling: "vờ", exampleWord: "Voi", meaning: "Con voi to lớn", imageUrl: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=400&q=80", color: "bg-pink-600" },
  { id: "l-x", upper: "x", lower: "x", name: "Chữ x", spelling: "xờ", exampleWord: "Xe", meaning: "Chiếc xe đạp nhỏ", imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&q=80", color: "bg-cyan-600" },
  { id: "l-y", upper: "y", lower: "y", name: "Chữ y", spelling: "y-dài", exampleWord: "Y tế", meaning: "Hộp y tế", imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80", color: "bg-rose-600" }
];

export const COMPOUND_LETTERS: CompoundLetter[] = [
  { id: "c-ch", code: "ch", name: "Chữ ghép ch", spelling: "chờ", exampleWord: "Chó", meaning: "Con chó con dễ thương", imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&q=80", color: "bg-red-500" },
  { id: "c-gh", code: "gh", name: "Chữ ghép gh", spelling: "gờ ghép", exampleWord: "Ghế", meaning: "Cái ghế ngồi học", imageUrl: "https://images.unsplash.com/photo-1503602642458-232111445657?w=400&q=80", color: "bg-orange-500" },
  { id: "c-gi", code: "gi", name: "Chữ ghép gi", spelling: "giờ", exampleWord: "Gió", meaning: "Làn gió mát lành", imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80", color: "bg-amber-500" },
  { id: "c-kh", code: "kh", name: "Chữ ghép kh", spelling: "khờ", exampleWord: "Khỉ", meaning: "Con khỉ nhanh nhẹn", imageUrl: "https://images.unsplash.com/photo-1540573133985-780688d1e243?w=400&q=80", color: "bg-yellow-500" },
  { id: "c-nh", code: "nh", name: "Chữ ghép nh", spelling: "nhờ", exampleWord: "Nhà", meaning: "Ngôi nhà ấm áp", imageUrl: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&q=80", color: "bg-green-500" },
  { id: "c-ng", code: "ng", name: "Chữ ghép ng", spelling: "ngờ đơn", exampleWord: "Ngựa", meaning: "Con ngựa phi nhanh", imageUrl: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400&q=80", color: "bg-teal-500" },
  { id: "c-ngh", code: "ngh", name: "Chữ ghép ngh", spelling: "ngờ kép", exampleWord: "Nghé", meaning: "Con nghé con tung tăng", imageUrl: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&q=80", color: "bg-cyan-500" },
  { id: "c-ph", code: "ph", name: "Chữ ghép ph", spelling: "phờ", exampleWord: "Phở", meaning: "Bát phở bò thơm ngon", imageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&q=80", color: "bg-sky-500" },
  { id: "c-qu", code: "qu", name: "Chữ ghép qu", spelling: "quờ", exampleWord: "Quả", meaning: "Quả táo đỏ rực", imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80", color: "bg-blue-500" },
  { id: "c-th", code: "th", name: "Chữ ghép th", spelling: "thờ", exampleWord: "Thuyền", meaning: "Con thuyền ra khơi", imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&q=80", color: "bg-indigo-500" },
  { id: "c-tr", code: "tr", name: "Chữ ghép tr", spelling: "trờ", exampleWord: "Tre", meaning: "Cây tre xanh mát", imageUrl: "https://images.unsplash.com/photo-1516214104703-d870798883c5?w=400&q=80", color: "bg-purple-500" }
];

export interface RhymeItem {
  id: string;
  rhyme: string;
  type: string; // Category name
  term?: "hk1" | "hk2"; // "Học kì 1" | "Học kì 2"
  spelling: string;
  exampleWord: string;
  meaning: string;
  imageUrl: string;
}

// Bảng mẫu Kết Nối Tri Thức Với Cuộc Sống - Các hàng Âm
export const KET_NOI_TRI_THUC_AM = [
  ["a", "b", "̀", "c", "́", "e", "ê", "o", "̉", "ô", "̃", "d", "đ", "̣", "i", "k", "h", "l", "u", "ư", "ch"],
  ["kh", "m", "n", "g", "gi", "gh", "nh", "ng", "ngh", "r", "s", "t", "tr", "th", "ia", "ua", "ưa", "ph", "qu", "v", "x", "y"]
];

// Bảng mẫu Kết Nối Tri Thức Với Cuộc Sống - Vần Học kì 1 (10 hàng)
export const KET_NOI_TRI_THUC_HK1 = [
  ["an", "ăn", "ân", "on", "ôn", "ơn", "en", "ên", "in", "un", "am", "ăm", "âm"],
  ["om", "ôm", "ơm", "em", "êm", "im", "um", "ai", "ay", "ây", "oi", "ôi", "ơi"],
  ["ui", "ưi", "ao", "eo", "au", "âu", "êu", "iu", "ưu"],
  ["ac", "ăc", "âc", "oc", "ôc", "uc", "ưc", "at", "ăt", "ât", "ot", "ôt", "ơt"],
  ["et", "êt", "it", "ut", "ưt", "ap", "ăp", "âp", "op", "ôp", "ơp"],
  ["ep", "êp", "ip", "up", "anh", "ênh", "inh", "ach", "êch", "ich", "ang", "ăng", "âng"],
  ["ong", "ông", "ung", "ưng", "iêc", "iên", "iêp", "yêng", "iêm", "yên", "iêt", "yêu", "iêu"],
  ["uôi", "uôm", "uôc", "uôt", "uôn", "uông", "ươi", "ươu"],
  ["ươc", "ươt", "ươm", "ươp", "ươn", "ương", "oa", "oe"],
  ["oan", "oăn", "oat", "oăt", "oai", "uê", "uy", "uân", "uât", "uyên", "uyêt"]
];

// Bảng mẫu Kết Nối Tri Thức Với Cuộc Sống - Vần Học kì 2 (3 hàng)
export const KET_NOI_TRI_THUC_HK2 = [
  ["uây", "oang", "uyt", "oăng", "oac", "oach", "oam", "oăm", "uơ", "uya"],
  ["uôn", "yêt", "yêng", "uyp", "uynh", "uych", "uyu", "oong", "oay", "eng"],
  ["iêng", "yêm", "oanh", "oăng", "oen", "oao", "oet"]
];

// Mẫu thông tin ví dụ chi tiết cho tất cả các âm vần
const RHYME_DETAILS_MAP: Record<string, { exampleWord: string; meaning: string; spelling?: string; img?: string }> = {
  "an": { exampleWord: "Bàn", meaning: "Cái bàn học tập ngăn nắp", img: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&q=80" },
  "ăn": { exampleWord: "Khăn", meaning: "Cái khăn quàng cổ ấm áp", img: "https://images.unsplash.com/photo-1606760227091-3dd858d97f1d?w=400&q=80" },
  "ân": { exampleWord: "Sân", meaning: "Sân trường rộng rãi", img: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&q=80" },
  "on": { exampleWord: "Con", meaning: "Mẹ và con yêu thương", img: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=400&q=80" },
  "ôn": { exampleWord: "Tôn", meaning: "Mái tôn che nắng mưa", img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=80" },
  "ơn": { exampleWord: "Cơn", meaning: "Cơn mưa rào mùa hạ", img: "https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=400&q=80" },
  "en": { exampleWord: "Đèn", meaning: "Cây đèn bàn sáng tỏ", img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80" },
  "ên": { exampleWord: "Nến", meaning: "Ngọn nến lung linh", img: "https://images.unsplash.com/photo-1509024644553-a8862e320509?w=400&q=80" },
  "in": { exampleWord: "Pin", meaning: "Viên pin nhỏ nhắn", img: "https://images.unsplash.com/photo-1619725002198-6a689b72f41d?w=400&q=80" },
  "un": { exampleWord: "Giun", meaning: "Chú giun đất tơi xốp", img: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&q=80" },
  "am": { exampleWord: "Cam", meaning: "Quả cam mọng nước", img: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400&q=80" },
  "ăm": { exampleWord: "Tăm", meaning: "Cây tăm tre nhỏ", img: "https://images.unsplash.com/photo-1516214104703-d870798883c5?w=400&q=80" },
  "âm": { exampleWord: "Nấm", meaning: "Cây nấm xinh xắn", img: "https://images.unsplash.com/photo-1504006833117-8886a355efbf?w=400&q=80" },
  "om": { exampleWord: "Chòm", meaning: "Chòm sao đêm sáng ngời", img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80" },
  "ôm": { exampleWord: "Tôm", meaning: "Con tôm bơi dưới nước", img: "https://images.unsplash.com/photo-1555169062-013468b47731?w=400&q=80" },
  "ơm": { exampleWord: "Rơm", meaning: "Cây rơm vàng óng", img: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&q=80" },
  "em": { exampleWord: "Kem", meaning: "Cây kem mát lạnh", img: "https://images.unsplash.com/photo-1560008511-11c63416e52d?w=400&q=80" },
  "êm": { exampleWord: "Đệm", meaning: "Chiếc đệm êm ái", img: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&q=80" },
  "im": { exampleWord: "Chim", meaning: "Con chim chuyền cành", img: "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&q=80" },
  "um": { exampleWord: "Cụm", meaning: "Cụm hoa tươi thắm", img: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&q=80" },
  "ai": { exampleWord: "Lái", meaning: "Lái xe an toàn", img: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&q=80" },
  "ay": { exampleWord: "Bay", meaning: "Chim bay trên trời", img: "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&q=80" },
  "ây": { exampleWord: "Cây", meaning: "Cây xanh bóng mát", img: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&q=80" },
  "oi": { exampleWord: "Voi", meaning: "Chú voi con to lớn", img: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=400&q=80" },
  "ôi": { exampleWord: "Chổi", meaning: "Cái chổi quét nhà", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80" },
  "ơi": { exampleWord: "Bơi", meaning: "Bé tập bơi lội", img: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&q=80" },
  "ui": { exampleWord: "Túi", meaning: "Cái túi xách xinh", img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80" },
  "ưi": { exampleWord: "Ngửi", meaning: "Bé ngửi hương hoa", img: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&q=80" },
  "ao": { exampleWord: "Táo", meaning: "Quả táo đỏ ngon", img: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80" },
  "eo": { exampleWord: "Mèo", meaning: "Con mèo ngoan", img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80" },
  "au": { exampleWord: "Rau", meaning: "Rau xanh tươi ngon", img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80" },
  "âu": { exampleWord: "Trâu", meaning: "Con trâu hiền lành", img: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&q=80" },
  "êu": { exampleWord: "Kêu", meaning: "Chim hót vang kêu", img: "https://images.unsplash.com/photo-1555169062-013468b47731?w=400&q=80" },
  "iu": { exampleWord: "Rìu", meaning: "Cái rìu đốn củi", img: "https://images.unsplash.com/photo-1516214104703-d870798883c5?w=400&q=80" },
  "ưu": { exampleWord: "Hươu", meaning: "Con hươu cao cổ", img: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400&q=80" },
  "ac": { exampleWord: "Hạc", meaning: "Chim hạc trắng", img: "https://images.unsplash.com/photo-1555169062-013468b47731?w=400&q=80" },
  "ăc": { exampleWord: "Tắc", meaning: "Xe tắc đường", img: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&q=80" },
  "âc": { exampleWord: "Gấc", meaning: "Quả gấc đỏ tươi", img: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400&q=80" },
  "oc": { exampleWord: "Cốc", meaning: "Cái cốc uống nước", img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80" },
  "ôc": { exampleWord: "Ốc", meaning: "Con ốc nhỏ bò", img: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=400&q=80" },
  "uc": { exampleWord: "Trúc", meaning: "Cây trúc xanh tươi", img: "https://images.unsplash.com/photo-1516214104703-d870798883c5?w=400&q=80" },
  "ưc": { exampleWord: "Mực", meaning: "Con mực biển tươi", img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80" },
  "at": { exampleWord: "Hát", meaning: "Bé ca hát vui vẻ", img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80" },
  "ăt": { exampleWord: "Mắt", meaning: "Đôi mắt sáng xoe", img: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=400&q=80" },
  "ât": { exampleWord: "Đất", meaning: "Mặt đất màu mỡ", img: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&q=80" },
  "ot": { exampleWord: "Hót", meaning: "Chim hót líu lo", img: "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&q=80" },
  "ôt": { exampleWord: "Cột", meaning: "Cột cờ cao vút", img: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=400&q=80" },
  "ơt": { exampleWord: "Vợt", meaning: "Cây vợt bóng bàn", img: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&q=80" },
  "et": { exampleWord: "Nét", meaning: "Nét chữ nết người", img: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=80" },
  "êt": { exampleWord: "Tết", meaning: "Ngày Tết cổ truyền", img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=80" },
  "it": { exampleWord: "Vịt", meaning: "Con vịt xèo cánh", img: "https://images.unsplash.com/photo-1555169062-013468b47731?w=400&q=80" },
  "ut": { exampleWord: "Bút", meaning: "Cây bút chì ngòi", img: "https://images.unsplash.com/photo-1585336261026-870a6d21633b?w=400&q=80" },
  "ưt": { exampleWord: "Mứt", meaning: "Mứt tết thơm ngon", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80" },
  "ap": { exampleWord: "Tháp", meaning: "Tháp rùa cổ kính", img: "https://images.unsplash.com/photo-1509024644553-a8862e320509?w=400&q=80" },
  "ăp": { exampleWord: "Cặp", meaning: "Cặp sách đến trường", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80" },
  "âp": { exampleWord: "Tập", meaning: "Quyển tập viết chữ", img: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=80" },
  "op": { exampleWord: "Hộp", meaning: "Hộp bút chì màu", img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=80" },
  "ôp": { exampleWord: "Hộp", meaning: "Hộp quà sinh nhật", img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=80" },
  "ơp": { exampleWord: "Lớp", meaning: "Lớp học mến yêu", img: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&q=80" },
  "ep": { exampleWord: "Dép", meaning: "Đôi dép xinh xắn", img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80" },
  "êp": { exampleWord: "Bếp", meaning: "Căn bếp gia đình", img: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&q=80" },
  "ip": { exampleWord: "Nhịp", meaning: "Nhịp cầu xóm nhỏ", img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&q=80" },
  "up": { exampleWord: "Búp", meaning: "Búp hoa sen nở", img: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&q=80" },
  "anh": { exampleWord: "Bánh", meaning: "Bánh chưng ngày Tết", img: "https://images.unsplash.com/photo-1509024644553-a8862e320509?w=400&q=80" },
  "ênh": { exampleWord: "Lệnh", meaning: "Lệnh chỉ huy chuẩn", img: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&q=80" },
  "inh": { exampleWord: "Xinh", meaning: "Em bé rất xinh", img: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=400&q=80" },
  "ach": { exampleWord: "Sách", meaning: "Quyển sách tri thức", img: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=80" },
  "êch": { exampleWord: "Ếch", meaning: "Con ếch xanh nhảy", img: "https://images.unsplash.com/photo-1533619043865-1c2e2f32ff2f?w=400&q=80" },
  "ich": { exampleWord: "Lịch", meaning: "Tờ lịch xuân mới", img: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&q=80" },
  "ang": { exampleWord: "Làng", meaning: "Làng quê yên bình", img: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&q=80" },
  "ăng": { exampleWord: "Măng", meaning: "Măng tre non ngọt", img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80" },
  "âng": { exampleWord: "Vầng", meaning: "Vầng trăng đêm rằm", img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80" },
  "ong": { exampleWord: "Ong", meaning: "Con ong chăm chỉ", img: "https://images.unsplash.com/photo-1587049352847-81a56d773cae?w=400&q=80" },
  "ông": { exampleWord: "Cổng", meaning: "Cổng trường rộng mở", img: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&q=80" },
  "ung": { exampleWord: "Sung", meaning: "Chùm quả sung ngọt", img: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80" },
  "ưng": { exampleWord: "Rừng", meaning: "Cánh rừng xanh ngát", img: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&q=80" },
  "ia": { exampleWord: "Thìa", meaning: "Cái thìa ăn cơm", img: "https://images.unsplash.com/photo-1615865417236-d67f16a69396?w=400&q=80" },
  "ua": { exampleWord: "Mua", meaning: "Mua sắm hoa quả", img: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80" },
  "ưa": { exampleWord: "Mưa", meaning: "Cơn mưa rào mát", img: "https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=400&q=80" },
  "oa": { exampleWord: "Hoa", meaning: "Bông hoa tươi thắm", img: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&q=80" },
  "oe": { exampleWord: "Chòe", meaning: "Chim chòe hót vui", img: "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&q=80" }
};

// Build helper for Rhymes list from matrix
function buildRhymeListFromMatrix(): RhymeItem[] {
  const rhymes: RhymeItem[] = [];

  const processRows = (rows: string[][], term: "hk1" | "hk2") => {
    rows.forEach((row, rIdx) => {
      row.forEach((v, cIdx) => {
        const id = `r-${term}-${rIdx}-${cIdx}-${v}`;
        const meta = RHYME_DETAILS_MAP[v] || {
          exampleWord: v.toUpperCase(),
          meaning: `Âm vần ${v} trong bộ Kết Nối Tri Thức`,
          img: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=80"
        };
        const spell = meta.spelling || v.split("").join(" - ") + " - " + v;

        rhymes.push({
          id,
          rhyme: v,
          type: term === "hk1" ? "Vần Học kì 1" : "Vần Học kì 2",
          term,
          spelling: spell,
          exampleWord: meta.exampleWord,
          meaning: meta.meaning,
          imageUrl: meta.img
        });
      });
    });
  };

  processRows(KET_NOI_TRI_THUC_HK1, "hk1");
  processRows(KET_NOI_TRI_THUC_HK2, "hk2");

  return rhymes;
}

export const RHYMES_LIST: RhymeItem[] = buildRhymeListFromMatrix();


export const TONE_MARKS = [
  { name: "Không dấu", symbol: "ba", example: "ba (ba cha)", description: "Giọng đọc bình thường" },
  { name: "Dấu sắc", symbol: "bá", example: "bá (cá, lá, bé)", description: "Giọng đọc vút lên" },
  { name: "Dấu huyền", symbol: "bà", example: "bà (bà ngoại, cò, nhà)", description: "Giọng đọc trầm xuống" },
  { name: "Dấu hỏi", symbol: "bả", example: "bả (hổ, quả, thỏ)", description: "Giọng đọc gập sóng" },
  { name: "Dấu ngã", symbol: "bã", example: "bã (mỗ, gỗ, vẽ)", description: "Giọng đọc ngắt âm" },
  { name: "Dấu nặng", symbol: "bạ", example: "bạ (gạ, nạ, ngựa)", description: "Giọng đọc đè sâu xuống" },
];

// Helper to generate 20 robust questions for any unit
function generate20Questions(unitNum: number, title: string, letters: string[]): QuizQuestion[] {
  const l1 = letters[0] || "a";
  const l2 = letters[1] || "b";
  const upperL1 = l1.toUpperCase();
  const upperL2 = l2.toUpperCase();

  const questions: QuizQuestion[] = [
    {
      id: 1,
      question: `Chữ cái nào xuất hiện trong tiêu đề "${title}"?`,
      options: [upperL1, "X", "Z", "W"],
      correctIndex: 0,
      explanation: `Chữ ${upperL1} là chữ cái trọng tâm của bài học!`
    },
    {
      id: 2,
      question: `Cách phát âm đúng của chữ '${l1}' là gì?`,
      options: [`Âm ${l1}`, `Âm z`, `Âm w`, `Âm x`],
      correctIndex: 0,
      explanation: `Phát âm chuẩn là âm '${l1}'.`
    },
    {
      id: 3,
      question: `Từ nào sau đây chứa chữ '${l1}'?`,
      options: [`Bé ${l1}`, "Bút", "Cặp", "Bàn"],
      correctIndex: 0,
      explanation: `Từ chứa chữ '${l1}' rất quen thuộc.`
    },
    {
      id: 4,
      question: `Khi ghép '${l1}' với dấu huyền (\`), ta được tiếng nào?`,
      options: [`${l1}̀`, `${l1}́`, `${l1}̉`, `${l1}̃`],
      correctIndex: 0,
      explanation: "Dấu huyền làm giọng đọc trầm xuống."
    },
    {
      id: 5,
      question: `Khi ghép '${l1}' với dấu sắc (´), ta được tiếng nào?`,
      options: [`${l1}́`, `${l1}̀`, `${l1}̉`, `${l1}̣`],
      correctIndex: 0,
      explanation: "Dấu sắc làm giọng đọc nâng cao vút lên."
    },
    {
      id: 6,
      question: `Chữ in hoa của chữ '${l2}' được viết như thế nào?`,
      options: [upperL2, "h", "g", "k"],
      correctIndex: 0,
      explanation: `Dạng in hoa của ${l2} là ${upperL2}.`
    },
    {
      id: 7,
      question: `Tìm từ có nghĩa đúng minh họa cho âm '${l2}'?`,
      options: [`Con ${l2}o`, "Cây tre", "Ngôi nhà", "Cái ô"],
      correctIndex: 0,
      explanation: `Đúng rồi, đó là hình ảnh bắt đầu bằng âm ${l2}.`
    },
    {
      id: 8,
      question: "Có mấy dấu thanh cơ bản trong tiếng Việt?",
      options: ["5 dấu thanh", "2 dấu thanh", "8 dấu thanh", "10 dấu thanh"],
      correctIndex: 0,
      explanation: "Tiếng Việt có 5 dấu thanh: sắc, huyền, hỏi, ngã, nặng (cùng thanh ngang)."
    },
    {
      id: 9,
      question: "Dấu nào sau đây là Dấu Hỏi?",
      options: ["ˀ (dấu hỏi)", "´ (dấu sắc)", "` (dấu huyền)", ". (dấu nặng)"],
      correctIndex: 0,
      explanation: "Dấu hỏi có hình dáng giống như một móc câu nhỏ nhắn."
    },
    {
      id: 10,
      question: "Dấu nào sau đây là Dấu Sắc?",
      options: ["´ (dấu sắc)", "` (dấu huyền)", "~ (dấu ngã)", ". (dấu nặng)"],
      correctIndex: 0,
      explanation: "Dấu sắc nằm chếch từ trái sang phải nâng lên."
    },
    {
      id: 11,
      question: `Hãy đánh vần tiếng '${l2}${l1}' đúng chuẩn?`,
      options: [`${l2} - ${l1} - ${l2}${l1}`, `${l1} - ${l2}`, "không đánh vần được", "a - b - c"],
      correctIndex: 0,
      explanation: `Đánh vần: âm đầu '${l2}' ghép với âm cuối '${l1}' ra tiếng '${l2}${l1}'.`
    },
    {
      id: 12,
      question: `Thêm dấu huyền vào tiếng '${l2}${l1}' thành tiếng gì?`,
      options: [`${l2}${l1}̀`, `${l2}${l1}́`, `${l2}${l1}̉`, `${l2}${l1}̣`],
      correctIndex: 0,
      explanation: `Đánh vần: ${l2} - ${l1} - ${l2}${l1} - huyền - ${l2}${l1}̀.`
    },
    {
      id: 13,
      question: `Thêm dấu sắc vào tiếng '${l2}${l1}' thành tiếng gì?`,
      options: [`${l2}${l1}́`, `${l2}${l1}̀`, `${l2}${l1}̉`, `${l2}${l1}̣`],
      correctIndex: 0,
      explanation: `Đánh vần: ${l2} - ${l1} - ${l2}${l1} - sắc - ${l2}${l1}́.`
    },
    {
      id: 14,
      question: "Chữ cái nào đứng đầu bảng chữ cái Tiếng Việt?",
      options: ["Chữ A", "Chữ B", "Chữ C", "Chữ D"],
      correctIndex: 0,
      explanation: "Chữ A là chữ cái đầu tiên trong bảng chữ cái."
    },
    {
      id: 15,
      question: "Âm 'ch' thuộc nhóm bảng chữ cái nào?",
      options: ["Bảng chữ ghép", "Bảng âm vần", "Bảng số", "Dấu thanh"],
      correctIndex: 0,
      explanation: "Chữ 'ch' gồm 2 chữ cái 'c' và 'h' ghép lại nên gọi là chữ ghép."
    },
    {
      id: 16,
      question: "Trong câu: 'Bé có ca đỏ.', từ nào chứa âm 'a'?",
      options: ["ca", "Bé", "có", "đó"],
      correctIndex: 0,
      explanation: "Từ 'ca' có âm 'a' ở vị trí âm chính."
    },
    {
      id: 17,
      question: "Em hãy chọn hình ảnh phù hợp khi đọc tiếng 'Bò'?",
      options: ["Con bò vàng hiền lành", "Con mèo con", "Con thỏ trắng", "Cái ghế"],
      correctIndex: 0,
      explanation: "Tiếng 'Bò' biểu thị con bò vàng."
    },
    {
      id: 18,
      question: "Để giữ gìn sách vở lớp 1 đẹp đẽ, em nên làm gì?",
      options: ["Giữ gìn cẩn thận, không làm rách", "Vẽ bẩn lên sách", "Làm xé trang sách", "Vứt sách lung tung"],
      correctIndex: 0,
      explanation: "Giữ gìn sách vở sạch đẹp giúp em học giỏi mỗi ngày!"
    },
    {
      id: 19,
      question: "Từ nào mô tả thái độ vui vẻ khi tới trường học tập?",
      options: ["Chăm chỉ, hăng hái", "Lười biếng", "Quấy khóc", "Buồn rầu"],
      correctIndex: 0,
      explanation: "Học sinh lớp 1 luôn vui tươi, hăng hái hằng ngày!"
    },
    {
      id: 20,
      question: `Chúc mừng em hoàn thành bài 20 câu! Em cảm thấy thế nào khi học bài '${title}'?`,
      options: ["Rất vui và hiểu bài sâu sắc", "Cần luyện thêm", "Thấy thú vị", "Cả 3 phương án trên"],
      correctIndex: 3,
      explanation: "Em thật là xuất sắc! Hãy tiếp tục phát huy nhé!"
    }
  ];

  return questions;
}

export const LESSON_UNITS: LessonUnit[] = [
  {
    id: "bai-1",
    unitNumber: 1,
    title: "Bài 1: A a, B b",
    subtitle: "Kết nối tri thức - Chủ đề 1: Em đi học",
    letters: ["a", "b"],
    vocabulary: [
      { word: "ba", spelling: "bờ - a - ba", image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=400&q=80", meaning: "Ba (Bố) yêu thương em" },
      { word: "bà", spelling: "bờ - a - ba - huyền - bà", image: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&q=80", meaning: "Bà hiền từ kề bên" },
      { word: "bóng", spelling: "bờ - ong - bong - sắc - bóng", image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&q=80", meaning: "Quả bóng tròn xoe" },
      { word: "cá", spelling: "cờ - a - ca - sắc - cá", image: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=400&q=80", meaning: "Con cá bơi lội" }
    ],
    readingPassage: "Bà có bé. Ba có bóng đỏ. Bé có cá nhỏ.",
    practiceQuestions: generate20Questions(1, "A a, B b", ["a", "b"])
  },
  {
    id: "bai-2",
    unitNumber: 2,
    title: "Bài 2: C c, O o",
    subtitle: "Chủ đề 1: Âm C c và Âm O o",
    letters: ["c", "o"],
    vocabulary: [
      { word: "cò", spelling: "cờ - o - co - huyền - cò", image: "https://images.unsplash.com/photo-1555169062-013468b47731?w=400&q=80", meaning: "Con cò bay lả bay la" },
      { word: "cỏ", spelling: "cờ - o - co - hỏi - cỏ", image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&q=80", meaning: "Ngọn cỏ xanh mượt" },
      { word: "cô", spelling: "cờ - ô - cô", image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&q=80", meaning: "Cô giáo mến yêu" }
    ],
    readingPassage: "Co có cò. Bé có cỏ xanh. Cô cho bé ca đỏ.",
    practiceQuestions: generate20Questions(2, "C c, O o", ["c", "o"])
  },
  {
    id: "bai-3",
    unitNumber: 3,
    title: "Bài 3: D d, Đ đ",
    subtitle: "Chủ đề 2: Âm D d và Âm Đ đ",
    letters: ["d", "đ"],
    vocabulary: [
      { word: "dê", spelling: "dờ - ê - dê", image: "https://images.unsplash.com/photo-1524024973431-2ad916746881?w=400&q=80", meaning: "Con dê núi vui đùa" },
      { word: "đô", spelling: "đờ - ô - đô", image: "https://images.unsplash.com/photo-1617112848923-cc2234396a8d?w=400&q=80", meaning: "Quả đu đủ thơm ngọt" }
    ],
    readingPassage: "Bé có dê nhỏ. Dê ăn cỏ ở đê.",
    practiceQuestions: generate20Questions(3, "D d, Đ đ", ["d", "đ"])
  },
  {
    id: "bai-4",
    unitNumber: 4,
    title: "Bài 4: E e, Ê ê",
    subtitle: "Chủ đề 2: Nguyên âm E e và Ê ê",
    letters: ["e", "ê"],
    vocabulary: [
      { word: "em", spelling: "e - mờ - em", image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=400&q=80", meaning: "Em bé chăm ngoan" },
      { word: "ếch", spelling: "ê - chờ - ech - sắc - ếch", image: "https://images.unsplash.com/photo-1533619043865-1c2e2f32ff2f?w=400&q=80", meaning: "Con ếch xanh ngồi hát" }
    ],
    readingPassage: "Em vẽ ếch xanh. Bà bế em bé đi chơi.",
    practiceQuestions: generate20Questions(4, "E e, Ê ê", ["e", "ê"])
  },
  {
    id: "bai-5",
    unitNumber: 5,
    title: "Bài 5: Ch ch, Kh kh",
    subtitle: "Chủ đề 3: Chữ ghép Ch ch và Kh kh",
    letters: ["ch", "kh"],
    vocabulary: [
      { word: "chó", spelling: "chờ - o - cho - sắc - chó", image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&q=80", meaning: "Chú chó vàng tinh nghịch" },
      { word: "khỉ", spelling: "khờ - i - khi - hỏi - khỉ", image: "https://images.unsplash.com/photo-1540573133985-780688d1e243?w=400&q=80", meaning: "Chú khỉ chuyền cành cây" }
    ],
    readingPassage: "Chú khỉ trèo cây. Bé vuốt ve chú chó nhỏ.",
    practiceQuestions: generate20Questions(5, "Ch ch, Kh kh", ["ch", "kh"])
  },
  {
    id: "bai-6",
    unitNumber: 6,
    title: "Bài 6: Nh nh, Ng ng, Ngh ngh",
    subtitle: "Chủ đề 3: Các chữ ghép Nh, Ng, Ngh",
    letters: ["nh", "ng", "ngh"],
    vocabulary: [
      { word: "nhà", spelling: "nhờ - a - nha - huyền - nhà", image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&q=80", meaning: "Ngôi nhà xinh xắn" },
      { word: "ngựa", spelling: "ngờ - ưa - ngưa - nặng - ngựa", image: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400&q=80", meaning: "Chú ngựa phi nhanh" }
    ],
    readingPassage: "Nhà bé ở ven đồi. Chú nghé con gặm cỏ ngô.",
    practiceQuestions: generate20Questions(6, "Nh nh, Ng ng, Ngh ngh", ["nh", "ng"])
  },
  {
    id: "bai-7",
    unitNumber: 7,
    title: "Bài 7: Âm vần -an, -at",
    subtitle: "Chủ đề 4: Học vần có âm cuối -n, -t",
    letters: ["an", "at"],
    vocabulary: [
      { word: "bàn", spelling: "bờ - an - ban - huyền - bàn", image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&q=80", meaning: "Bàn học tập đẹp" },
      { word: "hát", spelling: "hờ - at - hat - sắc - hát", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80", meaning: "Bé hát hăng hái" }
    ],
    readingPassage: "Bé ngồi ngay ngắn bên bàn học. Bé hát bài ca lớp 1 vui tươi.",
    practiceQuestions: generate20Questions(7, "Âm vần -an, -at", ["an", "at"])
  }
];
