import slugify from 'slugify';
import { nanoid } from 'nanoid';

export const createUniqueSlug = (text, idLength = 9) => {
  if (!text || typeof text !== 'string') return `draft-${nanoid(idLength)}`;

  // 1. Cấu hình quy đổi ký tự tiếng Việt mở rộng
  slugify.extend({
    '&': 'va',
    '@': 'at',
    'đ': 'd',
    'Đ': 'd',
  });

  // 2. Tạo phần slug SEO từ tiêu đề
  const baseSlug = slugify(text, {
    replacement: '-',
    remove: /[*+~.()'"!:@?#%^&=[\]{}|<>/\\`]/g,
    lower: true,
    strict: true,
    locale: 'vi',
    trim: true,
  });

  // 3. Tạo ID ngẫu nhiên bằng nanoid với độ dài tùy chọn
  const uniqueId = nanoid(idLength);

  // Tránh trường hợp tiêu đề chỉ chứa ký tự đặc biệt khiến baseSlug bị rỗng
  return baseSlug ? `${baseSlug}-${uniqueId}` : uniqueId;
};