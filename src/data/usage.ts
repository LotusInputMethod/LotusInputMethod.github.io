export interface SettingInfo {
  option: string;
  description: string;
  default: string;
}

export const quickSettings: SettingInfo[] = [
  {
    option: 'Output Charset',
    description: 'Chọn bảng mã đầu ra',
    default: 'Unicode',
  },
  {
    option: 'Spell Check',
    description: 'Kiểm tra lỗi chính tả bằng từ điển',
    default: 'Bật',
  },
  { option: 'Macro', description: 'Bật/tắt gõ tắt', default: 'Bật' },
  {
    option: 'Capitalize Macro',
    description: 'Tự động viết hoa từ gõ tắt',
    default: 'Bật',
  },
  {
    option: 'Auto Non-VN Restore',
    description: 'Tự động khôi phục khi gõ từ không phải tiếng Việt',
    default: 'Bật',
  },
  {
    option: 'Custom Dictionary',
    description: 'Sử dụng từ điển cá nhân',
    default: 'Tắt',
  },
];

export interface AdvancedSettingInfo {
  page: string;
  option: string;
  feature: string;
}

export const advancedSettings: AdvancedSettingInfo[] = [
  {
    page: 'General',
    option: 'Input Method',
    feature: 'Kiểu gõ chính (Telex, VNI, ...)',
  },
  {
    page: 'General',
    option: 'Output Charset',
    feature: 'Bảng mã ký tự đầu ra (Unicode, VNI, TCVN3, ...)',
  },
  {
    page: 'General',
    option: 'Mode Menu Hotkey',
    feature: 'Phím tắt mở menu chuyển chế độ gõ',
  },
  {
    page: 'General',
    option: 'Cycle Mode Hotkey',
    feature: 'Phím tắt chuyển nhanh vòng qua các chế độ gõ (mặc định chưa gán)',
  },
  {
    page: 'General',
    option: 'App Rules',
    feature: 'Gán chế độ gõ riêng cho từng ứng dụng hoặc cửa sổ',
  },
  {
    page: 'Typing',
    option: 'Type w to Produce ư',
    feature: 'Thiết lập cách gõ phím w để ra chữ ư',
  },
  {
    page: 'Typing',
    option: 'Enable Spell Check',
    feature: 'Bật/tắt kiểm tra chính tả tiếng Việt bằng từ điển',
  },
  {
    page: 'Typing',
    option: 'Use oà, uý (Instead Of òa, úy)',
    feature: 'Sử dụng chuẩn bỏ dấu mới cho oà, uý',
  },
  {
    page: 'Typing',
    option: 'Allow Type With More Freedom',
    feature: 'Cho phép bỏ dấu tự do ở bất kỳ vị trí nào trong từ',
  },
  {
    page: 'Typing',
    option: 'Allow dd to Produce đ',
    feature:
      'Cho phép gõ dd ra đ ngay cả khi Auto Restore Invalid Words đang bật',
  },
  {
    page: 'Typing',
    option: 'Fix Uinput Mode With Ack',
    feature: 'Sửa lỗi dính phím trên một số ứng dụng (như Chromium)',
  },
  {
    page: 'Typing',
    option: 'Double Space to Period',
    feature: 'Nhấn dấu cách 2 lần để gõ dấu chấm (Thử nghiệm)',
  },
  {
    page: 'Typing',
    option: 'Auto Capitalize',
    feature: 'Tự động viết hoa sau dấu câu (. ! ? Enter)',
  },
  {
    page: 'Typing',
    option: 'Bracket Transform',
    feature:
      'Gõ [ → ơ, ] → ư, { → Ơ, } → Ư (Disabled / Non-Start / Everywhere)',
  },
  {
    page: 'Typing',
    option: 'Double Hyphen to Em-Dash',
    feature: 'Gõ -- thành dấu gạch ngang dài (—)',
  },
  {
    page: 'Appearance',
    option: 'Use Lotus Status Icons',
    feature: 'Sử dụng bộ icon riêng của Lotus trên thanh trạng thái',
  },
  {
    page: 'Appearance',
    option: 'Icon Color',
    feature: 'Màu sắc biểu tượng (Auto, Light, Dark)',
  },
  {
    page: 'Macros',
    option: 'Macro Editor',
    feature: 'Quản lý danh sách các từ viết tắt cá nhân',
  },
  {
    page: 'Macros',
    option: 'Macro in Off Mode',
    feature: 'Cho phép gõ tắt hoạt động cả khi bộ gõ ở chế độ OFF',
  },
  {
    page: 'Macros',
    option: 'Time Format',
    feature: 'Định dạng $TIME trong gõ tắt (mặc định %H:%M)',
  },
  {
    page: 'Macros',
    option: 'Date Format',
    feature: 'Định dạng $DATE trong gõ tắt (mặc định %d/%m/%Y)',
  },
  {
    page: 'Shortcuts',
    option: 'Mode Order',
    feature: 'Thứ tự hiển thị các chế độ gõ trong menu chuyển chế độ',
  },
  {
    page: 'Shortcuts',
    option: 'Show/Hide Modes',
    feature:
      'Bật/tắt hiển thị từng chế độ và đổi phím tắt riêng cho từng chế độ',
  },
  {
    page: 'Dictionary',
    option: 'Enable Custom Dictionary',
    feature:
      'Từ thêm vào từ điển sẽ không bị auto-restore (tên riêng, từ chuyên môn...)',
  },
  {
    page: 'Keymap',
    option: 'Custom Keymap',
    feature:
      'Tùy biến sơ đồ bàn phím, hỗ trợ preset Telex / VNI / VIQR / Microsoft layout',
  },
  {
    page: 'Backup',
    option: 'Backup & Restore',
    feature:
      'Xuất/nhập cấu hình JSON (Main Settings, Macros, Keymaps, App Rules, Dictionary)',
  },
];

export interface TypingMode {
  mode: string;
  shortcut: string;
  description: string;
}

export const typingModes: TypingMode[] = [
  {
    mode: 'Uinput (Smooth)',
    shortcut: '1',
    description: 'Chế độ mặc định, phản hồi cực nhanh và mượt mà.',
  },
  {
    mode: 'Uinput (Super Smooth)',
    shortcut: 'a',
    description:
      'Giống Uinput (Smooth) nhưng bỏ bước kiểm tra autofill — phản hồi nhanh nhất, không bao giờ xoá dôi ký tự.',
  },
  {
    mode: 'Uinput (Slow)',
    shortcut: '2',
    description: 'Tốc độ gửi phím chậm hơn, tăng khả năng tương thích.',
  },
  {
    mode: 'Minecraft',
    shortcut: '3',
    description: 'Chế độ đặc biệt tối ưu cho trò chơi Minecraft.',
  },
  {
    mode: 'Surrounding Text',
    shortcut: '4',
    description: 'Sử dụng kỹ thuật surrounding text (Qt/GTK/Wayland).',
  },
  {
    mode: 'Preedit',
    shortcut: 'Q',
    description: 'Hiển thị đường gạch chân khi đang gõ.',
  },
  {
    mode: 'Emoji Picker',
    shortcut: 'W',
    description: 'Mở bảng chọn nhanh Emoji với tìm kiếm thông minh.',
  },
  { mode: 'OFF', shortcut: 'E', description: 'Tắt tạm thời bộ gõ.' },
  {
    mode: 'Default Typing',
    shortcut: 'R',
    description: 'Khôi phục về chế độ gõ mặc định theo cấu hình.',
  },
];
