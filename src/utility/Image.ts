import { toJpeg } from 'html-to-image';

export async function exportScheduleAsImage(dark: boolean) {
  const element = document.getElementById('schedule');
  if (!element) {
    return false;
  }
  const data = await toJpeg(element, {
    backgroundColor: dark ? '#262626' : '#ffffff',
  });

  const link = document.createElement('a');
  link.download = 'schedule.jpeg';
  link.href = data;
  link.click();

  return true;
}
