export type Locale = "en" | "vi";

export const LOCALE_COOKIE = "lang";
export const DEFAULT_LOCALE: Locale = "vi";

export function normalizeLocale(value?: string | null): Locale {
  return value === "en" ? "en" : "vi";
}

const en = {
  langName: "English",
  siteTitle: "Xanh Tennis Reservation",
  siteDescription: "Book tennis courts online.",
  backHome: "← Back to home",
  backCourts: "← Back to all courts",
  reserveCourt: "Reserve Court",

  // Home
  homeTitle: "Tennis Court Reservations",
  homeSubtitle: "Choose a court, view availability, and reserve your time.",
  viewCourts: "View Courts",
  viewRates: "View Court Rates",

  // Courts list
  selectCourt: "Select a Court",
  selectCourtSubtitle: "Choose a court to view availability.",
  viewSchedule: "View Schedule",

  // Court page
  selectStartTime: "Select a start time.",

  // Booking (CourtBooking + BookingForm)
  today: "Today",
  tomorrow: "Tomorrow",
  daysSuffix: "Days",
  availableStartTimes: "Available Start Times",
  reserved: "Reserved",
  duration: "Duration",
  hour: "Hour",
  hours: "Hours",
  selectedBooking: "Selected Booking",
  selectedCourt: "Selected Court",
  court: "Court",
  date: "Date",
  startTime: "Start Time",
  estimatedPrice: "Estimated Price",
  contactInformation: "Contact Information",
  fullName: "Full Name",
  phoneNumber: "Phone Number",
  emailAddress: "Email Address",
  completeContact: "Please complete all contact information.",
  booking: "Booking…",
  errCourtTaken:
    "This court is already booked during that time. Please choose another time.",
  errGeneric:
    "Something went wrong with your reservation. Please try again.",

  // Pricing
  courtPricing: "Court Pricing",
  pricingSubtitle: "Rates vary by time of day.",
  timeSlot: "Time Slot",
  hourlyRate: "Hourly Rate",
  pricingNote:
    "Payment is collected at the court after your reservation is confirmed.",
  tierEarlyMorning: "Early morning",
  tierMorning: "Morning",
  tierLateMorning: "Late morning",
  tierDaytime: "Daytime",
  tierAfternoon: "Afternoon",
  tierLateAfternoon: "Late afternoon",
  tierEveningPeak: "Evening peak",

  // Confirmation
  reservationConfirmed: "Reservation Confirmed",
  bookedSuccess: "Your court has been booked successfully.",
  reference: "Reference",
  name: "Name",
  phone: "Phone",
  email: "Email",
  time: "Time",
  price: "Price",
  paymentAtCourt: "Payment will be collected at the court.",
  noReservation: "No reservation found.",
  reservationNotFound: "Reservation not found.",

  // Book page
  reserveACourt: "Reserve a Court",
  bookSubtitle: "Choose your time and review the price before booking.",
};

const vi: typeof en = {
  langName: "Tiếng Việt",
  siteTitle: "Đặt sân Tennis Xanh",
  siteDescription: "Đặt sân tennis trực tuyến.",
  backHome: "← Về trang chủ",
  backCourts: "← Về danh sách sân",
  reserveCourt: "Đặt sân",

  // Home
  homeTitle: "Đặt Sân Tennis",
  homeSubtitle: "Chọn sân, xem lịch trống và đặt giờ chơi của bạn.",
  viewCourts: "Xem sân",
  viewRates: "Xem bảng giá",

  // Courts list
  selectCourt: "Chọn Sân",
  selectCourtSubtitle: "Chọn một sân để xem lịch trống.",
  viewSchedule: "Xem lịch",

  // Court page
  selectStartTime: "Chọn giờ bắt đầu.",

  // Booking
  today: "Hôm nay",
  tomorrow: "Ngày mai",
  daysSuffix: "ngày",
  availableStartTimes: "Giờ bắt đầu còn trống",
  reserved: "Đã đặt",
  duration: "Thời lượng",
  hour: "Giờ",
  hours: "Giờ",
  selectedBooking: "Thông tin đặt sân",
  selectedCourt: "Sân đã chọn",
  court: "Sân",
  date: "Ngày",
  startTime: "Giờ bắt đầu",
  estimatedPrice: "Giá tạm tính",
  contactInformation: "Thông tin liên hệ",
  fullName: "Họ và tên",
  phoneNumber: "Số điện thoại",
  emailAddress: "Địa chỉ email",
  completeContact: "Vui lòng điền đầy đủ thông tin liên hệ.",
  booking: "Đang đặt…",
  errCourtTaken:
    "Sân này đã được đặt trong khung giờ đó. Vui lòng chọn giờ khác.",
  errGeneric: "Đã có lỗi xảy ra với đặt sân của bạn. Vui lòng thử lại.",

  // Pricing
  courtPricing: "Bảng Giá Sân",
  pricingSubtitle: "Giá thay đổi theo khung giờ trong ngày.",
  timeSlot: "Khung giờ",
  hourlyRate: "Giá theo giờ",
  pricingNote: "Thanh toán tại sân sau khi đặt sân được xác nhận.",
  tierEarlyMorning: "Sáng sớm",
  tierMorning: "Buổi sáng",
  tierLateMorning: "Cuối buổi sáng",
  tierDaytime: "Ban ngày",
  tierAfternoon: "Buổi chiều",
  tierLateAfternoon: "Cuối buổi chiều",
  tierEveningPeak: "Giờ cao điểm tối",

  // Confirmation
  reservationConfirmed: "Đặt Sân Thành Công",
  bookedSuccess: "Sân của bạn đã được đặt thành công.",
  reference: "Mã đặt sân",
  name: "Tên",
  phone: "Điện thoại",
  email: "Email",
  time: "Giờ",
  price: "Giá",
  paymentAtCourt: "Thanh toán sẽ được thu tại sân.",
  noReservation: "Không tìm thấy đặt sân.",
  reservationNotFound: "Không tìm thấy đặt sân.",

  // Book page
  reserveACourt: "Đặt Sân",
  bookSubtitle: "Chọn giờ và xem giá trước khi đặt sân.",
};

export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = { en, vi };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}

// Court names are stored in the database as "Court 1".
// This only changes how they are displayed, not the stored value.
export function displayCourt(court: string, locale: Locale): string {
  return locale === "vi" ? court.replace("Court", "Sân") : court;
}
