export interface Surat {
  code: number;
  message: string;
  data: SuratData;
}

export interface SuratData {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: AudioFull;
  ayat: Ayat[];
  suratSelanjutnya: SuratSelanjutnya;
  suratSebelumnya: boolean;
}

export interface AudioFull {
  "01": string;
  "02": string;
  "03": string;
  "04": string;
  "05": string;
}

export interface Ayat {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: Audio;
}

export interface Audio {
  "01": string;
  "02": string;
  "03": string;
  "04": string;
  "05": string;
}

export interface SuratSelanjutnya {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
}
