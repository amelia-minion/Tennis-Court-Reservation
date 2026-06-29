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
  coachLoginLink: "Coach login",

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
  errOutsideWindow:
    "Reservations can only be made up to 6 days in advance.",
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

  // Coach
  coachLoginTitle: "Head Coach Login",
  coachLoginSubtitle: "Sign in to view reservations and schedule lessons.",
  coachEmail: "Email",
  coachPassword: "Password",
  coachPasswordPlaceholder: "Password",
  coachLoginButton: "Log In",
  coachLoginInvalid: "Invalid email or password. Please try again.",
  coachBackToSite: "← Back to site",
  coachDashboardTitle: "Head Coach Dashboard",
  coachSignedInAs: "Signed in as",
  coachLogOut: "Log Out",
  coachScheduleLesson: "Schedule a Lesson",
  coachLessonTitlePlaceholder: "Lesson title (e.g. Beginner Group)",
  coachSelectCourt: "Select court",
  coachDuration1Hour: "1 hour",
  coachDuration2Hours: "2 hours",
  coachDuration3Hours: "3 hours",
  coachRepeatWeekly: "Repeat this lesson weekly?",
  coachRepeatNo: "No",
  coachRepeatYes: "Yes",
  coachRepeatWeeklyHint:
    "Weekly lessons are created only for dates within the next 30 days.",
  coachNotesPlaceholder: "Notes (optional)",
  coachScheduleButton: "Schedule Lesson",
  coachScheduling: "Scheduling…",
  coachErrCourtTaken:
    "This court is already booked during that time{date}. Choose another slot.",
  coachErrOutsideWindow:
    "Lessons can only be scheduled within the next 30 days.",
  coachErrLessonsTableMissing:
    "Lessons table is not set up yet. Run supabase/lessons.sql in your Supabase SQL Editor.",
  coachErrGeneric:
    "Could not schedule the lesson. Please check all fields and try again.",
  coachErrUnauthorized:
    "Your session expired. Please log in again to schedule lessons.",
  coachSuccessLesson: "Lesson scheduled successfully.",
  coachSuccessWeeklyLessons: "{count} weekly lessons scheduled successfully.",
  coachSeriesGroupingHint:
    " Run supabase/lessons-recurring.sql in Supabase to enable weekly series grouping.",
  coachCalendarTitle: "Schedule Calendar",
  coachCalendarSubtitle: "Reservations and lessons · {start} through {end}",
  coachLegendReservation: "Customer reservation",
  coachLegendLesson: "Coach lesson",
  coachLessonsTableMissing:
    "Lessons table not set up yet. Run supabase/lessons.sql in your Supabase SQL Editor.",
  coachNoEvents: "No reservations or lessons in the next 30 days yet.",
  coachRemove: "Remove",
  coachModalReservation: "Customer reservation",
  coachModalLesson: "Coach lesson",
  coachModalClose: "Close",
  coachModalWeekly: "Part of weekly series",
  coachModalDeleteLesson: "Delete lesson",
  coachModalNotes: "Notes",
  coachModalLessonTitle: "Lesson",
  coachLane: "Lane {lane}: {court}",
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
  coachLoginLink: "Đăng nhập huấn luyện viên",

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
  errOutsideWindow:
    "Chỉ có thể đặt sân trước tối đa 6 ngày.",
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

  // Coach
  coachLoginTitle: "Đăng nhập huấn luyện viên",
  coachLoginSubtitle: "Đăng nhập để xem đặt sân và lên lịch dạy.",
  coachEmail: "Email",
  coachPassword: "Mật khẩu",
  coachPasswordPlaceholder: "Mật khẩu",
  coachLoginButton: "Đăng nhập",
  coachLoginInvalid: "Email hoặc mật khẩu không đúng. Vui lòng thử lại.",
  coachBackToSite: "← Về trang chủ",
  coachDashboardTitle: "Bảng Điều Khiển Huấn Luyện Viên",
  coachSignedInAs: "Đăng nhập với",
  coachLogOut: "Đăng xuất",
  coachScheduleLesson: "Lên Lịch Buổi Dạy",
  coachLessonTitlePlaceholder: "Tên buổi dạy (vd: Nhóm người mới)",
  coachSelectCourt: "Chọn sân",
  coachDuration1Hour: "1 giờ",
  coachDuration2Hours: "2 giờ",
  coachDuration3Hours: "3 giờ",
  coachRepeatWeekly: "Lặp lại hàng tuần?",
  coachRepeatNo: "Không",
  coachRepeatYes: "Có",
  coachRepeatWeeklyHint:
    "Các buổi dạy hàng tuần chỉ được tạo trong vòng 30 ngày tới.",
  coachNotesPlaceholder: "Ghi chú (tuỳ chọn)",
  coachScheduleButton: "Lên lịch",
  coachScheduling: "Đang lên lịch…",
  coachErrCourtTaken:
    "Sân này đã được đặt trong khung giờ đó{date}. Vui lòng chọn khung giờ khác.",
  coachErrOutsideWindow:
    "Chỉ có thể lên lịch dạy trong vòng 30 ngày tới.",
  coachErrLessonsTableMissing:
    "Bảng lessons chưa được thiết lập. Chạy supabase/lessons.sql trong Supabase SQL Editor.",
  coachErrGeneric:
    "Không thể lên lịch buổi dạy. Vui lòng kiểm tra các trường và thử lại.",
  coachErrUnauthorized:
    "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để lên lịch buổi dạy.",
  coachSuccessLesson: "Đã lên lịch buổi dạy thành công.",
  coachSuccessWeeklyLessons: "Đã lên lịch {count} buổi dạy hàng tuần thành công.",
  coachSeriesGroupingHint:
    " Chạy supabase/lessons-recurring.sql trong Supabase để nhóm các buổi dạy hàng tuần.",
  coachCalendarTitle: "Lịch Sân",
  coachCalendarSubtitle: "Đặt sân và buổi dạy · {start} đến {end}",
  coachLegendReservation: "Khách đặt sân",
  coachLegendLesson: "Buổi dạy",
  coachLessonsTableMissing:
    "Bảng lessons chưa được thiết lập. Chạy supabase/lessons.sql trong Supabase SQL Editor.",
  coachNoEvents: "Chưa có đặt sân hoặc buổi dạy nào trong 30 ngày tới.",
  coachRemove: "Xóa",
  coachModalReservation: "Khách đặt sân",
  coachModalLesson: "Buổi dạy",
  coachModalClose: "Đóng",
  coachModalWeekly: "Thuộc chuỗi hàng tuần",
  coachModalDeleteLesson: "Xóa buổi dạy",
  coachModalNotes: "Ghi chú",
  coachModalLessonTitle: "Buổi dạy",
  coachLane: "Hàng {lane}: {court}",
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

export function localeTag(locale: Locale) {
  return locale === "vi" ? "vi-VN" : "en-US";
}

export function shortCourtLabel(court: string, locale: Locale) {
  const number = court.replace("Court ", "");
  return locale === "vi" ? `S${number}` : `C${number}`;
}
