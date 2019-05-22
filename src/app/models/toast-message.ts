export class ToastMessage {
  content: string;
  style: string;
  constructor(content, style?) {
    this.content = content;
    this.style = style || 'info';
  }
}
