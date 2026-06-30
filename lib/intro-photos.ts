import type { Locale } from "./i18n";

export type IntroPhoto = {
  src: string;
  altEn: string;
  altVi: string;
  captionEn: string;
  captionVi: string;
};

export const introPhotos: IntroPhoto[] = [
  {
    src: "/introduction/court-01.png",
    altEn: "Aerial view of four tennis courts surrounded by trees",
    altVi: "Toàn cảnh từ trên cao bốn sân tennis bao quanh bởi cây xanh",
    captionEn: "Aerial view of our four courts nestled in a green oasis.",
    captionVi: "Toàn cảnh bốn sân tennis giữa không gian xanh mát.",
  },
  {
    src: "/introduction/court-02.png",
    altEn: "Bird's-eye view of the tennis facility",
    altVi: "Nhìn từ trên cao cơ sở sân tennis",
    captionEn: "Overview of the full facility with shaded benches.",
    captionVi: "Toàn cảnh cơ sở sân với ghế nghỉ có mái che.",
  },
  {
    src: "/introduction/court-03.png",
    altEn: "Wide view of courts with residential buildings behind",
    altVi: "Toàn cảnh sân tennis với chung cư phía sau",
    captionEn: "Courts with seating areas, set against the Gia Hòa skyline.",
    captionVi: "Sân tennis và khu nghỉ, phía sau là khu dân cư Gia Hòa.",
  },
  {
    src: "/introduction/court-04.png",
    altEn: "Elevated view of courts with apartment towers",
    altVi: "Góc nhìn cao sân tennis và các tòa chung cư",
    captionEn: "Morning play on our blue and green hard courts.",
    captionVi: "Buổi sáng trên sân cứng mặt xanh dương và xanh lá.",
  },
  {
    src: "/introduction/court-05.png",
    altEn: "Tennis courts seen through a green fence",
    altVi: "Sân tennis nhìn qua hàng rào xanh",
    captionEn: "A peaceful view of the courts from outside the fence.",
    captionVi: "Khung cảnh yên bình nhìn sân từ ngoài hàng rào.",
  },
  {
    src: "/introduction/court-06.png",
    altEn: "Player on court with apartment buildings in background",
    altVi: "Vận động viên trên sân với chung cư phía sau",
    captionEn: "Well-lit courts equipped for day and evening play.",
    captionVi: "Sân có hệ thống chiếu sáng phục vụ ban ngày và buổi tối.",
  },
  {
    src: "/introduction/court-07.png",
    altEn: "Players on a sunny outdoor tennis court",
    altVi: "Người chơi trên sân ngoài trời đầy nắng",
    captionEn: "Active matches on our professional blue-surface courts.",
    captionVi: "Các trận đấu sôi nổi trên sân mặt xanh chuyên nghiệp.",
  },
  {
    src: "/introduction/court-08.png",
    altEn: "Tennis match during golden morning light",
    altVi: "Trận đấu tennis dưới ánh nắng buổi sáng",
    captionEn: "A sunny morning match under clear skies.",
    captionVi: "Trận đấu buổi sáng dưới bầu trời trong xanh.",
  },
  {
    src: "/introduction/court-09.png",
    altEn: "Player resting at the net post",
    altVi: "Vận động viên đứng cạnh cột lưới",
    captionEn: "Players enjoying the vibrant court surface.",
    captionVi: "Người chơi tận hưởng mặt sân xanh tươi sáng.",
  },
  {
    src: "/introduction/court-10.png",
    altEn: "Player holding tennis balls at the net",
    altVi: "Vận động viên cầm bóng tennis bên lưới",
    captionEn: "Ready for the next point on court.",
    captionVi: "Sẵn sàng cho điểm tiếp theo trên sân.",
  },
  {
    src: "/introduction/court-11.png",
    altEn: "Wide court view with umpire chair and players",
    altVi: "Toàn cảnh sân với ghế trọng tài và người chơi",
    captionEn: "Spacious courts with umpire seating and shade shelters.",
    captionVi: "Sân rộng rãi với ghế trọng tài và khu che nắng.",
  },
  {
    src: "/introduction/court-12.png",
    altEn: "Doubles match viewed through the court fence",
    altVi: "Trận đôi nhìn qua hàng rào sân",
    captionEn: "Doubles in action on a bright afternoon.",
    captionVi: "Trận đôi sôi động vào buổi chiều nắng đẹp.",
  },
  {
    src: "/introduction/court-13.png",
    altEn: "Doubles match at sunrise or sunset",
    altVi: "Trận đôi lúc bình minh hoặc hoàng hôn",
    captionEn: "Golden-hour play as the sun sets behind the trees.",
    captionVi: "Thi đấu lúc hoàng hôn khi mặt trời lặn sau hàng cây.",
  },
];

export function getPhotoAlt(photo: IntroPhoto, locale: Locale) {
  return locale === "vi" ? photo.altVi : photo.altEn;
}

export function getPhotoCaption(photo: IntroPhoto, locale: Locale) {
  return locale === "vi" ? photo.captionVi : photo.captionEn;
}
