import { ElMessage } from 'element-plus';
import { GITHUB_URL } from './github';

export const openLink = (url: string): void => {
  window.open(url, '_blank');
};

export const goToGitHub = (): void => {
  openLink(GITHUB_URL);
};

export const scrollToTop = (): void => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export const scrollToInstall = (): void => {
  document
    .getElementById('installation')
    ?.scrollIntoView({ behavior: 'smooth' });
};

export const copyToClipboard = async (
  text: string | undefined,
): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text || '');
    ElMessage.success('Đã sao chép vào clipboard!');
  } catch {
    ElMessage.error('Không thể sao chép');
  }
};
