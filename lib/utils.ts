export function formatDate(dateString: string, locale: string = 'en'): string {
  const date = new Date(dateString);

  if (locale === 'hy') {
    return date.toLocaleDateString('hy-AM', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  if (locale === 'ru') {
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function truncate(text: string, length: number): string {
  return text.length > length ? text.substring(0, length) + '...' : text;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
