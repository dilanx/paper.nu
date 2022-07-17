import html2canvas from 'html2canvas';
import { toJpeg } from 'html-to-image';

export async function downloadImage(id: string) {
    const element = document.getElementById(id);
    if (!element) {
        return false;
    }
    const canvas = await html2canvas(element);

    const data = canvas.toDataURL('image/jpg');
    const link = document.createElement('a');

    if (typeof link.download === 'string') {
        link.href = data;
        link.download = 'image.jpg';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        window.open(data);
    }

    return true;
}

export async function downloadScheduleAsImage(dark: boolean) {
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
